import db from '@/lib/db';
import { passwordResetUtils } from '@/lib/password-reset-utils';
import { emailService } from '@/lib/email/service';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const { rows } = await db.query(db.sql`
      SELECT id, email, full_name FROM users WHERE email = ${email.toLowerCase()}
    `);

    if (rows.length === 0) {
      return res.status(200).json({ message: 'If an account exists with this email, you will receive a password reset link.' });
    }

    const user = rows[0];
    const token = await passwordResetUtils.createResetToken(user.id);
    const resetLink = passwordResetUtils.getResetLink(token);

    await emailService.sendPasswordReset({
      email: user.email,
      name: user.full_name,
      resetLink
    });

    res.status(200).json({ message: 'If an account exists with this email, you will receive a password reset link.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}