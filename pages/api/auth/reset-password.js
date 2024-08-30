import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, newPassword } = req.body;

  try {
    // Fetch reset token data
    const getTokenQuery = db.sql`
      SELECT * FROM reset_tokens
      WHERE token = ${token} AND expiry > NOW()
    `;
    const { rows: tokenRows } = await db.query(getTokenQuery);

    if (tokenRows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const resetData = tokenRows[0];

    // Fetch user
    const getUserQuery = db.sql`
      SELECT * FROM users WHERE id = ${resetData.user_id}
    `;
    const { rows: userRows } = await db.query(getUserQuery);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    const updatePasswordQuery = db.sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${user.id}
    `;
    await db.query(updatePasswordQuery);

    // Delete used reset token
    const deleteTokenQuery = db.sql`
      DELETE FROM reset_tokens
      WHERE token = ${token}
    `;
    await db.query(deleteTokenQuery);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}