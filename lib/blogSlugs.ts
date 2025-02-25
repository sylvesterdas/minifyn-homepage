import { gqlFetch } from "./blog";

export interface BlogSlug {
  loc: string;
  changefreq: string;
  lastmod: string;
}

let blogSlugs: BlogSlug[] = process.env.BLOG_SLUGS ?
  JSON.parse(process.env.BLOG_SLUGS) : [];

function updateEnvBlogSlugs() {
  process.env.BLOG_SLUGS = JSON.stringify(blogSlugs);
}

export function addBlogSlug(slug: BlogSlug) {
  if (!blogSlugs.some(existingSlug => existingSlug.loc === slug.loc)) {
    blogSlugs = [...blogSlugs, slug];
    updateEnvBlogSlugs();
  }
}

export function getBlogSlugs() {
  return blogSlugs;
}

export function deleteBlogSlug(loc: string) {
  blogSlugs = blogSlugs.filter(slug => slug.loc !== loc);
  updateEnvBlogSlugs();
}

export function editBlogSlug(loc: string, updatedSlug: BlogSlug) {
  const index = blogSlugs.findIndex(slug => slug.loc === loc);

  if (index !== -1) {
    blogSlugs[index] = { ...blogSlugs[index], ...updatedSlug };
    updateEnvBlogSlugs();
  }
}

export async function fetchBlogSitemapData(id: string): Promise<BlogSlug | null> {
  const query = `
    query Post($id: ID!) {
      post(id: $id) {
        id
        url
        canonicalUrl
        publishedAt
        updatedAt
      }
    }
  `;

  try {
    const data = await gqlFetch(query, { id });

    const post = data.post;

    return {
      loc: post.canonicalUrl || post.url,
      changefreq: "never",
      lastmod: post.updatedAt || post.publishedAt
    };
  } catch (error) {
    console.error("Error fetching blog sitemap data:", error);

    return null;
  }
}