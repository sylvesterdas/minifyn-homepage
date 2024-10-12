import { nanoid } from 'nanoid';
import { createShortUrl as cacheCreateShortUrl } from './cache';
import db from './db';

export async function handleShortenRequest({
  url,
  title,
  description,
  userId,
  subscriptionTypeId,
  hourlyCount,
  dailyCount,
  hourlyLimit,
  dailyLimit
}) {
  if (hourlyCount > hourlyLimit || dailyCount > dailyLimit) {
    throw { status: 429, message: 'Rate limit exceeded', hourlyLimit, dailyLimit, hourlyCount, dailyCount };
  }

  const shortCode = nanoid(8);
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 60); // 60 days expiration for free users

  try {
    await cacheCreateShortUrl(shortCode, url, userId, subscriptionTypeId, title, description, expirationDate);
  } catch (error) {
    if (error.code === '23505') { // unique_violation
      // If we get a duplicate key error, we can try again with a new short_code
      return handleShortenRequest({
        url,
        title,
        description,
        userId,
        subscriptionTypeId,
        hourlyCount,
        dailyCount,
        hourlyLimit,
        dailyLimit
      });
    }
    throw error;
  }

  return { shortUrl: `${process.env.BASE_URL}/${shortCode}` };
}

export async function getUserUrlCount(userId) {
  if (!userId) return 0;
  
  const { rows } = await db.query(db.sql`
    SELECT COUNT(*) as count
    FROM short_urls
    WHERE user_id = ${userId}
  `);
  return parseInt(rows[0].count);
}

export async function getShortUrlByCode(shortCode) {
  const { rows } = await db.query(db.sql`
    SELECT * FROM short_urls
    WHERE short_code = ${shortCode}
  `);
  return rows[0];
}

export async function deleteShortUrl(shortCode, userId) {
  const { rowCount } = await db.query(db.sql`
    DELETE FROM short_urls
    WHERE short_code = ${shortCode} AND user_id = ${userId}
  `);
  return rowCount > 0;
}