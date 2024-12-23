import { emailService } from '@/lib/email/service';
import { validateApiRequest } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = await validateApiRequest(req);
    if (auth.error) return res.status(auth.status).json({ error: auth.error });

    await emailService.sendVerification(auth.user);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Send verification error:', error);
    return res.status(500).json({ error: 'Failed to send verification email' });
  }
}