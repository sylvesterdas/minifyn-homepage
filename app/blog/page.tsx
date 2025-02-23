import { Metadata } from 'next';

import BlogContent from './blog-content';

import { getPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function generateMetadata(): Promise<Metadata> {
  const keywords = 'web performance, web development, performance tips';
  const ogImage = `/blog/og?title=${encodeURIComponent("Minifyn Blog")}&tags=${encodeURIComponent(keywords.split(', ').join(','))}}`;

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

export default async function BlogPage() {
  const { posts, nextCursor } = await getPosts();

  return <BlogContent nextCursor={nextCursor} posts={posts} />
}
