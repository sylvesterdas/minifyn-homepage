import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

const kvStore = kv;

const SESSION_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

export async function createSession(user) {
  const sessionId = uuidv4();
  const expiresAt = Date.now() + SESSION_EXPIRY * 1000;
  await kvStore.set(`session:${sessionId}`, { userId: user.id, expiresAt }, { ex: SESSION_EXPIRY });
  return sessionId;
}

export async function getSession(sessionId) {
  const session = await kvStore.get(`session:${sessionId}`);
  if (session && session.expiresAt > Date.now()) {
    return session;
  }
  return null;
}

export async function destroySession(sessionId) {
  await kvStore.del(`session:${sessionId}`);
}

export async function cleanupSessions() {
  const now = Date.now();
  const sessionKeys = await kvStore.keys('session:*');
  
  for (const key of sessionKeys) {
    const session = await kvStore.get(key);
    if (session.expiresAt <= now) {
      await kvStore.del(key);
    }
  }
}

export async function getUser(userId) {
  const query = db.sql`
    SELECT 
      u.id,
      u.full_name, 
      u.email,
      u.is_verified,
      u.is_admin,
      st.name as "subscriptionType",
      st.id as subscription_type_id
    FROM users u
    LEFT JOIN user_subscriptions us
      ON us.user_id = u.id
    LEFT JOIN subscription_types st
      ON st.id = us.subscription_type_id
    WHERE u.id = ${userId}
  `;

  const { rows: [user] } = await db.query(query);

  if (!user) {
    return false;
  }
  
  user.subscriptionType = user.subscriptionType ?? 'free';
  return user;
}

// New convenience method for API routes
export async function validateApiRequest(req) {
  const session = await getSession(req.cookies.sessionId);
  if (!session) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await getUser(session.userId);
  if (!user) {
    return { error: 'User not found', status: 401 };
  }

  return { user, session };
}