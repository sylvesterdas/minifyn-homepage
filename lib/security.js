import { kv } from '@vercel/kv';

export const securityConfig = {
  maxRedirects: 3,
  maxUrlLength: 2048,
  blockedDomains: ['localhost', '127.0.0.1', '0.0.0.0'], // Block internal URLs
  scanTimeout: 5000,
  suspiciousPatterns: [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i
  ]
};

export async function validateUrl(url) {
  const urlObj = new URL(url);
  
  if (securityConfig.blockedDomains.includes(urlObj.hostname)) {
    throw new Error('Domain not allowed');
  }

  for (const pattern of securityConfig.suspiciousPatterns) {
    if (pattern.test(url)) {
      throw new Error('URL contains suspicious patterns');
    }
  }

  return true;
}

export async function trackSuspiciousActivity(ip, reason) {
  const key = `suspicious:${ip}`;
  const count = await kv.incr(key);
  
  if (count >= 5) {
    await kv.set(`blocked:${ip}`, true, { ex: 86400 }); // Block for 24h
    return true;
  }
  return false;
}