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
        st.name as subscription_type
      FROM users u
      LEFT JOIN user_subscriptions us ON us.user_id = u.id
      LEFT JOIN subscription_types st ON st.id = us.subscription_type_id
      WHERE u.email = ${email.toLowerCase()}
      AND us.status = 'active'
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
    const sessionId = await createSession(user);

    // Set session cookie
    res.setHeader(
      'Set-Cookie',
      `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );

    // Return sanitized user data
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.statusCode || 500).json({ 
      error: error instanceof AuthError ? error.message : 'Login failed'
    });
  }
}