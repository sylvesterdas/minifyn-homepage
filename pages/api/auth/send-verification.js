import { EmailSender } from '@/lib/email/sender';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email, userId } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    
    await kv.set(`verify:${token}`, userId, {
      ex: emailConfig.limits.verificationTTL
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;
    
    const emailSender = new EmailSender();
    await emailSender.send(email, 'verification', { verificationUrl }, userId);
    
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send verification email' });
  }
}