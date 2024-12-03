import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Tag } from 'lucide-react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getPostBySlug, getLatestPosts } from '@/lib/blog';
import SEO from '@/components/SEO';
import Image from 'next/image';

export default function BlogPost({ post }) {
  const router = useRouter();

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
        <Link
          href="/blog"
          className="inline-flex items-center text-secondary hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to blog
        </Link>

        {post.coverImage && (
          <div className="relative w-full h-fit mb-8 rounded-lg overflow-hidden">
            <Image
              width={1260}
              height={630}
              src={post.coverImage.url}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {post.title}
          </h1>

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

          {post.author && (
            <div className="flex items-center text-dark-gray">
              <Image src={'/logo.png'} className='w-8 h-8 mr-2' alt="author-image" width={32} height={32} />
              <span>{post.author.name}</span>
            </div>
          )}
        </header>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </article>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  try {
    const posts = await getLatestPosts(20);
    const paths = locales.flatMap(locale => 
      posts.map(post => ({
        params: { slug: post.slug },
        locale
      }))
    );

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params, locale }) {
  try {
    const [post, translations] = await Promise.all([
      getPostBySlug(params.slug),
      serverSideTranslations(locale, ['common'])
    ]);
    
    if (!post) return { notFound: true };

    return {
      props: {
        post: { ...post, slug: params.slug },
        ...translations
      },
      revalidate: 1800
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}