import db from '@/lib/db';
import { passwordResetUtils } from '@/lib/password-reset-utils';
import { hashPassword } from '@/lib/auth';
import { verifyCaptcha } from '@/lib/captcha';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, password, recaptchaToken } = req.body;

  if (!token || !password || !recaptchaToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Verifying recaptcha...'); // Debug log
    const recaptchaValid = await verifyCaptcha(recaptchaToken, req);
    if (!recaptchaValid) {
      return res.status(400).json({ error: 'Invalid verification' });
    }

    console.log('Validating reset token...'); // Debug log
    const userId = await passwordResetUtils.validateResetToken(token);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    console.log('Updating password...'); // Debug log
    const hashedPassword = await hashPassword(password);
    await db.query(db.sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, "updatedAt" = NOW()
      WHERE id = ${userId}
    `);

    await passwordResetUtils.invalidateResetToken(token);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}