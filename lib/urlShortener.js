import { nanoid } from 'nanoid';
import { createShortUrl } from './cache';

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
    await createShortUrl(shortCode, url, userId, subscriptionTypeId, title, description, expirationDate);
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