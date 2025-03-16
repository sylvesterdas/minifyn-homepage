export const HASHNODE_GQL_ENDPOINT = 'https://gql.hashnode.com';
export const HASHNODE_HOST = 'www.minifyn.com/blog';
export const HASHNODE_PUBLICATION_ID = '671cb196d70e912325b7ff84';

export async function gqlFetch(query, variables = {}) {
  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.NEXT_HASHNODE_ACCESS_TOKEN,
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify({ query, variables })
  });

  const { data, errors } = await response.json();

  if (errors) throw new Error(errors[0].message);

  return data;
}

export async function getPosts(cursor) {
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
    });

    const posts = data.publication.posts.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      excerpt: node.brief.replace('Introduction', '').trim(),
      slug: node.slug,
      date: new Date(node.publishedAt).toLocaleDateString(),
      readTime: `${node.readTimeInMinutes} min`,
      tags: node.tags.map((t) => t.name),
      coverImage: node.coverImage
    }));

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

export async function searchPosts(query, cursor) {
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
    });

    const edges = data.searchPostsOfPublication.edges;
    const posts = edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      excerpt: node.brief,
      slug: node.slug,
      date: new Date(node.publishedAt).toLocaleDateString(),
      readTime: `${node.readTimeInMinutes} min`,
      tags: node.tags.map((t) => t.name),
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

export async function getPost(slug) {
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

    const data = await gqlFetch(query, { slug });
    const post = data.publication.post;

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
      tags: post.tags.map((t) => t.name),
      coverImage: post.coverImage,
      author: post.author
    };
  } catch {
    return null;
  }
}

export async function getPostsStructuredData(cursor) {
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
    });

    const posts = data.publication.posts.edges.map(({ node }) => ({
      title: node.title,
      excerpt: node.brief.replace('Introduction', '').trim(),
      date: new Date(node.publishedAt).toISOString(),
    }));

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

export async function slugExists(slug) {
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
    = await gqlFetch(query, { slug });

  return !!data.publication.post;
}
