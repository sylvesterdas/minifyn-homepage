const fs = require("fs");
const path = require("path");
const https = require("https");

// List of sources for malicious domains
const BLOCKLIST_SOURCES = [
  {
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
    parseFunction: parseHostsFile,
  },
  // Add other sources as needed
];

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", reject);
  });
}

function parseHostsFile(content) {
  const domains = {};
  const lines = content.split("\n");

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith("#") || !line.trim()) continue;

    // Extract domain from hosts file format
    const parts = line.split(/\s+/);
    if (parts.length >= 2 && parts[0] === "0.0.0.0") {
      const domain = parts[1].toLowerCase();
      if (domain !== "localhost") {
        domains[domain] = true;
      }
    }
  }

  return domains;
}

async function main() {
  try {
    // Get domains from all sources
    const allDomains = {};

    for (const source of BLOCKLIST_SOURCES) {
      console.log(`Fetching from ${source.url}...`);
      const data = await fetchData(source.url);
      const domains = source.parseFunction(data);

      // Merge into all domains
      Object.assign(allDomains, domains);
    }

    // Create blocklist data
    const blocklistData = {
      domains: allDomains,
      lastUpdated: new Date().toISOString(),
    };

    // Write to file
    const filePath = path.join(
      __dirname,
      "..",
      "data",
      "moderation",
      "blocked-domains.json"
    );
    fs.writeFileSync(filePath, JSON.stringify(blocklistData, null, 2));

    console.log(
      `Updated blocklist with ${Object.keys(allDomains).length} domains`
    );
  } catch (error) {
    console.error("Error updating blocklist:", error);
    process.exit(1);
  }
}

main();
