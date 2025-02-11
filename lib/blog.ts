const HASHNODE_GQL_ENDPOINT = 'https://gql.hashnode.com';
const HASHNODE_HOST = 'www.minifyn.com/blog';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  date: string;
  slug: string;
  content: { html: string, markdown: string };
  author: { name: string, profilePicture: string };
  brief: string;
  publishedAt: string;
  readTimeInMinutes: string;
  coverImage?: {
    url: string;
  };
}

export interface Response { publication: { posts: { edges: Post[] }, post: Post } }

/**
 * 
 * @param query 
 * @param variables 
 * @returns {Promise<Response>}
 */
async function gqlFetch<Response>(query: string, variables = {}) {
  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.NEXT_HASHNODE_ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query, variables })
  });

  const { data, errors } = await response.json();

  if (errors) throw new Error(errors[0].message);

  return data as Response;
}

export async function getPosts(page = 1, limit = 12): Promise<{ posts: Post[], total: number }> {
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
                }
                readTimeInMinutes
                publishedAt
              }
            }
          }
        }
      }
    `;

    const data = await gqlFetch(query, { first: limit }) as Response;
    const posts = data.publication.posts.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      excerpt: node.brief,
      slug: node.slug,
      date: new Date(node.publishedAt).toLocaleDateString(),
      readTime: `${node.readTimeInMinutes} min`,
      tags: node.tags.map((t: any) => t.name),
      coverImage: node.coverImage
    })) as Post[];

    return { posts, total: posts.length };
  } catch {
    return { posts: [], total: 0 };
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const query = `
      query Post($slug: String!) {
        publication(host: "${HASHNODE_HOST}") {
          post(slug: $slug) {
            id
            title
            content {
              html
              markdown
            }
            brief
            coverImage {
              url
            }
            tags {
              name
            }
            author {
              name
              profilePicture
            }
            readTimeInMinutes
            publishedAt
          }
        }
      }
    `;

    const data = await gqlFetch(query, { slug }) as Response;
    const post = data.publication.post;

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      excerpt: post.brief,
      content: post.content,
      slug,
      date: new Date(post.publishedAt).toLocaleDateString(),
      readTime: `${post.readTimeInMinutes} min`,
      tags: post.tags.map((t: any) => t.name),
      coverImage: post.coverImage,
      author: post.author
    } as Post;
  } catch {
    return null;
  }
}
