import { flushAnalyticsBuffer } from '../../lib/analytics';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await flushAnalyticsBuffer();
    res.status(200).json({ message: 'Analytics buffer flushed successfully' });
  } catch (error) {
    console.error('Error flushing analytics buffer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
