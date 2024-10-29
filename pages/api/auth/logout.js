import { destroySession } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await destroySession(sessionId);
    }

    res.setHeader(
      'Set-Cookie', 
      `sessionId=deleted; HttpOnly; Path=/; Max-Age=-1; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
}