const HASHNODE_GQL_ENDPOINT = 'https://gql.hashnode.com';
const HASHNODE_ACCESS_TOKEN = process.env.NEXT_HASHNODE_ACCESS_TOKEN;
const HASHNODE_HOST = 'www.minifyn.com/blog';

async function gqlFetch(query, variables = {}) {
  if (!HASHNODE_ACCESS_TOKEN) {
    throw new Error('Hashnode access token is not configured');
  }

  try {
    const response = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': HASHNODE_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables })
    });

    const { data, errors } = await response.json();
    
    if (errors) {
      throw new Error(errors[0].message);
    }

    return data;
  } catch (error) {
    console.error('Blog API Error:', error);
    throw error;
  }
}

export async function getLatestPosts(first = 10) {
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

  const data = await gqlFetch(query, { first });
  return data.publication.posts.edges.map(({ node }) => node);
}

export async function getPostBySlug(slug) {
  const query = `
    query Post($slug: String!) {
      publication(host: "${HASHNODE_HOST}") {
        post(slug: $slug) {
          id
          title
          content {
            markdown
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
  return data.publication.post;
}
