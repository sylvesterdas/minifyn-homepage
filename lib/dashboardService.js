import db from '@/lib/db';

export async function getDashboardData(userId) {
  const [stats, subscription, recentLinks, analytics, usage, limits] = await Promise.all([
    getStats(userId),
    getActiveSubscription(userId),
    getRecentLinks(userId),
    getAnalytics(userId),
    getUsage(userId),
    getLimits(userId),
  ]);

  return {
    totalLinks: stats.totalLinks,
    totalClicks: stats.totalClicks,
    activePlan: subscription?.displayName || 'Free',
    recentLinks: recentLinks.map(link => ({
      ...link,
      shortUrl: `${process.env.BASE_URL}/${link.shortCode}`
    })),
    analytics,
    usage,
    limits,
  };
}

async function getStats(userId) {
  const { rows: [stats] } = await db.query(db.sql`
    SELECT 
      COUNT(short_code) as "totalLinks",
      COALESCE(SUM(clicks), 0) as "totalClicks"
    FROM short_urls
    WHERE user_id = ${userId}
  `);
  return stats;
}

async function getActiveSubscription(userId) {
  const { rows: [subscription] } = await db.query(db.sql`
    SELECT plan_name as "displayName"
    FROM active_subscriptions
    WHERE user_id = ${userId}
    ORDER BY current_period_end DESC
    LIMIT 1
  `);
  return subscription;
 }

async function getRecentLinks(userId) {
  const { rows: recentLinks } = await db.query(db.sql`
    SELECT short_code as "shortCode", original_url as "originalUrl", clicks, created_at as "createdAt"
    FROM short_urls
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 5
  `);
  return recentLinks;
}

async function getAnalytics(userId) {
  const { rows } = await db.query(db.sql`
    SELECT DATE(created_at) as date, SUM(clicks) as clicks
    FROM short_urls
    WHERE user_id = ${userId} AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30
  `);
  return rows;
}

async function getUsage(userId) {
  const { rows: [usage] } = await db.query(db.sql`
    SELECT 
      COUNT(short_code) as "urlsCreated",
      COALESCE(SUM(clicks), 0) as "apiCalls"
    FROM short_urls
    WHERE user_id = ${userId} AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
  `);
  return usage;
}

async function getLimits(userId) {
  const { rows } = await db.query(db.sql`
    SELECT sl.limit_type, sl.limit_value
    FROM active_subscriptions us
    JOIN subscription_limits sl ON us.subscription_type_id = sl.subscription_type_id
    WHERE us.user_id = ${userId}
`);

  const limits = rows.reduce((acc, row) => {
    acc[row.limit_type] = row.limit_value;
    return acc;
  }, {});

  return {
    maxUrls: limits.max_urls || 10,
    maxApiCalls: limits.max_api_calls || 100
  };
}