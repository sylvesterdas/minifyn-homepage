import db from './db';

export async function getApiKeys(userId) {
  const { rows } = await db.query(db.sql`
    SELECT 
      ak.*,
      sl.limit_value,
      us.subscription_type
    FROM api_keys ak
    JOIN active_subscriptions us ON ak.user_id = us.user_id
    JOIN subscription_limits sl ON us.subscription_type_id = sl.subscription_type_id
    WHERE ak.user_id = ${userId}
    AND sl.limit_type = 'api_monthly_calls'
    ORDER BY ak.created_at DESC
  `);
  return rows;
 }

export async function createApiKey(userId, name, key) {
  const { rows } = await db.query(db.sql`
    INSERT INTO api_keys (user_id, key, name)
    VALUES (${userId}, ${key}, ${name})
    RETURNING *
  `);
  return rows[0];
}

export async function deleteApiKey(userId, keyId) {
  await db.query(db.sql`
    DELETE FROM api_keys 
    WHERE id = ${keyId} 
    AND user_id = ${userId}
  `);
}