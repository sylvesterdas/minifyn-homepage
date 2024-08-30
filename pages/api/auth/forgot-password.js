import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';
// import sendEmail from '../../../lib/sendEmail'; // You'll need to implement this

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    // Check if user exists
    const checkUserQuery = db.sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    const { rows } = await db.query(checkUserQuery);

    if (rows.length === 0) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
    }

    const user = rows[0];

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token
    const insertTokenQuery = db.sql`
      INSERT INTO reset_tokens (token, user_id, expiry)
      VALUES (${resetToken}, ${user.id}, ${resetTokenExpiry})
    `;
    await db.query(insertTokenQuery);

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset',
    //   text: `Please use the following link to reset your password: ${resetUrl}`,
    // });

    res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}