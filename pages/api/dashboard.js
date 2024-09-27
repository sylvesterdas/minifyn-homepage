import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const sessionId = req.cookies.sessionId;
      if (!sessionId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const session = await getSession(sessionId);
      if (!session) {
        return res.status(401).json({ error: 'Invalid session' });
      }

      const userId = session.userId;
      console.log(userId)

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

      console.log(stats, subscription, recentLinks)

      const data = {
        totalLinks: stats.total_links,
        totalClicks: stats.total_clicks,
        activePlan: subscription?.active_plan || 'free',
        recentLinks: recentLinks.map(link => ({
          ...link,
          shortUrl: `${process.env.BASE_URL}/${link.short_url}`
        }))
      };

      res.status(200).json(data);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Error fetching dashboard data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}