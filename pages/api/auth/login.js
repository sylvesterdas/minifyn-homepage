import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, AuthError, sanitizeUser } from '@/lib/authUtils';
import { createSession } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const emailError = validateEmail(email);
    if (emailError) throw new AuthError(emailError);

    const passwordError = validatePassword(password, false);
    if (passwordError) throw new AuthError(passwordError);

    // Get user with subscription info
    const { rows: users } = await db.query(db.sql`
      SELECT 
        u.id, 
        u.email, 
        u.password_hash,
        u.full_name,
        u.is_verified,
        u.is_admin,
        COALESCE(us.subscription_type, 'free') as subscription_type
      FROM users u
      LEFT JOIN active_subscriptions us ON us.user_id = u.id
      WHERE u.email = ${email.toLowerCase()}
    `);
   
    if (users.length === 0) {
      throw new AuthError('Invalid email or password', 401);
    }
   
    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new AuthError('Invalid email or password', 401);
    }

    // Create session
    const sessionId = await createSession(req, user);

    // Clear guest session and set session cookie
    res.setHeader(
      'Set-Cookie', 
      [
        'guestSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${
          process.env.NODE_ENV === 'production' ? '; Secure' : ''
        }`
      ]
    );

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.statusCode || 500).json({ 
      error: error instanceof AuthError ? error.message : 'Login failed'
    });
  }
}