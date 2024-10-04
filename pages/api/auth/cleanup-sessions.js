import { cleanupSessions } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Add some basic authentication for this endpoint
  // You might want to use a more secure method in production
  if (req.headers['x-api-key'] !== process.env.CLEANUP_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await cleanupSessions();
    res.status(200).json({ message: 'Sessions cleaned up successfully' });
  } catch (error) {
    console.error('Session cleanup failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}