import db from '../db';
import { getSubscriptionLimits } from './subscriptionService';

export async function getUrlAnalytics(shortCode, userId, subscriptionType, days = 30) {
  const limits = await getSubscriptionLimits(subscriptionType);
  const hasDetailedAnalytics = limits.apiCalls > 500; // Pro users have more than 500 API calls
  
  const { rows } = await db.query(db.sql`
    WITH daily_clicks AS (
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as clicks
      FROM analytics
      WHERE short_url_code = ${shortCode}
      AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE_TRUNC('day', created_at)
    )
    SELECT json_build_object(
      'totalClicks', (
        SELECT clicks 
        FROM short_urls 
        WHERE short_code = ${shortCode}
        AND user_id = ${userId}
      ),
      'clicksByDate', json_object_agg(date, clicks)
      ${hasDetailedAnalytics ? db.sql`, 
        'devices', (
          SELECT json_object_agg(device_type, count)
          FROM (
            SELECT device_type, COUNT(*) as count
            FROM analytics
            WHERE short_url_code = ${shortCode}
            GROUP BY device_type
          ) d
        ),
        'browsers', (
          SELECT json_object_agg(browser, count)
          FROM (
            SELECT browser, COUNT(*) as count
            FROM analytics
            WHERE short_url_code = ${shortCode}
            GROUP BY browser
          ) b
        ),
        'countries', (
          SELECT json_object_agg(country, count)
          FROM (
            SELECT country, COUNT(*) as count
            FROM analytics
            WHERE short_url_code = ${shortCode}
            GROUP BY country
          ) c
        )` : db.sql``}
    ) as analytics
    FROM daily_clicks
  `);

  return rows[0]?.analytics || null;
}