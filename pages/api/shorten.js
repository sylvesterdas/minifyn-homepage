import { nanoid } from 'nanoid';
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, recaptchaToken } = req.body;

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

    const shortCode = nanoid(8);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    try {
      const insertQuery = db.sql`
        INSERT INTO short_urls (short_code, original_url, expires_at)
        VALUES (${shortCode}, ${url}, ${expirationDate})
      `;
      await db.query(insertQuery, [shortCode, url, expirationDate]);
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