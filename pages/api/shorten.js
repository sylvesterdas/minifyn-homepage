import { validateApiRequest } from '@/lib/auth';
import { handleShortenRequest } from '@/lib/urlShortener';
import { verifyCaptcha } from '@/lib/captcha';
import securityStack from '@/middleware/securityStack';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, recaptchaToken, title, description } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    if (req.headers['x-api-key']) {
      return handleShortenRequest({
        url,
        title,
        description,
        userId: req.apiKey?.user_id,
        subscriptionType: req.apiKey?.subscription_type
      }).then(result => res.json(result));
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA token required' });
    }
    await verifyCaptcha(recaptchaToken, req);

    const validation = await validateApiRequest(req, false);
    const result = await handleShortenRequest({
      url,
      title,
      description,
      userId: validation?.session?.userId,
      subscriptionType: validation?.user?.subscription_type || 'anonymous'
    });

    return res.json(result);
  } catch (error) {
    console.error('Shorten Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create short URL' });
  }
}

export default securityStack(handler);
