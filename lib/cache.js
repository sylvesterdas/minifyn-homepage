import { kv } from '@vercel/kv';
import db from './db';

const CACHE_TTL = 3600;

export async function getShortUrl(shortCode) {
  const cachedData = await kv.get(`urldata:${shortCode}`);
  if (cachedData) return cachedData;

  const result = await db.query(db.sql`
    SELECT su.original_url, su.created_at, su.expires_at, su.title, su.description, su.is_active,
           u.id AS user_id, u.email AS user_email,
           st.name AS subscription_type
    FROM short_urls su
    LEFT JOIN users u ON su.user_id = u.id
    LEFT JOIN subscription_types st ON su.subscription_type_id = st.id
    WHERE su.short_code = ${shortCode}
    AND su.is_active = true
    AND (su.expires_at IS NULL OR su.expires_at > NOW())
  `);

  if (result.rowCount === 0) return null;

  const urlData = result.rows[0];
  if (!urlData.user_id) urlData.subscription_type = 'anonymous';

  await kv.set(`urldata:${shortCode}`, urlData, { ex: CACHE_TTL });
  return urlData;
}

export async function createShortUrl(shortCode, originalUrl, userId, subscriptionTypeId = null, title = null, description = null, expiresAt = null) {
  await db.query(db.sql`
    INSERT INTO short_urls (short_code, original_url, user_id, subscription_type_id, title, description, expires_at)
    VALUES (${shortCode}, ${originalUrl}, ${userId || null}, ${subscriptionTypeId || null}, ${title}, ${description}, ${expiresAt})
  `);

  const urlData = { 
    original_url: originalUrl, 
    created_at: new Date(), 
    expires_at: expiresAt, 
    title, 
    description, 
    is_active: true,
    subscription_type_id: subscriptionTypeId
  };
  await kv.set(`urldata:${shortCode}`, urlData, { ex: CACHE_TTL });

  return shortCode;
}

export async function updateShortUrl(shortCode, newData) {
  const { originalUrl, title, description, isActive, expiresAt } = newData;

  await db.query(db.sql`
    UPDATE short_urls
    SET original_url = COALESCE(${originalUrl}, original_url),
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        is_active = COALESCE(${isActive}, is_active),
        expires_at = COALESCE(${expiresAt}, expires_at)
    WHERE short_code = ${shortCode}
  `);

  await kv.del(`urldata:${shortCode}`);
  return getShortUrl(shortCode);
}

export async function deleteShortUrl(shortCode) {
  await db.query(db.sql`
    DELETE FROM short_urls
    WHERE short_code = ${shortCode}
  `);

  await kv.del(`urldata:${shortCode}`);
}

export async function clearCache(shortCode = null) {
  if (shortCode) {
    await kv.del(`urldata:${shortCode}`);
  } else {
    const keys = await kv.keys('urldata:*');
    if (keys.length > 0) {
      await kv.del(...keys);
    }
  }
}