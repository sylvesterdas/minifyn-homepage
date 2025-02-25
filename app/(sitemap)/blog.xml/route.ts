import { NextResponse } from "next/server";

import { getBlogSlugs } from "@/lib/blogSlugs";

export async function GET() {
  const slugs = getBlogSlugs();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${slugs
        .map(
          (slug) => `
        <url>
          <loc>${slug.loc}</loc>
          <changefreq>${slug.changefreq}</changefreq>
          <lastmod>${slug.lastmod}</lastmod>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
