import { kv } from '@vercel/kv';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { 
      email, 
      fullName, 
      password, 
      plan, 
      paymentId, 
      subscriptionId, 
      recaptchaToken 
    } = req.body;

    console.log('Processing signup:', { 
      email, 
      fullName, 
      plan, 
      paymentId: paymentId ? 'exists' : 'none',
      subscriptionId: subscriptionId ? 'exists' : 'none'
    });

    // Verify reCAPTCHA
    if (recaptchaToken) {
      console.log('Verifying reCAPTCHA...');
      const recaptchaRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.NEXT_RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        { method: 'POST' }
      );

      const recaptchaData = await recaptchaRes.json();
      if (!recaptchaData.success) {
        return res.status(400).json({ error: 'Invalid captcha' });
      }
    }

    // Verify pro plan subscription
    if (plan === 'pro' && subscriptionId) {
      try {
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        // Accept both created and active status for new subscriptions
        if (!['created', 'active', 'authenticated'].includes(subscription.status)) {
          console.error('Invalid subscription status:', subscription.status);
          return res.status(400).json({ error: 'Invalid subscription status' });
        }
      } catch (error) {
        console.error('Subscription verification error:', error);
        return res.status(400).json({ error: 'Failed to verify subscription' });
      }
    }

    // Check if email exists
    const { rows: [existingUser] } = await db.query(
      db.sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`
    );

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Start transaction
    await db.query(db.sql`BEGIN`);

    try {
      const userId = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      await db.query(db.sql`
        INSERT INTO users (
          id,
          email,
          password_hash,
          full_name,
          is_verified,
          created_at,
          "updatedAt"
        )
        VALUES (
          ${userId},
          ${email.toLowerCase()},
          ${hashedPassword},
          ${fullName.trim()},
          false,
          NOW(),
          NOW()
        )
      `);

      // Get subscription type
      const { rows: [subscriptionType] } = await db.query(db.sql`
        SELECT id FROM subscription_types 
        WHERE name = ${plan}
        LIMIT 1
      `);

      if (!subscriptionType) {
        throw new Error('Invalid subscription type');
      }

      // Create subscription
      await db.query(db.sql`
        INSERT INTO user_subscriptions (
          user_id,
          subscription_type_id,
          status,
          subscription_id,
          payment_id,
          current_period_start,
          current_period_end,
          created_at,
          updated_at
        )
        VALUES (
          ${userId},
          ${subscriptionType.id},
          ${plan === 'pro' ? 'active' : 'free'},
          ${subscriptionId || null},
          ${paymentId || null},
          NOW(),
          ${plan === 'pro' 
            ? db.sql`NOW() + INTERVAL '1 month'` 
            : db.sql`NOW() + INTERVAL '60 days'`
          },
          NOW(),
          NOW()
        )
      `);

      // If pro plan, create payment record
      if (plan === 'pro' && paymentId) {
        await db.query(db.sql`
          INSERT INTO invoices (
            id,
            user_id,
            amount,
            currency,
            status,
            invoice_date,
            paid_at,
            created_at,
            updated_at
          )
          VALUES (
            ${uuidv4()},
            ${userId},
            ${9900},
            'INR',
            'paid',
            NOW(),
            NOW(),
            NOW(),
            NOW()
          )
        `);
      }

      await db.query(db.sql`COMMIT`);

      // Create session
      const sessionId = uuidv4();
      await kv.set(`session:${sessionId}`, {
        userId,
        email: email.toLowerCase(),
        plan,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      });

      // Set session cookie
      res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`);
      
      return res.status(200).json({ 
        success: true,
        plan 
      });

    } catch (error) {
      console.error('Database transaction error:', error);
      await db.query(db.sql`ROLLBACK`);
      throw error;
    }

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}