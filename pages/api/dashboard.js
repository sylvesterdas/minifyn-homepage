import db from '@/lib/db';
import { getUserFromToken } from '@/lib/authUtils';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const user = getUserFromToken(token)

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = user.userId;

      // Fetch total links and clicks
      const { rows: [stats] } = await db.query(db.sql`
        SELECT 
          COUNT(short_code) as total_links,
          SUM(clicks) as total_clicks
        FROM short_urls
        WHERE user_id = ${userId}
      `);

      // Fetch active plan
      const { rows: [subscription] } = await db.query(db.sql`
        SELECT st.display_name as active_plan
        FROM user_subscriptions us
        JOIN subscription_types st ON us.subscription_type_id = st.id
        WHERE us.user_id = ${userId} AND us.status = 'active'
        ORDER BY us.created_at DESC
        LIMIT 1
      `);

      // Fetch recent links
      const { rows: recentLinks } = await db.query(db.sql`
        SELECT short_code as short_url, original_url, clicks, created_at
        FROM short_urls
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 5
      `);

      res.status(200).json({
        totalLinks: stats.total_links,
        totalClicks: stats.total_clicks,
        activePlan: subscription?.active_plan || 'Free',
        recentLinks: recentLinks.map(link => ({
          ...link,
          shortUrl: `${process.env.BASE_URL}/${link.short_url}`
        }))
      });
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Error fetching dashboard data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}