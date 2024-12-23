import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { kv } from '@vercel/kv'
import { hashPassword } from '@/lib/auth';
import { emailService } from '@/lib/email/service';

const verifyRecaptcha = async (token) => {
  const secretKey = process.env.NEXT_RECAPTCHA_SECRET_KEY;
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    return data.success && data.score >= 0.5; // for v3, check score
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // Handle subscription data storage
    const { userId, paymentId, subscriptionId } = req.body;
    
    try {
      await db.query(db.sql`
        UPDATE user_subscriptions 
        SET payment_id = ${paymentId},
            subscription_id = ${subscriptionId},
            updated_at = NOW()
        WHERE user_id = ${userId}
      `);
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to store subscription:', error);
      return res.status(500).json({ error: 'Failed to store subscription' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, fullName, password, plan, recaptchaToken } = req.body;

    // Verify recaptcha
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Invalid recaptcha verification' });
    }

    // Start transaction
    await db.query(db.sql`BEGIN`);

    try {
      // Check if email exists
      const { rows: existingUsers } = await db.query(
        db.sql`SELECT id FROM users WHERE email = ${email}`
      );

      if (existingUsers.length > 0) {
        throw new Error('Email already exists');
      }

      // Create user
      const { rows: [user] } = await db.query(db.sql`
        INSERT INTO users (email, full_name, password_hash)
        VALUES (
          ${email}, 
          ${fullName}, 
          ${await hashPassword(password)}
        )
        RETURNING id, email, full_name, is_verified, is_admin
      `);

      // Create subscription
      await db.query(db.sql`
        INSERT INTO user_subscriptions (
          user_id,
          subscription_type_id,
          status,
          current_period_start,
          current_period_end
        )
        VALUES (
          ${user.id},
          (SELECT id FROM subscription_types WHERE name = ${plan}),
          ${plan === 'free' ? 'active' : 'pending'},
          NOW(),
          ${plan === 'free' ? 'NOW() + INTERVAL \'60 days\'' : 'NOW()'}
        )
      `);

      await db.query(db.sql`COMMIT`);

      // Create session
      const sessionId = uuidv4();
      await kv.set(`session:${sessionId}`, {
        userId: user.id,
        email: email.toLowerCase(),
        plan,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      });

      await emailService.sendVerification(user)

      // Set session cookie
      res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);

      return res.status(200).json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          subscriptionType: plan
        }
      });

    } catch (error) {
      await db.query(db.sql`ROLLBACK`);
      throw error;
    }
  } catch (error) {
    console.error('Signup failed:', error);
    return res.status(500).json({ 
      error: error.message === 'Email already exists' 
        ? 'This email is already registered' 
        : 'Failed to create account' 
    });
  }
}