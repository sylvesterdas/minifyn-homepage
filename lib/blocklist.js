import fs from "fs";
import path from "path";

// In-memory cache
let blocklistCache = null;
let cacheTimestamp = 0;

// Cache duration - 1 hour
const CACHE_DURATION = 60 * 60 * 1000;

export function getBlockedDomains() {
  const currentTime = Date.now();

  // Return cached version if valid
  if (blocklistCache && currentTime - cacheTimestamp < CACHE_DURATION) {
    return blocklistCache;
  }

  try {
    // Read from JSON file in repo
    const filePath = path.join(
      process.cwd(),
      "data",
      "moderation",
      "blocked-domains.json"
    );
    const fileData = fs.readFileSync(filePath, "utf8");
    const parsedData = JSON.parse(fileData);

    // Update cache
    blocklistCache = parsedData.domains || {};
    cacheTimestamp = currentTime;

    return blocklistCache;
  } catch (error) {
    console.error("Error loading blocklist:", error);
    // Return empty object or last cached version if available
    return blocklistCache || {};
  }
}

export function isUrlBlocked(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const blockedDomains = getBlockedDomains();

    return !!blockedDomains[domain];
  } catch (error) {
    // If URL parsing fails, consider it invalid
    return false;
  }
}
