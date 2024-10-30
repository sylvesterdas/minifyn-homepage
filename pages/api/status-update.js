import { getSystemMetrics } from '@/lib/statusService';
import { verifyJWT } from '@/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = await verifyJWT(token);
    if (!decoded?.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const metrics = await getSystemMetrics();
    if (metrics) {
      res.status(200).json(metrics);
    } else {
      res.status(500).json({ error: 'Failed to update status' });
    }
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
