import { NextResponse } from 'next/server';
import { kv as kvStore } from '@vercel/kv';

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
  const guestSession = request.cookies.get('guestSession')?.value;
  if (guestSession) return guestSession;
  
  const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return newGuestId;
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
    const session = await verifySession(request);
    const guestId = request.cookies.get('guestSession')?.value;
    const clientId = session?.id || guestId;
    
    if (!clientId) {
      return new NextResponse(JSON.stringify({ error: 'No session found' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  
    const key = `requests:${clientId}`;
    await kvStore.del(key);
  
    return new NextResponse(JSON.stringify({ message: 'Rate limit reset successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  if (request.nextUrl.pathname === '/api/shorten') {
    const session = await verifySession(request);
    const guestId = getClientIdentifier(request);
    const clientId = session?.id || guestId;
    
    const key = `requests:${clientId}`;
    const limit = session ? 50 : 2;
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
  
    try {
      const requestData = await kvStore.get(key) || { count: 0, date: todayKey };
      
      if (requestData.date !== todayKey) {
        requestData.count = 0;
        requestData.date = todayKey;
      }
  
      console.log(requestData)
      if (requestData.count >= limit) {
        return new NextResponse(JSON.stringify({ error: 'Daily limit exceeded' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
  
      requestData.count++;
      await kvStore.set(key, requestData, { ex: 86400 });
  
      const response = NextResponse.next();
      
      // Set guest cookie for new visitors
      if (!session && !request.cookies.get('guestSession')) {
        response.cookies.set('guestSession', guestId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60
        });
      }
  
      response.headers.set('X-Rate-Limit-Remaining', (limit - requestData.count).toString());
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
