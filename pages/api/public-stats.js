import db from '@/lib/db';
import { kv } from '@vercel/kv';

const CACHE_KEY = 'public:stats';
const CACHE_TTL = 300; // 5 minutes

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to get cached stats first
    const cachedStats = await kv.get(CACHE_KEY);
    if (cachedStats) {
      return res.status(200).json(cachedStats);
    }

    // Get popular links (non-expired, active, with high clicks)
    const { rows: popularLinks } = await db.query(
      db.sql`SELECT
        s.short_code,
        s.title,
        s.clicks,
        s.created_at,
        u.subscription_type_id
      FROM short_urls s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
        AND (s.expires_at IS NULL OR s.expires_at > NOW())
        AND s.title IS NOT NULL
        AND s.clicks > 100
      ORDER BY s.clicks DESC
      LIMIT 5`
    );

    // Get global stats
    const { rows: [totalClicksResult] } = await db.query(
      db.sql`SELECT SUM(clicks) as total FROM short_urls WHERE is_active = true`
    );

    const { rows: [totalLinksResult] } = await db.query(
      db.sql`SELECT COUNT(*) as total FROM short_urls WHERE is_active = true`
    );

    const { rows: [activeUsersResult] } = await db.query(
      db.sql`SELECT COUNT(DISTINCT user_id) as total FROM short_urls WHERE user_id IS NOT NULL`
    );

    const stats = {
      popularLinks: popularLinks.map(link => ({
        shortCode: link.short_code,
        title: link.title,
        clicks: link.clicks,
        isPro: !!link.subscription_type_id
      })),
      totalClicks: parseInt(totalClicksResult.total) || 0,
      totalLinks: parseInt(totalLinksResult.total) || 0,
      activeUsers: parseInt(activeUsersResult.total) || 0
    };

    // Cache for 5 minutes
    await kv.set(CACHE_KEY, stats, { ex: CACHE_TTL });

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}