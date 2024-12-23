import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from './db';

const kvStore = kv;

const SESSION_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function createSession(req, user) {
  const sessionId = uuidv4();
  const expiresAt = Date.now() + SESSION_EXPIRY * 1000;

  const guestId = req.cookies?.guestSession?.value;
  if (guestId) {
    await kvStore.del(`requests:${guestId}`);
  }
  
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
      COALESCE(us.subscription_type, 'free') as "subscriptionType",
      us.subscription_type_id
    FROM users u
    LEFT JOIN active_subscriptions us ON us.user_id = u.id
    WHERE u.id = ${userId}
  `;
 
  const { rows: [user] } = await db.query(query);
 
  if (!user) {
    return false;
  }
 
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