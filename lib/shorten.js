import { customAlphabet } from "nanoid/non-secure";
import { getDatabase } from "firebase-admin/database";
import { JSDOM } from "jsdom";

import { initAdmin } from "@/app/firebase/admin";

const generateShortId = customAlphabet("123456789abcdefghjkmnpqrstuvwxyz", 6);

export const generateId = () => generateShortId();

async function getPageMetadata(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    return {
      title: document.querySelector("title")?.textContent || "",
      description:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "",
      seo: extractSEOInfo(document),
    };
  } catch {
    return { title: "", description: "" };
  }
}

function extractSEOInfo (document) {
  const seoData = {
    // Basic meta tags
    title: document.querySelector("title")?.textContent,
    description: document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content"),
    keywords: document
      .querySelector('meta[name="keywords"]')
      ?.getAttribute("content"),

    // Open Graph
    ogTitle: document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute("content"),
    ogDescription: document
      .querySelector('meta[property="og:description"]')
      ?.getAttribute("content"),
    ogImage: document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute("content"),
    ogUrl: document
      .querySelector('meta[property="og:url"]')
      ?.getAttribute("content"),
    ogType: document
      .querySelector('meta[property="og:type"]')
      ?.getAttribute("content"),

    // Twitter
    twitterCard: document
      .querySelector('meta[name="twitter:card"]')
      ?.getAttribute("content"),
    twitterTitle: document
      .querySelector('meta[name="twitter:title"]')
      ?.getAttribute("content"),
    twitterDescription: document
      .querySelector('meta[name="twitter:description"]')
      ?.getAttribute("content"),
    twitterImage: document
      .querySelector('meta[name="twitter:image"]')
      ?.getAttribute("content"),

    // Canonical
    canonical: document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href"),
  };

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(seoData).filter(([_, v]) => v !== undefined)
  );
}

async function generateExpiresAt(userId) {
  if (userId === process.env.SUPER_USER_ID) {
    return -1;
  }

  return (
    Date.now() + (userId.startsWith("anon") ? 7 : 90) * 24 * 60 * 60 * 1000
  );
}

export async function createShortUrl(
  shortCode,
  longUrl,
  userId
) {
  const metadata = await getPageMetadata(longUrl);
  const expiresAt = await generateExpiresAt(userId);

  initAdmin();
  const db = getDatabase();
  const urlData = {
    longUrl,
    userId,
    ...metadata,
    createdAt: Date.now(),
    expiresAt,
    clickCount: 0,
  };

  await db.ref(`urls/${shortCode}`).set(urlData);

  return { shortCode };
}

export async function getShortCodeFromUrl(url) {
  try {
    initAdmin();
    const db = getDatabase();
    const snapshot = await db
      .ref("urls")
      .orderByChild("longUrl")
      .equalTo(url)
      .limitToFirst(1)
      .get();
    const shortCode = Object.keys(snapshot.val())[0];

    return shortCode;
  } catch {
    return false;
  }
}
