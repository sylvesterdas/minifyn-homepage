import { kv } from '@vercel/kv';

const HASHNODE_GQL_ENDPOINT = 'https://gql.hashnode.com';
const HASHNODE_ACCESS_TOKEN = process.env.NEXT_HASHNODE_ACCESS_TOKEN;
const HASHNODE_HOST = 'www.minifyn.com/blog';
const POSTS_CACHE_KEY = 'blog:posts';
const POST_CACHE_KEY = 'blog:post:';
const CACHE_TTL = 1800;

async function gqlFetch(query, variables = {}) {
  if (!HASHNODE_ACCESS_TOKEN) {
    throw new Error('Hashnode access token not configured');
  }

  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': HASHNODE_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables })
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

export async function getLatestPosts(first = 10) {
  try {
    const cachedPosts = await kv.get(POSTS_CACHE_KEY);
    if (cachedPosts) return cachedPosts.slice(0, first);

    const query = `
      query Publication($first: Int!) {
        publication(host: "${HASHNODE_HOST}") {
          posts(first: $first) {
            edges {
              node {
                id
                title
                brief
                slug
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    `;

    const data = await gqlFetch(query, { first: Math.min(first, 50) });
    const posts = data.publication.posts.edges.map(({ node }) => node);
    await kv.set(POSTS_CACHE_KEY, posts, { ex: CACHE_TTL });
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug) {
  try {
    const cacheKey = `${POST_CACHE_KEY}${slug}`;
    const cachedPost = await kv.get(cacheKey);
    if (cachedPost) return cachedPost;

    const query = `
      query Post($slug: String!) {
        publication(host: "${HASHNODE_HOST}") {
          post(slug: $slug) {
            id
            title
            content {
              html
            }
            brief
            coverImage {
              url
            }
            tags {
              name
              slug
            }
            author {
              name
              profilePicture
            }
          }
        }
      }
    `;

    const data = await gqlFetch(query, { slug });
    if (!data.publication.post) return null;

    const post = data.publication.post;
    await kv.set(cacheKey, post, { ex: CACHE_TTL });
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getFilteredPosts({ search = '', tag = '', page = 1, limit = 12 } = {}) {
  try {
    const query = `
      query Publication($first: Int!) {
        publication(host: "${HASHNODE_HOST}") {
          posts(first: $first) {
            edges {
              node {
                id
                title
                brief
                slug
                coverImage {
                  url
                }
                tags {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    `;

    const cacheKey = `blog:filtered:${search}:${tag}:${page}`;
    let posts = await kv.get(cacheKey);

    if (!posts) {
      const data = await gqlFetch(query, { first: 50 }); // Fetch max posts
      posts = data.publication.posts.edges.map(({ node }) => node);

      if (search) {
        const searchLower = search.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.brief.toLowerCase().includes(searchLower)
        );
      }

      if (tag) {
        posts = posts.filter(post => 
          post.tags.some(t => t.slug === tag)
        );
      }

      await kv.set(cacheKey, posts, { ex: CACHE_TTL });
    }

    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    return {
      posts: paginatedPosts,
      total: posts.length,
      pages: Math.ceil(posts.length / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching filtered posts:', error);
    return { posts: [], total: 0, pages: 0, currentPage: 1 };
  }
}