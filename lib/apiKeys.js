import { kv } from '@vercel/kv';
import { sql } from '@vercel/postgres';
import { mockKV } from './mockKV';

const store = process.env.NODE_ENV === 'development' ? mockKV : kv;

export async function validateApiKey(key) {
  // Check cache first
  const cached = await store.get(`apikey:${key}`);
  if (cached) return cached;

  // Query database
  const result = await sql`
    SELECT 
      ak.id, ak.user_id, ak.daily_usage, ak.monthly_usage,
      st.name as subscription_type,
      sl.limit_value
    FROM api_keys ak
    JOIN user_subscriptions us ON ak.user_id = us.user_id
    JOIN subscription_types st ON us.subscription_type_id = st.id
    JOIN subscription_limits sl ON st.id = sl.subscription_type_id
    WHERE ak.key = ${key} 
    AND ak.is_active = true
    AND us.status = 'active'
    AND sl.limit_type = 'api_monthly_calls'
  `;

  if (!result.rows[0]) return { error: 'Invalid API key' };

  const apiKey = result.rows[0];
  
  // Cache for 5 minutes
  await store.set(`apikey:${key}`, apiKey, { ex: 300 });
  
  return apiKey;
}

export async function incrementApiUsage(keyId) {
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);

  await Promise.all([
    store.incr(`api:daily:${keyId}:${today}`),
    store.incr(`api:monthly:${keyId}:${month}`),
    sql`
      UPDATE api_keys 
      SET 
        daily_usage = daily_usage + 1,
        monthly_usage = monthly_usage + 1,
        last_used_at = NOW()
      WHERE id = ${keyId}
    `
  ]);
}