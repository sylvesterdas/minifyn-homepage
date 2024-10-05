import { clearCache } from '@/lib/cache';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shortCode } = req.body;

  try {
    await clearCache(shortCode);
    res.status(200).json({ message: shortCode ? `Cache cleared for ${shortCode}` : 'All cache cleared' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
}