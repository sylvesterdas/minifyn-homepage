import { handleShortenRequest, getUserUrlCount } from '@/lib/urlShortener';
import { verifyCaptcha } from '@/lib/captcha';
import { checkRateLimit } from '@/lib/rateLimit';
import { getUserSubscription } from '@/lib/subscriptions';
import { getSession } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let userId;
    
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      const session = await getSession(sessionId);
      
      if (session.userId) {
        userId = session.userId;
      }
    }

    const { url, recaptchaToken, title, description } = req.body;

    if (!url || typeof url !== 'string' || !recaptchaToken) {
      return res.status(400).json({ error: 'Invalid input provided' });
    }

    // Verify reCAPTCHA
    await verifyCaptcha(recaptchaToken, req);

    // Check rate limit
    const { hourlyCount, dailyCount } = checkRateLimit(req);

    // Get user subscription
    const { subscriptionTypeId, hourlyLimit, dailyLimit, maxUrls } = await getUserSubscription(userId);

    // Check user's current URL count
    const userUrlCount = await getUserUrlCount(userId);
    if (userUrlCount >= maxUrls) {
      return res.status(403).json({ error: 'URL limit reached. Please upgrade your plan or delete some existing URLs.' });
    }

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