import { handleShortenRequest } from '@/lib/urlShortener';
import { verifyCaptcha } from '@/lib/captcha';
import { checkRateLimit } from '@/lib/rateLimit';
import { getUserSubscription } from '@/lib/subscriptions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, recaptchaToken, title, description } = req.body;

    if (!url || typeof url !== 'string' || !recaptchaToken) {
      return res.status(400).json({ error: 'Invalid input provided' });
    }

    // Verify reCAPTCHA
    await verifyCaptcha(recaptchaToken, req);

    // Check rate limit
    const { hourlyCount, dailyCount } = checkRateLimit(req);

    // Get user subscription
    const { userId, subscriptionTypeId, hourlyLimit, dailyLimit } = await getUserSubscription(req);

    // Handle shortening request
    const result = await handleShortenRequest({
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

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in URL shortening:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to create short URL' });
  }
}