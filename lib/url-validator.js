import isURL from "validator/lib/isURL";

const MAX_URL_LENGTH = 2048;
const SUSPICIOUS_PATTERNS = [
  /(.)\1{10,}/, // Repeated characters
  /(https?:\/\/[^\/]+\/[^\/]+)\1{2,}/, // Repeated paths
];

export async function validateURL(url) {
  const baseUrl = new URL(process.env.BASE_URL || "");

  if (url.length < 30) {
    return { isValid: false, error: "URL must be at least 30 characters long" };
  }

  if (url.length > MAX_URL_LENGTH) {
    return { isValid: false, error: "URL is too long" };
  }

  if (url.startsWith(baseUrl.origin)) {
    return { isValid: false, error: "Cannot shorten URLs from this domain" };
  }

  if (/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url)) {
    return { isValid: false, error: "IP addresses are not allowed" };
  }

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return { isValid: false, error: "URL contains suspicious patterns" };
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
    return { isValid: false, error: "Invalid URL format" };
  }

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    Accept: "*/*",
  };

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers,
    });

    if (!response.ok) throw new Error("HEAD failed");

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return { isValid: false, error: "API endpoints are not allowed" };
    }

    return { isValid: true };
  } catch {
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers,
      });

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

      return { isValid: true, warning: "Could not verify via HEAD, fallback to GET succeeded." };
    } catch {
      return {
        isValid: true,
        warning: "Link could not be verified (HEAD & GET both failed), but it's allowed.",
      };
    }
  }
}
