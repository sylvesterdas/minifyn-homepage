import db from '@/lib/db';
import { emailService } from '@/lib/email/service';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { token } = req.body;
      const userId = await emailService.verifyToken(token);
      
      if (!userId) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      await db.query(
        db.sql`UPDATE users SET is_verified = true WHERE id = ${userId}`
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Verification error:', error);
      return res.status(500).json({ error: 'Verification failed' });
    }
  }
  
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}