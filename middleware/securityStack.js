import { kv } from '@vercel/kv';
import rateLimit from '../lib/rateLimitMiddleware';
import domainCheck from '../lib/domainCheckMiddleware';
import { validateUrl, trackSuspiciousActivity } from '../lib/security';

export default function securityStack(handler) {
  return async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    
    // Check if IP is blocked
    const isBlocked = await kv.get(`blocked:${ip}`);
    if (isBlocked) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add security headers
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=()');

    try {
      if (req.body?.url) {
        await validateUrl(req.body.url);
      }

      return rateLimit(domainCheck(handler))(req, res);
    } catch (error) {
      await trackSuspiciousActivity(ip, error.message);
      return res.status(400).json({ error: error.message });
    }
  };
}