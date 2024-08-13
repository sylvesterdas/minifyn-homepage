import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { mockKV } from './lib/mockKV';

const HOURLY_LIMIT = 5;
const DAILY_LIMIT = 30;

// CORS configuration
const PRODUCTION_ORIGINS = ['https://minifyn.com', 'https://mnfy.in'];
const DEV_ORIGIN = 'http://localhost:3000';

function getAllowedOrigins() {
  if (process.env.NODE_ENV === 'development') {
    return [...PRODUCTION_ORIGINS, DEV_ORIGIN];
  }
  return PRODUCTION_ORIGINS;
}

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];
const MAX_AGE = 86400; // 24 hours in seconds

export const config = {
  matcher: ['/api/shorten', '/api/reset-rate-limit'],
};

function getClientIdentifier(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.ip;
  return ip || 'unknown';
}

function handleCORS(request) {
  const origin = request.headers.get('origin');
  const responseHeaders = new Headers();
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.includes(origin)) {
    responseHeaders.set('Access-Control-Allow-Origin', origin);
  } else {
    responseHeaders.set('Access-Control-Allow-Origin', allowedOrigins[0]);
  }

  responseHeaders.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
  responseHeaders.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '));
  responseHeaders.set('Access-Control-Max-Age', MAX_AGE.toString());

  return responseHeaders;
}

const kvStore = process.env.NODE_ENV === 'development' ? mockKV : kv;

export async function middleware(request) {
  const corsHeaders = handleCORS(request);
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  // Add a reset endpoint
  if (request.nextUrl.pathname === '/api/reset-rate-limit') {
    const clientId = getClientIdentifier(request);
    const hourlyKey = `hourly:${clientId}`;
    const dailyKey = `daily:${clientId}`;

    await Promise.all([
      kvStore.del(hourlyKey),
      kvStore.del(dailyKey)
    ]);

    return new NextResponse(JSON.stringify({ message: 'Rate limit reset successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  // Existing rate limiting logic for /api/shorten
  if (request.nextUrl.pathname === '/api/shorten') {
    const clientId = getClientIdentifier(request);
    const hourlyKey = `hourly:${clientId}`;
    const dailyKey = `daily:${clientId}`;

    try {
      const [hourlyCount, dailyCount] = await Promise.all([
        kvStore.incr(hourlyKey),
        kvStore.incr(dailyKey),
      ]);

      if (hourlyCount === 1) await kvStore.expire(hourlyKey, 3600);
      if (dailyCount === 1) await kvStore.expire(dailyKey, 86400);

      if (hourlyCount > HOURLY_LIMIT || dailyCount > DAILY_LIMIT) {
        return new NextResponse(JSON.stringify({
          error: 'Rate limit exceeded',
          hourlyLimit: HOURLY_LIMIT,
          dailyLimit: DAILY_LIMIT,
          hourlyCount,
          dailyCount,
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit-Hour': HOURLY_LIMIT.toString(),
            'X-RateLimit-Remaining-Hour': Math.max(0, HOURLY_LIMIT - hourlyCount).toString(),
            'X-RateLimit-Limit-Day': DAILY_LIMIT.toString(),
            'X-RateLimit-Remaining-Day': Math.max(0, DAILY_LIMIT - dailyCount).toString(),
            ...corsHeaders,
          },
        });
      }

      // If within limits, add rate limit headers and allow the request to proceed
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit-Hour', HOURLY_LIMIT.toString());
      response.headers.set('X-RateLimit-Remaining-Hour', (HOURLY_LIMIT - hourlyCount).toString());
      response.headers.set('X-RateLimit-Limit-Day', DAILY_LIMIT.toString());
      response.headers.set('X-RateLimit-Remaining-Day', (DAILY_LIMIT - dailyCount).toString());

      // Add CORS headers
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  }

  // For other routes, just pass through
  return NextResponse.next();
}