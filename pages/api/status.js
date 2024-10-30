import { getSystemMetrics } from '@/lib/statusService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const metrics = await getSystemMetrics();
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Status Fetch Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}