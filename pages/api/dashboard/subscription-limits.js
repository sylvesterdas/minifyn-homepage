import { validateApiRequest } from '@/lib/auth';
import db from '@/lib/db';
import { kv } from '@vercel/kv';

const CACHE_PREFIX = 'subscription_limits:';
const CACHE_TTL = 60; // 1 minute

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = await validateApiRequest(req);
  if (validation.error) return res.status(401).json(validation);

  const userId = validation.session.userId;
  const cacheKey = `${CACHE_PREFIX}${userId}`;

  try {
    // Try cache first
    const cached = await kv.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Get current subscription info and URL count
    const { rows: [userData] } = await db.query(db.sql`
      WITH subscription_info AS (
        SELECT 
          subscription_type as plan_name,
          sl.limit_value as daily_url_limit,
          us.current_period_end
        FROM users u
        LEFT JOIN active_subscriptions us ON u.id = us.user_id
        LEFT JOIN subscription_limits sl ON us.subscription_type_id = sl.subscription_type_id 
          AND sl.limit_type = 'daily_urls'
        WHERE u.id = ${userId}
      ),
      daily_urls AS (
        SELECT COUNT(*) as today_count
        FROM short_urls
        WHERE user_id = ${userId}
        AND created_at > NOW() - INTERVAL '24 hours'
      )
      SELECT 
        COALESCE(si.plan_name, 'free') as plan_name,
        COALESCE(si.daily_url_limit, 10) as daily_url_limit,
        COALESCE(du.today_count, 0) as daily_url_count,
        si.current_period_end
      FROM subscription_info si
      CROSS JOIN daily_urls du
    `);

    // Prepare response
    const response = {
      planName: userData?.plan_name || 'Free',
      maxDailyUrls: userData?.daily_url_limit || 10,
      remainingLinks: Math.max(0, (userData?.daily_url_limit || 10) - (userData?.daily_url_count || 0)),
      periodEnd: userData?.current_period_end || null
    };

    // Cache the response
    await kv.set(cacheKey, response, { ex: CACHE_TTL });
    
    return res.json(response);

  } catch (error) {
    console.error('Error fetching subscription limits:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}