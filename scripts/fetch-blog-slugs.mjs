import fetch from "node-fetch";
import { writeFile } from "fs/promises";

const HASHNODE_HOST = "www.minifyn.com/blog";
const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com";

async function fetchAllBlogSlugs(cursor = null, allSlugs = []) {
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
  const newSlugs = posts.edges.map((edge) => ({
    loc: edge.node.canonicalUrl || edge.node.url,
    changefreq: "never",
    lastmod: edge.node.updatedAt || edge.node.publishedAt
  }));
  const updatedSlugs = [...allSlugs, ...newSlugs];

  if (posts.pageInfo.hasNextPage) {
    return fetchAllBlogSlugs(posts.pageInfo.endCursor, updatedSlugs);
  }

  await writeFile(".env.local", `BLOG_SLUGS=${JSON.stringify(updatedSlugs)}`);
  return updatedSlugs;
}

async function gqlFetch(query, variables = {}) {
  const response = await fetch(HASHNODE_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_HASHNODE_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

fetchAllBlogSlugs();
