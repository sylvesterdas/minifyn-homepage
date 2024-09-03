import { kv } from '@vercel/kv';
import db from './db';

const CACHE_TTL = 3600; // Cache for 1 hour

export async function getShortUrl(shortCode) {
  // Try to get the URL data from the cache first
  const cachedData = await kv.get(`urldata:${shortCode}`);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from the database
  const result = await db.query(db.sql`
    SELECT su.original_url, su.created_at, su.expires_at, su.title, su.description, su.is_custom, su.is_active,
           u.id AS user_id, u.email AS user_email,
           st.name AS subscription_type
    FROM short_urls su
    JOIN users u ON su.user_id = u.id
    JOIN subscription_types st ON su.subscription_type_id = st.id
    WHERE su.short_code = ${shortCode}
    AND su.is_active = true
    AND (su.expires_at IS NULL OR su.expires_at > NOW())
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const urlData = result.rows[0];

  // Cache the result
  await kv.set(`urldata:${shortCode}`, urlData, { ex: CACHE_TTL });

  return urlData;
}

export async function createShortUrl(shortCode, originalUrl, userId, subscriptionTypeId = null, title = null, description = null, isCustom = false, expiresAt = null) {
  // If subscriptionTypeId is not provided, fetch the default (free) subscription type
  if (!subscriptionTypeId) {
    const result = await db.query(db.sql`
      SELECT id FROM subscription_types WHERE name = 'LinkFree User' LIMIT 1
    `);
    if (result.rows.length > 0) {
      subscriptionTypeId = result.rows[0].id;
    } else {
      throw new Error('Default subscription type not found');
    }
  }

  // Create the short URL in the database
  await db.query(db.sql`
    INSERT INTO short_urls (short_code, original_url, user_id, subscription_type_id, title, description, is_custom, expires_at)
    VALUES (${shortCode}, ${originalUrl}, ${userId}, ${subscriptionTypeId}, ${title}, ${description}, ${isCustom}, ${expiresAt})
  `);

  // Cache the new short URL data
  const urlData = { 
    original_url: originalUrl, 
    created_at: new Date(), 
    expires_at: expiresAt, 
    title, 
    description, 
    is_custom: isCustom, 
    is_active: true,
    subscription_type_id: subscriptionTypeId
  };
  await kv.set(`urldata:${shortCode}`, urlData, { ex: CACHE_TTL });

  return shortCode;
}

export async function updateShortUrl(shortCode, newData) {
  const { originalUrl, title, description, isActive, expiresAt } = newData;

  // Update the short URL in the database
  await db.query(db.sql`
    UPDATE short_urls
    SET original_url = COALESCE(${originalUrl}, original_url),
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        is_active = COALESCE(${isActive}, is_active),
        expires_at = COALESCE(${expiresAt}, expires_at)
    WHERE short_code = ${shortCode}
  `);

  // Update the cache
  await kv.del(`urldata:${shortCode}`); // Delete the old cached data
  const updatedData = await getShortUrl(shortCode); // Fetch and cache the updated data

  return updatedData;
}

export async function deleteShortUrl(shortCode) {
  // Delete the short URL from the database
  await db.query(db.sql`
    DELETE FROM short_urls
    WHERE short_code = ${shortCode}
  `);

  // Remove from cache
  await kv.del(`urldata:${shortCode}`);
}