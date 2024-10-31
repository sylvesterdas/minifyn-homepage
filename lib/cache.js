import { kv } from '@vercel/kv';
import db from './db';

const CACHE_TTL = 3600;
const CLICK_BUFFER_TTL = 300; // 5 minutes
const URL_PREFIX = 'url:';
const CLICK_PREFIX = 'clicks:';

export async function getShortUrl(shortCode) {
  // Multi-get from KV store
  const [urlData, clickCount] = await kv.mget(`${URL_PREFIX}${shortCode}`, `${CLICK_PREFIX}${shortCode}`);
  
  if (urlData) {
    return { ...urlData, clicks: clickCount || 0 };
  }

  const result = await db.query(db.sql`
    SELECT su.original_url, su.created_at, su.expires_at, su.title, su.description, su.is_active,
           su.clicks, u.id AS user_id, u.email AS user_email,
           st.name AS subscription_type
    FROM short_urls su
    LEFT JOIN users u ON su.user_id = u.id
    LEFT JOIN subscription_types st ON su.subscription_type_id = st.id
    WHERE su.short_code = ${shortCode}
    AND su.is_active = true
    AND (su.expires_at IS NULL OR su.expires_at > NOW())
  `);

  if (result.rowCount === 0) return null;

  const data = result.rows[0];
  if (!data.user_id) data.subscription_type = 'anonymous';

  // Pipeline KV operations
  await kv.pipeline()
    .set(`${URL_PREFIX}${shortCode}`, data, { ex: CACHE_TTL })
    .set(`${CLICK_PREFIX}${shortCode}`, data.clicks, { ex: CACHE_TTL })
    .exec();

  return data;
}

export async function createShortUrl(shortCode, originalUrl, userId, subscriptionTypeId = null, title = null, description = null, expiresAt = null) {
  const urlData = {
    original_url: originalUrl,
    created_at: new Date(),
    expires_at: expiresAt,
    title,
    description,
    is_active: true,
    subscription_type_id: subscriptionTypeId,
    clicks: 0
  };

  // Pipeline the database insert and cache set
  const [dbResult] = await Promise.all([
    db.query(db.sql`
      INSERT INTO short_urls (short_code, original_url, user_id, subscription_type_id, title, description, expires_at)
      VALUES (${shortCode}, ${originalUrl}, ${userId || null}, ${subscriptionTypeId || null}, ${title}, ${description}, ${expiresAt})
    `),
    kv.pipeline()
      .set(`${URL_PREFIX}${shortCode}`, urlData, { ex: CACHE_TTL })
      .set(`${CLICK_PREFIX}${shortCode}`, 0, { ex: CACHE_TTL })
      .exec()
  ]);

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
        expires_at = COALESCE(${expiresAt}, expires_at),
        updated_at = NOW()
    WHERE short_code = ${shortCode}
  `);

  // Pipeline the cache invalidation
  await kv.pipeline()
    .del(`${URL_PREFIX}${shortCode}`)
    .del(`${CLICK_PREFIX}${shortCode}`)
    .exec();

  return getShortUrl(shortCode);
}

export async function incrementUrlClicks(shortCode) {
  const pipeline = kv.pipeline()
    .incr(`${CLICK_PREFIX}${shortCode}`)
    .expire(`${CLICK_PREFIX}${shortCode}`, CACHE_TTL);
    
  const [clickCount] = await pipeline.exec();
  
  // Update database less frequently using a buffer
  if (clickCount % 10 === 0) { // Update DB every 10 clicks
    await db.query(db.sql`
      UPDATE short_urls
      SET clicks = ${clickCount},
          last_accessed_at = NOW()
      WHERE short_code = ${shortCode}
    `);
  }
  
  return clickCount;
}

export async function deleteShortUrl(shortCode) {
  await Promise.all([
    db.query(db.sql`
      DELETE FROM short_urls
      WHERE short_code = ${shortCode}
    `),
    kv.pipeline()
      .del(`${URL_PREFIX}${shortCode}`)
      .del(`${CLICK_PREFIX}${shortCode}`)
      .exec()
  ]);
}

export async function clearCache(shortCode = null) {
  if (shortCode) {
    await kv.pipeline()
      .del(`${URL_PREFIX}${shortCode}`)
      .del(`${CLICK_PREFIX}${shortCode}`)
      .exec();
  } else {
    const [urlKeys, clickKeys] = await Promise.all([
      kv.keys(`${URL_PREFIX}*`),
      kv.keys(`${CLICK_PREFIX}*`)
    ]);
    
    if (urlKeys.length > 0 || clickKeys.length > 0) {
      await kv.del(...urlKeys, ...clickKeys);
    }
  }
}