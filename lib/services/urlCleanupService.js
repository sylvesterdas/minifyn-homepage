import db from '@/lib/db';

export async function deleteExpiredUrls() {
  const query = db.sql`
    WITH user_subscription_status AS (
      SELECT DISTINCT ON (user_id) 
        user_id,
        subscription_type
      FROM active_subscriptions
      ORDER BY user_id, current_period_end DESC
    )
    DELETE FROM short_urls
    WHERE expires_at < NOW()
    OR created_at < NOW() - INTERVAL '60 days' AND NOT EXISTS (
      SELECT 1 
      FROM user_subscription_status 
      WHERE user_id = short_urls.user_id
    ) -- Free tier users (no active subscription)
    OR created_at < NOW() - INTERVAL '365 days' -- Pro tier max retention
    RETURNING id;
  `;

  const result = await db.query(query);
  return result.rowCount;
}

export async function deleteUserUrl(userId, shortCode) {
  // First delete from analytics to maintain referential integrity
  await db.query(db.sql`
    DELETE FROM analytics
    WHERE short_url_code = ${shortCode}
  `);

  // Then delete the URL
  const result = await db.query(db.sql`
    DELETE FROM short_urls
    WHERE user_id = ${userId}
    AND short_code = ${shortCode}
    RETURNING id
  `);

  return result.rowCount > 0;
}