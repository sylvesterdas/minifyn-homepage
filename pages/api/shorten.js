import { validateApiRequest } from '@/lib/auth';
import { handleShortenRequest, getUserUrlCount } from '@/lib/urlShortener';
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

    // Verify reCAPTCHA first to prevent unnecessary processing
    await verifyCaptcha(recaptchaToken, req);

    // Optional user validation
    let userId;
    let subscriptionTypeId;
    
    const validation = await validateApiRequest(req, false); // false means don't require auth
    if (!validation.error) {
      userId = validation.session.userId;
      subscriptionTypeId = validation.user.subscription_type_id;
    }

    // Check rate limit
    const { hourlyCount, dailyCount } = checkRateLimit(req);

    // Get subscription limits
    const { hourlyLimit, dailyLimit, maxUrls } = await getUserSubscription(userId);

    // Check URL limit for authenticated users
    if (userId) {
      const userUrlCount = await getUserUrlCount(userId);
      if (userUrlCount >= maxUrls) {
        return res.status(403).json({ 
          error: 'URL limit reached. Please upgrade your plan or delete some existing URLs.' 
        });
      }
    }

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
    res.status(error.status || 500).json({ 
      error: error.message || 'Failed to create short URL' 
    });
  }
}