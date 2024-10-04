import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Fetch user from Postgres
    const query = db.sql`
      SELECT u.*, st.name as "accountType" FROM users u
      LEFT JOIN subscription_types st
        ON st.id = u.subscription_type_id
      WHERE u.email = ${email}
    `;
    const { rows } = await db.query(query);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const sessionId = await createSession(user);

    res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    res.status(200).json({ user: {
      id: user.id,
      name: user.full_name || user.email,
      subscriptionType: user.accountType
    }});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
