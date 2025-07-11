import isURL from "validator/lib/isURL";
import { db } from "@/app/firebase/admin";

const MAX_URL_LENGTH = 2048;
const SUSPICIOUS_PATTERNS = [
  /(.)\1{10,}/, // Repeated characters
  /(https?:\/\/[^\/]+\/[^\/]+)\1{2,}/, // Repeated paths
];

const blockedDomainsRef = db.ref("blocked-domains");

async function isDomainBlocked(url) {
  const snapshot = await blockedDomainsRef.once("value");
  const blockedDomains = snapshot.val() || {};
  const domain = new URL(url).hostname;
  return Object.values(blockedDomains).some((blockedDomain) =>
    domain.endsWith(blockedDomain)
  );
}

function basicURLValidation(url) {
  const baseUrl = new URL(process.env.BASE_URL || "");

  if (url.length > MAX_URL_LENGTH) {
    return { error: "URL is too long" };
  }
  if (url.startsWith(baseUrl.origin)) {
    return { error: "Cannot shorten URLs from this domain" };
  }
  if (/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    return { error: "IP addresses are not allowed" };
  }
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return { error: "URL contains suspicious patterns" };
    }
  }
  if (
    !isURL(url, {
      require_protocol: true,
      require_valid_protocol: true,
      protocols: ["http", "https"],
      require_host: true,
      disallow_auth: true,
    })
  ) {
    return { error: "Invalid URL format" };
  }
  return null;
}

async function isShortened(url) {
  const snapshot = await db.ref("urls").orderByChild("longUrl").equalTo(url).once("value");
  return snapshot.exists();
}

async function verifyURL(url) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    Accept: "*/*",
  };

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers,
    });
    if (!response.ok) throw new Error("HEAD failed");
    return response;
  } catch {
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers,
      });
      return response;
    } catch {
      return null;
    }
  }
}

export async function validateURL(url) {
  const basicValidation = basicURLValidation(url);
  if (basicValidation) {
    return { isValid: false, ...basicValidation };
  }

  if (await isDomainBlocked(url)) {
    return { isValid: false, error: "URL is from a blocked domain" };
  }
  
  if (await isShortened(url)) {
    return { isValid: false, error: "URL is already shortened" };
  }

  const response = await verifyURL(url);

  if (!response) {
    return {
      isValid: true,
      warning:
        "Link could not be verified (HEAD & GET both failed), but it's allowed.",
    };
  }

  if (!response.ok) {
    return {
      isValid: true,
      warning: `URL returned status ${response.status}. Could not verify, but allowing.`,
    };
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return { isValid: false, error: "API endpoints are not allowed" };
  }

  return { isValid: true };
}
