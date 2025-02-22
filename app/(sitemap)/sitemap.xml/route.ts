import { NextResponse } from 'next/server'

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://www.minifyn.com/website.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://www.minifyn.com/blog.xml</loc>
      </sitemap>
    </sitemapindex>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
