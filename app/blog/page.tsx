import { Metadata } from 'next';

import { JsonLd } from '../components/JsonLd';

import BlogContent from './blog-content';

import { gqlFetch, HASHNODE_HOST, Post, Response } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata(): Promise<Metadata> {
  const keywords = 'web performance, web development, performance tips';
  const ogImage = `https://www.minifyn.com/images/og-blog.png`;

  return {
    title: 'MiniFyn Blog - Web Performance & Development Tips',
    description: 'Expert tips on web performance optimization, JavaScript development, code minification, and modern web development techniques for faster, better websites.',
    keywords,
    openGraph: {
      type: 'website',
      siteName: 'MiniFyn Blog',
      title: 'MiniFyn Blog - Web Performance & Development Tips',
      description: 'Expert tips on web performance optimization, JavaScript development, code minification, and modern web development techniques for faster, better websites.',
      locale: 'en_US',
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'MiniFyn Blog - Web Performance Tips'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'MiniFyn Blog - Web Performance & Development Tips',
      description: 'Expert tips on web performance optimization, JavaScript development, code minification, and modern web development techniques.',
      images: [ogImage]
    },
    authors: [{ name: 'Sylvester Das' }],
    metadataBase: new URL('https://www.minifyn.com/blog/'),
    alternates: {
      canonical: 'https://www.minifyn.com/blog'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large'
      }
    }
  }
}

const blogSchema = (posts: any) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "MiniFyn Blog",
  description: "Expert tips on web performance optimization, JavaScript development, code minification, and modern web development techniques.",
  url: "https://www.minifyn.com/blog",
  author: {
    "@type": "Person",
    name: "Sylvester Das"
  },
  publisher: {
    "@type": "Organization",
    name: "MiniFyn",
    logo: {
      "@type": "ImageObject",
      url: "https://www.minifyn.com/logo.png"
    }
  },
  blogPost: posts.map((post: any) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Sylvester Das"
    }
  })),
});

export default async function BlogPage() {
  const { posts } = await getPosts();

  return <>
    <JsonLd data={blogSchema(posts)} />

    <BlogContent />
  </>
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
