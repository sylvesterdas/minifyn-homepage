import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Tag, User } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getPostBySlug, getLatestPosts } from '@/lib/blog';
import SEO from '@/components/SEO';
import Image from 'next/image';

export default function BlogPost({ post }) {
  const router = useRouter();
  const { t } = useTranslation('common');

  if (router.isFallback) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-light-gray rounded w-3/4 mb-4" />
          <div className="h-4 bg-light-gray rounded w-1/2 mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-light-gray rounded w-full" />
            <div className="h-4 bg-light-gray rounded w-full" />
            <div className="h-4 bg-light-gray rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Post not found</h1>
        <Link 
          href="/blog"
          className="text-secondary hover:text-primary transition-colors"
        >
          Return to blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${post.title} - MiniFyn Blog`}
        description={post.brief}
        type="article"
        published={post.dateAdded}
        modified={post.dateUpdated}
        author={post.author?.name}
        blogPost={post}
        canonical={`https://www.minifyn.com/blog/${post.slug}`}
        ogImage={post.coverImage?.url || "https://www.minifyn.com/og-image.jpg"}
        twitterImage={post.coverImage?.url || "https://www.minifyn.com/twitter-image.jpg"}
        keywords={[
          ...post.tags.map(tag => tag.name),
          'URL shortening',
          'web tools',
          'developer resources'
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back to blog */}
        <Link
          href="/blog"
          className="inline-flex items-center text-secondary hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to blog
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <Link
                key={tag.slug}
                href={`/blog?tag=${tag.slug}`}
                className="inline-flex items-center px-3 py-1 bg-light-gray hover:bg-medium-gray text-dark-gray rounded-full text-sm transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Link>
            ))}
          </div>

          {/* Author */}
          {post.author && (
            <div className="flex items-center text-dark-gray">
              {post.author.profilePicture ? (
                <Image
                  src={post.author.profilePicture}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <User className="w-6 h-6 mr-2" />
              )}
              <span>{post.author.name}</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getLatestPosts(20);
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: true
  };
}

export async function getStaticProps({ params, locale }) {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        post,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true
    };
  }
}