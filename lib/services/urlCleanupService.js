import db from '@/lib/db';

export async function deleteExpiredUrls() {
  const query = db.sql`
    DELETE FROM short_urls
    WHERE expires_at < NOW()
    OR created_at < NOW() - INTERVAL '60 days' AND (
      SELECT subscription_type_id 
      FROM user_subscriptions 
      WHERE user_id = short_urls.user_id 
      AND status = 'active'
      ORDER BY created_at DESC 
      LIMIT 1
    ) IS NULL -- Free tier users (no active subscription)
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