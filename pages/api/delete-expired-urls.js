import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await db.query(db.sql`SELECT delete_expired_short_urls()`);
    res.status(200).json({ message: 'Expired URLs deleted successfully' });
  } catch (error) {
    console.error('Error deleting expired URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}