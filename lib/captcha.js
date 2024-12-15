'use server';

import https from 'https';

export async function verifyCaptcha(token, req) {
  if (!token) {
    throw { status: 400, message: 'Missing reCAPTCHA token' };
  }

  const params = new URLSearchParams({
    secret: process.env.NEXT_RECAPTCHA_SECRET_KEY,
    response: token,
    remoteip: req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
  });

  try {
    const response = await ipv4Fetch(`https://www.google.com/recaptcha/api/siteverify?${params}`);
    const result = await response.json();
    
    if (!result.success) {
      throw { status: 400, message: 'reCAPTCHA verification failed', details: result['error-codes'] };
    }
    
    return result;
  } catch (error) {
    throw { status: 500, message: 'reCAPTCHA verification failed', error };
  }
}

async function ipv4Fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      ...options,
      family: 4,
      timeout: 5000
    }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            json: () => Promise.resolve(JSON.parse(data))
          });
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });

    request.end();
  });
}