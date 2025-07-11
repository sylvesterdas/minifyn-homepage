import { customAlphabet } from "nanoid/non-secure";
import { JSDOM } from "jsdom";
import { db } from "@/app/firebase/admin";

const generateShortId = customAlphabet("123456789abcdefghjkmnpqrstuvwxyz", 6);

export const generateId = () => generateShortId();

async function getPageMetadata(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return {};
    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    return {
      title: doc.querySelector("title")?.textContent || "",
      description:
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "",
    };
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error);
    return {};
  }
}

function generateExpiresAt(userId) {
  const days = userId.startsWith("anon") ? 7 : 90;
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export async function createShortUrl(
  shortCode,
  longUrl,
  userId,
  copyMeta = false
) {
  let uniqueShortCode = shortCode;
  let attempts = 0;
  while (attempts < 5) {
    const snapshot = await db.ref(`urls/${uniqueShortCode}`).once("value");
    if (!snapshot.exists()) {
      break;
    }
    uniqueShortCode = generateId();
    attempts++;
  }
  if (attempts === 5) {
    throw new Error("Failed to generate a unique short code.");
  }

  const metadata = copyMeta ? await getPageMetadata(longUrl) : {};
  const expiresAt = generateExpiresAt(userId);

  const urlData = {
    longUrl,
    userId,
    ...metadata,
    createdAt: Date.now(),
    expiresAt,
    clickCount: 0,
  };

  await db.ref(`urls/${uniqueShortCode}`).set(urlData);

  return { shortCode: uniqueShortCode };
}

export async function getShortCodeFromUrl(url) {
  try {
    const snapshot = await db
      .ref("urls")
      .orderByChild("longUrl")
      .equalTo(url)
      .limitToFirst(1)
      .get();
      
    if (!snapshot.exists()) {
      return null;
    }

    return Object.keys(snapshot.val())[0];
  } catch (error) {
    console.error("Error getting short code from URL:", error);
    return null;
  }
}
