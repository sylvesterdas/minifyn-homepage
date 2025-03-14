export const HASHNODE_GQL_ENDPOINT = 'https://gql.hashnode.com';
export const HASHNODE_HOST = 'www.minifyn.com/blog';
export const HASHNODE_PUBLICATION_ID = '671cb196d70e912325b7ff84';

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  date: string;
  slug: string;
  canonical?: string;
  content: { html: string, markdown: string };
  author: { name: string, profilePicture: string };
  brief: string;
  publishedAt: string;
  readTimeInMinutes: string;
  coverImage?: {
    url: string;
  };
}

export interface Response {
  searchPostsOfPublication: any,
  publication: {
    posts: {
      edges: Post[],
      pageInfo: {
        total: number,
        hasNextPage: boolean,
        endCursor: string
      }
    },
    post: Post
  }
}

export async function gqlFetch(query: string, variables = {}) {
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

  return data;
}

export async function getPosts(cursor?: string): Promise<{
  posts: Post[],
  nextCursor: string | null
}> {
  try {
    const query = `
      query Publication($first: Int!, $after: String) {
        publication(host: "${HASHNODE_HOST}") {
          posts(first: $first, after: $after) {
            edges {
              cursor
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
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

    const data = await gqlFetch(query, {
      first: 10,
      after: cursor
    }) as Response;

    const posts = data.publication.posts.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      excerpt: node.brief.replace('Introduction', '').trim(),
      slug: node.slug,
      date: new Date(node.publishedAt).toLocaleDateString(),
      readTime: `${node.readTimeInMinutes} min`,
      tags: node.tags.map((t: any) => t.name),
      coverImage: node.coverImage
    })) as Post[];

    return {
      posts,
      nextCursor: data.publication.posts.pageInfo.hasNextPage
        ? data.publication.posts.pageInfo.endCursor
        : null
    };
  } catch {
    return { posts: [], nextCursor: null };
  }
}

export async function searchPosts(query: string, cursor?: string): Promise<{
  posts: Post[],
  nextCursor: string | null
}> {
  try {
    const gqlQuery = `
      query SearchPosts($first: Int!, $after: String, $filter: SearchPostsOfPublicationFilter!) {
        searchPostsOfPublication(
          first: $first,
          after: $after,
          filter: $filter,
        ) {
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
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const data = await gqlFetch(gqlQuery, {
      first: 6,
      after: cursor,
      filter: {
        query,
        publicationId: HASHNODE_PUBLICATION_ID
      }
    }) as Response;

    const edges = data.searchPostsOfPublication.edges;
    const posts = edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      excerpt: node.brief,
      slug: node.slug,
      date: new Date(node.publishedAt).toLocaleDateString(),
      readTime: `${node.readTimeInMinutes} min`,
      tags: node.tags.map((t: any) => t.name),
      coverImage: node.coverImage
    }));

    return {
      posts,
      nextCursor: data.searchPostsOfPublication.pageInfo.hasNextPage
        ? data.searchPostsOfPublication.pageInfo.endCursor
        : null
    };
  } catch {
    return { posts: [], nextCursor: null };
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
              markdown
            }
            brief
            url
            canonicalUrl
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
    const post = data.publication.post as any;

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      excerpt: post.brief,
      content: post.content,
      slug,
      canonical: post.canonicalUrl || post.url,
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

export async function getPostsStructuredData(cursor?: string): Promise<{
  posts: Post[],
  nextCursor: string | null
}> {
  try {
    const query = `
      query Publication($first: Int!, $after: String) {
        publication(host: "${HASHNODE_HOST}") {
          posts(first: $first, after: $after) {
            edges {
              node {
                id
                title
                brief
                publishedAt
              }
            }
          }
        }
      }
    `;

    const data = await gqlFetch(query, {
      first: 10,
      after: cursor
    }) as Response;

    const posts = data.publication.posts.edges.map(({ node }: any) => ({
      title: node.title,
      excerpt: node.brief.replace('Introduction', '').trim(),
      date: new Date(node.publishedAt).toISOString(),
    })) as Post[];

    return {
      posts,
      nextCursor: data.publication.posts.pageInfo.hasNextPage
        ? data.publication.posts.pageInfo.endCursor
        : null
    };
  } catch {
    return { posts: [], nextCursor: null };
  }
}

export async function slugExists(slug: string): Promise<boolean> {
  const query = `
    query Post($slug: String!) {
      publication(host: "${HASHNODE_HOST}") {
        post(slug: $slug) {
          id
        }
      }
    }
  `;

  const data
    = await gqlFetch(query, { slug }) as Response;

  return !!data.publication.post;
}
