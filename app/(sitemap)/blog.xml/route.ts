import { NextResponse } from "next/server";

import { gqlFetch, HASHNODE_HOST } from "@/lib/blog";

export async function GET() {
  const entries = await fetchAllBlogSlugs();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${entries
        .map(
          (entry: { loc: any; lastmod: string; changefreq: any }) => `
        <url>
          <loc>${entry.loc}</loc>
          <lastmod>${formatDate(entry.lastmod)}</lastmod>
          <changefreq>${entry.changefreq}</changefreq>
        </url>
      `
        )
        .join("")}
    </urlset>`;

  const headers: HeadersInit = {
    "Content-Type": "application/xml",
    "Cache-Control":
      process.env.NODE_ENV === "development"
        ? "no-store, no-cache, must-revalidate, proxy-revalidate"
        : "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    ...(process.env.NODE_ENV === "development" && {
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    }),
  };

  return new NextResponse(xml, { headers });
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toISOString().split("T")[0];
}

async function fetchAllBlogSlugs(cursor = null, allSlugs: Array<object> = []) {
  const query = `query Publication($first: Int!, $after: String) {
    publication(host: "${HASHNODE_HOST}") {
      posts(first: $first, after: $after) {
        edges {
          cursor
          node {
            url
            canonicalUrl
            publishedAt
            updatedAt
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }`;

  const data = await gqlFetch(query, {
    first: 10,
    after: cursor,
  });

  const posts = data.publication.posts;
  const newSlugs = posts.edges.map((edge: any) => ({
    loc: edge.node.canonicalUrl || edge.node.url,
    changefreq: "never",
    lastmod: edge.node.updatedAt || edge.node.publishedAt,
  }));
  const updatedSlugs = cursor ? [...allSlugs, ...newSlugs] : newSlugs;

  if (posts.pageInfo.hasNextPage) {
    return fetchAllBlogSlugs(posts.pageInfo.endCursor, updatedSlugs);
  }

  return updatedSlugs;
}
