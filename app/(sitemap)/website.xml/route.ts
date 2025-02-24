import { NextResponse } from "next/server";

export async function GET() {
  const routes = [
    { path: "", changefreq: "weekly", priority: 1.0, lastmod: "2025-02-23" },
    { path: "/docs", changefreq: "weekly", priority: 0.5, lastmod: "2025-02-23" },
    { path: "/about", changefreq: "monthly", priority: 0.5, lastmod: "2025-02-23" },
    { path: "/blog", changefreq: "hourly", priority: 0.9, lastmod: "2025-02-23" },
    // { path: "/contact", changefreq: "weekly", priority: 0.7, lastmod: "2025-02-23" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes
        .map(
          (route) => `
        <url>
          <loc>https://www.minifyn.com${route.path}</loc>
          <changefreq>${route.changefreq}</changefreq>
          <priority>${route.priority}</priority>
          <lastmod>${route.lastmod}</lastmod>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
