const ALLOWED_DOMAINS = {
  production: [
    'minifyn.com',
    'www.minifyn.com',
    'mnfy.in',
    'www.mnfy.in'
  ],
  development: [
    'localhost:3000'
  ]
};

export default function domainCheckMiddleware(handler) {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      return handler(req, res);
    }

    const referer = req.headers.referer;
    if (!referer) {
      return res.status(403).json({ error: 'Access denied' });
    }

    try {
      const refererDomain = new URL(referer).host;
      const allowedDomains = ALLOWED_DOMAINS[process.env.NODE_ENV] || ALLOWED_DOMAINS.production;
      
      if (!allowedDomains.includes(refererDomain)) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } catch {
      return res.status(403).json({ error: 'Invalid referer' });
    }

    return handler(req, res);
  };
}