import { getSession, getUser } from '@/lib/auth';
import { sanitizeUser } from '@/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req.cookies.sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await getUser(session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return sanitized user data
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}