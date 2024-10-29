import { validateApiRequest } from '@/lib/auth';
import { deleteShortUrl, getShortUrlByCode } from '@/lib/urlShortener';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { shortCode } = req.query;

  try {
    const validation = await validateApiRequest(req);
    if (validation.error) {
      return res.status(validation.status).json({ error: validation.error });
    }
    const { user, session } = validation;

    const shortUrl = await getShortUrlByCode(shortCode);
    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    if (shortUrl.user_id !== session.userId && !user.is_admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const deleted = await deleteShortUrl(shortCode, session.userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Short URL not found or already deleted' });
    }

    res.status(200).json({ message: 'Short URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting short URL:', error);
    res.status(500).json({ error: 'Failed to delete short URL' });
  }
}