import db from '../db';
import { nanoid } from 'nanoid';
import { validateBatchRequest } from './validationService';
import { getSubscriptionLimits } from './subscriptionService';
import { kv } from '@vercel/kv';
import { join } from 'sql-template-tag';

export async function createUrls(urls, userId, subscriptionType) {
  const error = await validateBatchRequest(urls, subscriptionType);
  if (error) throw new Error(error);

  const limits = await getSubscriptionLimits(subscriptionType);
  const monthKey = `urls:${userId}:${new Date().getMonth()}`;
  const count = await kv.incr(monthKey);
  if (count === 1) await kv.expire(monthKey, 2592000);

  const shortCodes = urls.map(() => nanoid(8));
  const values = urls.map((url, i) => ({
    shortCode: shortCodes[i],
    originalUrl: url.url,
    title: url.title?.slice(0, 100),
    description: url.description?.slice(0, 500),
    userId,
    expiresAt: new Date(Date.now() + limits.expiryDays * 24 * 60 * 60 * 1000)
  }));

  const { rows } = await db.query(db.sql`
    INSERT INTO short_urls (
      short_code,
      original_url,
      title,
      description,
      user_id,
      expires_at
    )
    VALUES ${join(values.map(v => db.sql`(
      ${v.shortCode},
      ${v.originalUrl},
      ${v.title},
      ${v.description}, 
      ${v.userId},
      ${v.expiresAt}
    )`), ',')}
    RETURNING 
      short_code as "shortCode", 
      original_url as "originalUrl",
      expires_at as "expiresAt", 
      created_at as "createdAt"
  `);

  return rows.map(row => ({
    ...row,
    shortUrl: `${process.env.BASE_URL}/${row.shortCode}`
  }));
}

export async function getUrlDetails(shortCode, withAnalytics = false) {
  const { rows } = await db.query(db.sql`
    SELECT 
      short_code as "shortCode",
      original_url as "originalUrl",
      title,
      description,
      clicks,
      created_at as "createdAt",
      expires_at as "expiresAt"
      ${withAnalytics ? db.sql`, 
        (SELECT json_build_object(
          'devices', json_object_agg(device_type, count),
          'browsers', json_object_agg(browser, count),
          'countries', json_object_agg(country, count)
        ) FROM (
          SELECT 
            device_type, browser, country,
            COUNT(*) as count
          FROM analytics
          WHERE short_url_code = short_urls.short_code
          GROUP BY device_type, browser, country
        ) a
      ) as analytics` : db.sql``}
    FROM short_urls
    WHERE short_code = ${shortCode}
    AND is_active = true
    AND expires_at > NOW()
  `);

  if (!rows[0]) return null;

  return {
    ...rows[0],
    shortUrl: `${process.env.BASE_URL}/${rows[0].shortCode}`
  };
}

export async function deactivateUrls(shortCodes, userId) {
  const { rowCount } = await db.query(db.sql`
    UPDATE short_urls 
    SET is_active = false 
    WHERE short_code = ANY(${shortCodes})
    AND user_id = ${userId}
  `);

  return rowCount;
}

export async function getBatchDetails(shortCodes, userId) {
  const { rows } = await db.query(db.sql`
    SELECT 
      short_code as "shortCode",
      original_url as "originalUrl",
      clicks,
      created_at as "createdAt",
      expires_at as "expiresAt"
    FROM short_urls
    WHERE short_code = ANY(${shortCodes})
    AND user_id = ${userId}
    AND is_active = true
    AND expires_at > NOW()
  `);

  return rows.map(row => ({
    ...rows,
    shortUrl: `${process.env.BASE_URL}/${row.shortCode}`
  }));
}