import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getLatestPosts } from '@/lib/blog';
import SEO from '@/components/SEO';
import Image from 'next/image';

export default function Blog({ posts }) {
  const { t } = useTranslation('common');
  const [selectedTag, setSelectedTag] = useState(null);

  // Get unique tags from all posts, limited to most used ones
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags.map(tag => JSON.stringify(tag))))
  )
    .map(tag => JSON.parse(tag))
    .slice(0, 5);

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.some(tag => tag.slug === selectedTag))
    : posts;

  return (
    <>
      <SEO 
        title="Blog - MiniFyn"
        description="Latest insights about URL shortening, analytics, and web optimization from the MiniFyn team."
        canonical="https://www.minifyn.com/blog"
        keywords={['URL shortening', 'web analytics', 'developer tools', 'tutorials', 'guides']}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            MiniFyn Blog
          </h1>
          <p className="text-dark-gray text-lg max-w-2xl mx-auto">
            Insights and guides about URL shortening, analytics, and web optimization
          </p>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map(tag => (
            <button
              key={tag.slug}
              onClick={() => setSelectedTag(selectedTag === tag.slug ? null : tag.slug)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag.slug
                  ? 'bg-secondary text-white'
                  : 'bg-light-gray text-dark-gray hover:bg-medium-gray'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <article 
              key={post.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {post.coverImage && (
                <Image
                  src={post.coverImage.url}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-6">
                {/* Show only first 2 tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <span 
                      key={tag.slug}
                      className="text-xs px-2 py-1 bg-light-gray text-dark-gray rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="text-xs px-2 py-1 text-dark-gray">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-primary mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-secondary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-dark-gray mb-4 line-clamp-3">
                  {post.brief}
                </p>

                <div className="flex items-center justify-end">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center text-secondary hover:text-primary transition-colors"
                  >
                    Read more
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  try {
    const posts = await getLatestPosts(20);

    return {
      props: {
        posts,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      props: {
        posts: [],
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60, // Retry sooner if there was an error
    };
  }
}