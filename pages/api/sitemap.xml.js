import { getLatestPosts } from '@/lib/blog';
import { kv } from '@vercel/kv';

const SITEMAP_CACHE_KEY = 'sitemap:blog:cache';
const CACHE_TTL = 3600; // 1 hour

function getAlternateLinks(slug) {
  return `
    <xhtml:link 
      rel="alternate" 
      hreflang="en" 
      href="https://www.minifyn.com/blog/${slug}" 
    />
    <xhtml:link 
      rel="alternate" 
      hreflang="hi" 
      href="https://www.minifyn.com/hi/blog/${slug}" 
    />
    <xhtml:link 
      rel="alternate" 
      hreflang="en" 
      href="https://mnfy.in.com/blog/${slug}" 
    />
    <xhtml:link 
      rel="alternate" 
      hreflang="hi" 
      href="https://mnfy.in.com/hi/blog/${slug}" 
    />`;
}

export default async function handler(req, res) {
  try {
    const cachedSitemap = await kv.get(SITEMAP_CACHE_KEY);
    if (cachedSitemap) {
      res.setHeader('Content-Type', 'application/xml');
      return res.send(cachedSitemap);
    }

    const posts = await getLatestPosts(100);
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <url>
        <loc>https://www.minifyn.com/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
        ${getAlternateLinks('')}
      </url>
      ${posts.map(post => `
        <url>
          <loc>https://www.minifyn.com/blog/${post.slug}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
          ${getAlternateLinks(post.slug)}
        </url>
      `).join('')}
    </urlset>`;

    await kv.set(SITEMAP_CACHE_KEY, sitemap, { ex: CACHE_TTL });

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}