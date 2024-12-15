import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';
import { getFilteredPosts } from '@/lib/blog';

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Blog({ data = { posts: [], total: 0, pages: 0, currentPage: 1 } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { tag: initialTag } = router.query;
  const [selectedTag, setSelectedTag] = useState(initialTag || '');

  const allTags = Array.from(
    new Set(data.posts.flatMap(post => post.tags.map(tag => JSON.stringify(tag))))
  ).map(tag => JSON.parse(tag));

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      setIsLoading(true);
      await router.push(
        { query: { ...router.query, page: 1, search: value } }, 
        undefined, 
        { shallow: false }
      );
      setIsLoading(false);
    }, 300),
    [router]
  );

  const handleTagClick = async (tagSlug) => {
    setIsLoading(true);
    const newTag = selectedTag === tagSlug ? '' : tagSlug;
    setSelectedTag(newTag);
    await router.push(
      { query: { ...router.query, page: 1, tag: newTag } }, 
      undefined, 
      { shallow: false }
    );
    setIsLoading(false);
  };

  const handlePageChange = async (page) => {
    setIsLoading(true);
    await router.push(
      { query: { ...router.query, page } }, 
      undefined, 
      { shallow: false }
    );
    setIsLoading(false);
  };

  return (
    <>
      <SEO 
        title="Blog - MiniFyn"
        description="Latest insights about URL shortening, analytics, and web optimization."
        canonical="https://www.minifyn.com/blog"
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">MiniFyn Blog</h1>
          <input
            type="search"
            placeholder="Search posts..."
            onChange={e => debouncedSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map(tag => (
            <button
              key={tag.slug}
              onClick={() => handleTagClick(tag.slug)}
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

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-light-gray rounded-t-lg" />
                <div className="p-6 bg-white rounded-b-lg">
                  <div className="h-4 bg-light-gray rounded w-3/4 mb-4" />
                  <div className="h-4 bg-light-gray rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data.posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.posts.map(post => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  <div className="flex w-full h-48 relative items-center">
                    <Image
                      src={post.coverImage?.url || "/images/minifyn-blank.png"}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg absolute"
                      width={400}
                      height={200}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag.slug} className="text-xs px-2 py-1 bg-light-gray text-dark-gray rounded-full">
                          {tag.name}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs px-2 py-1 text-dark-gray">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`} className="block group">
                      <h2 className="text-xl font-semibold text-primary mb-2 group-hover:text-secondary">
                        {post.title}
                      </h2>
                      <p className="text-dark-gray mb-4 line-clamp-3">{post.brief}</p>
                    </Link>
                    <div className="flex justify-end">
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

            {data.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded transition-colors ${
                      (parseInt(router.query.page) || 1) === i + 1
                        ? 'bg-secondary text-white'
                        : 'bg-light-gray text-dark-gray hover:bg-medium-gray'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-gray text-lg">No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ query, locale }) {
  try {
    const { search = '', tag = '', page = 1 } = query;
    
    const [data, translations] = await Promise.all([
      getFilteredPosts({ search, tag, page: parseInt(page) }),
      serverSideTranslations(locale, ['common'])
    ]);

    return {
      props: {
        data,
        ...translations
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        data: { posts: [], total: 0, pages: 0, currentPage: 1 },
        ...(await serverSideTranslations(locale, ['common']))
      }
    };
  }
}