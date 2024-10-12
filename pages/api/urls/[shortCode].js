import { getSession } from '@/lib/auth';
import { deleteShortUrl, getShortUrlByCode } from '@/lib/urlShortener';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { shortCode } = req.query;

  try {
    // Get user session
    const session = await getSession(req.cookies.sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the short URL exists and belongs to the user
    const shortUrl = await getShortUrlByCode(shortCode);
    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    if (shortUrl.user_id !== session.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the short URL
    const deleted = await deleteShortUrl(shortCode, session.userId);
    if (deleted) {
      res.status(200).json({ message: 'Short URL deleted successfully' });
    } else {
      res.status(404).json({ error: 'Short URL not found or already deleted' });
    }
  } catch (error) {
    console.error('Error deleting short URL:', error);
    res.status(500).json({ error: 'Failed to delete short URL' });
  }
}