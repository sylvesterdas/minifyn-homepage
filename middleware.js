import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { mockKV } from './lib/mockKV';

const kvStore = process.env.NODE_ENV === 'development' ? mockKV : kv;

export const config = {
  matcher: [
    '/api/shorten',
    '/api/reset-rate-limit',
    '/((?!_next/static|favicon.ico).*)'
  ],
};

// CORS configuration
const PRODUCTION_ORIGINS = ['https://www.minifyn.com', 'https://www.mnfy.in'];
const DEV_ORIGIN = 'http://localhost:3000';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const ALLOWED_HEADERS = ['Content-Type', 'Authorization'];
const MAX_AGE = 86400;

function getClientIdentifier(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.ip;
  return ip || 'unknown';
}

function getAllowedOrigins() {
  if (process.env.NODE_ENV === 'development') {
    return [...PRODUCTION_ORIGINS, DEV_ORIGIN];
  }
  return PRODUCTION_ORIGINS;
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
  responseHeaders.set('Vary', 'Origin');

  return responseHeaders;
}

async function verifySession(request) {
  const sessionId = request.cookies.get('sessionId')?.value;
  if (!sessionId) return null;

  const session = await getSession(sessionId);
  return session;
}

async function getSession(sessionId) {
  const session = await kv.get(`session:${sessionId}`);
  if (session && session.expiresAt > Date.now()) {
    return session;
  }
  return null;
}

export async function middleware(request) {
  const corsHeaders = handleCORS(request);
  
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

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

      const response = NextResponse.next();
      
      // Pass rate limit info to the API route
      response.headers.set('X-Rate-Limit-Hourly', hourlyCount.toString());
      response.headers.set('X-Rate-Limit-Daily', dailyCount.toString());

      // Pass auth token to API route if present
      const authHeader = request.headers.get('Authorization');
      if (authHeader) {
        response.headers.set('X-Auth-Token', authHeader.split(' ')[1]);
      }

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

  // For all other routes, apply CORS headers
  const response = NextResponse.next();
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}
