import { validateApiRequest, getUser } from '@/lib/auth';
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const validation = await validateApiRequest(req);
    if (validation.error) {
      return res.status(validation.status).json({ error: validation.error });
    }
    const { user, session } = validation;

    const { full_name, email } = req.body;

    if (!full_name || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    if (email !== user.email) {
      const existingUser = await db.query(db.sql`
        SELECT id FROM users WHERE email = ${email} AND id != ${session.userId}
      `);

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      await db.query(db.sql`
        UPDATE users 
        SET 
          full_name = ${full_name},
          email = ${email},
          is_verified = false,
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${session.userId}
      `);
    } else {
      await db.query(db.sql`
        UPDATE users 
        SET 
          full_name = ${full_name},
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${session.userId}
      `);
    }

    const updatedUser = await getUser(session.userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}