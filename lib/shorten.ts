import { customAlphabet } from 'nanoid/non-secure';
import { getDatabase } from 'firebase-admin/database';
import { JSDOM } from 'jsdom';

import { initAdmin } from '@/app/firebase/admin';

const generateShortId = customAlphabet('123456789abcdefghjkmnpqrstuvwxyz', 6)

export const generateId = () => generateShortId();

async function getPageMetadata(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    return {
      title: document.querySelector('title')?.textContent || '',
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    };
  } catch {
    return { title: '', description: '' };
  }
}

async function generateExpiresAt(userId: string) {
  if (userId === process.env.SUPER_USER_ID) {
    return -1;
  }

  return Date.now() + (userId.startsWith('anon') ? 7 : 90) * 24 * 60 * 60 * 1000;
}

export async function createShortUrl(shortCode: string, longUrl: string, userId: string) {
  const metadata = await getPageMetadata(longUrl);
  const expiresAt = await generateExpiresAt(userId);

  initAdmin()
  const db = getDatabase();
  const urlData = {
    longUrl,
    userId,
    ...metadata,
    createdAt: Date.now(),
    expiresAt,
    clickCount: 0
  };

  await db.ref(`urls/${shortCode}`).set(urlData);

  return { shortCode };
}

export async function getShortCodeFromUrl (url: string) {
  try {
    initAdmin()
    const db = getDatabase();
    const snapshot = await db.ref('urls').orderByChild('longUrl').equalTo(url).limitToFirst(1).get();
    const shortCode = Object.keys(snapshot.val())[0];

    return shortCode;
  } catch {
    return false
  }
}
