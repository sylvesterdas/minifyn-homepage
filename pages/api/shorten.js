import { nanoid } from 'nanoid';
import db from '../../lib/db';
import { getShortUrl, createShortUrl } from '../../lib/cache';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, recaptchaToken, customAlias, title, description } = req.body;

    if (!url || typeof url !== 'string' || !recaptchaToken) {
      return res.status(400).json({ error: 'Invalid input provided' });
    }

    // Verify reCAPTCHA
    const verifyUrl = new URL('https://www.google.com/recaptcha/api/siteverify');

    const verifyUrlParams = new URLSearchParams({
      secret: process.env.NEXT_RECAPTCHA_SECRET_KEY,
      response: recaptchaToken,
      remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    });

    verifyUrl.search = verifyUrlParams.toString();

    const recaptchaResponse = await fetch(verifyUrl, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST'
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes'], Object.fromEntries(verifyUrlParams));
      return res.status(400).json({ error: 'reCAPTCHA verification failed', details: recaptchaData['error-codes'] });
    }

    const userId = req.user ? req.user.id : null; // Replace with actual user ID from your auth system
    let subscriptionTypeId = null;

    if (userId) {
      // User is logged in, fetch their subscription type
      const getUserSubscriptionQuery = db.sql`
        SELECT st.id
        FROM user_subscriptions us
        JOIN subscription_types st ON us.subscription_type_id = st.id
        WHERE us.user_id = ${userId} AND us.status = 'active'
        ORDER BY us.created_at DESC
        LIMIT 1
      `;
      const { rows } = await db.query(getUserSubscriptionQuery);
      if (rows.length > 0) {
        subscriptionTypeId = rows[0].id;
      } else {
        // If no active subscription found, use the 'free' subscription
        const getFreeSubscriptionQuery = db.sql`
          SELECT id FROM subscription_types WHERE name = 'free' LIMIT 1
        `;
        const { rows: freeRows } = await db.query(getFreeSubscriptionQuery);
        if (freeRows.length === 0) {
          throw new Error('Free subscription type not found');
        }
        subscriptionTypeId = freeRows[0].id;
      }
    } else {
      // Anonymous user, use the 'free' subscription
      const getFreeSubscriptionQuery = db.sql`
        SELECT id FROM subscription_types WHERE name = 'free' LIMIT 1
      `;
      const { rows } = await db.query(getFreeSubscriptionQuery);
      if (rows.length === 0) {
        throw new Error('Free subscription type not found');
      }
      subscriptionTypeId = rows[0].id;
    }

    const shortCode = customAlias || nanoid(8);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 60); // 60 days expiration for free users

    // Check if custom alias is available
    if (customAlias) {
      const existingUrl = await getShortUrl(customAlias);
      if (existingUrl) {
        return res.status(400).json({ error: 'Custom alias already in use' });
      }
    }

    try {
      await createShortUrl(shortCode, url, userId, subscriptionTypeId, title, description, !!customAlias, expirationDate);
    } catch (error) {
      if (error.code === '23505') { // unique_violation
        // If we get a duplicate key error, we can try again with a new short_code
        return handler(req, res);
      }
      throw error;
    }

    res.status(200).json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    console.error('Error in URL shortening:', error);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
}