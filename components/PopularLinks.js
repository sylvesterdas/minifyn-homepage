import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { TrendingUp, ArrowUpRight, Users, Link as LinkIcon, Sparkles } from 'lucide-react';
import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Placeholder images using CSS gradients and categories
const PLACEHOLDER_GRADIENTS = {
  guide: 'bg-gradient-to-br from-secondary to-teal',
  tutorial: 'bg-gradient-to-br from-teal to-secondary',
  api: 'bg-gradient-to-br from-secondary to-teal',
};

// Updated fallback data
const FALLBACK_DATA = {
  totalLinks: 1000,
  totalClicks: 5000,
  activeUsers: 200,
  popularLinks: [
    {
      id: 'getting-started',
      slug: 'getting-started-with-minifyn-your-guide-to-smarter-url-shortening',
      title: 'Getting Started with MiniFyn: A Developer\'s Guide',
      brief: 'Learn how to leverage MiniFyn\'s URL shortening service for your projects. From basic usage to advanced features, this guide covers everything you need to know.',
      category: 'guide',
      tags: [
        { name: 'Guide', slug: 'guide' },
        { name: 'Tutorial', slug: 'tutorial' }
      ]
    },
    {
      id: 'url-best-practices',
      slug: 'url-shortening-best-practices-for-developers',
      title: 'URL Shortening Best Practices for Developers',
      brief: 'Discover the best practices for managing shortened URLs, including naming conventions, analytics tracking, and security considerations.',
      category: 'tutorial',
      tags: [
        { name: 'Best Practices', slug: 'best-practices' },
        { name: 'Security', slug: 'security' }
      ]
    },
    {
      id: 'api-integration',
      slug: 'integrating-minifyn-api-in-your-applications',
      title: 'Integrating MiniFyn API in Your Applications',
      brief: 'Step-by-step guide to integrate MiniFyn\'s API into your applications. Learn about authentication, rate limits, and handling responses.',
      category: 'api',
      tags: [
        { name: 'API', slug: 'api' },
        { name: 'Integration', slug: 'integration' }
      ]
    }
  ]
};

const StatsCard = ({ value, label, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
    <div className="bg-light-gray p-3 rounded-lg">
      <Icon className="w-6 h-6 text-secondary" />
    </div>
    <div>
      <div className="text-2xl font-bold text-primary">
        {typeof value === 'number' && value >= 1000 
          ? `${Math.floor(value / 1000)}k+` 
          : `${value}+`
        }
      </div>
      <div className="text-dark-gray text-sm">{label}</div>
    </div>
  </div>
);

// Updated FeaturedPost component
const FeaturedPost = ({ post }) => (
  <Link 
    href={`/blog/${post.slug}`}
    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 group"
  >
    <div className={`relative h-48 mb-4 rounded-lg overflow-hidden ${
      post.coverImage?.url 
        ? '' 
        : PLACEHOLDER_GRADIENTS[post.category] || 'bg-gradient-to-br from-secondary to-teal'
    }`}>
      {post.coverImage?.url ? (
        <Image 
          src={post.coverImage.url}
          alt={post.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-lg font-medium">
            {post.category?.charAt(0).toUpperCase() + post.category?.slice(1) || 'Featured'}
          </span>
        </div>
      )}
    </div>
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {post.tags.slice(0, 2).map(tag => (
          <span 
            key={tag.slug}
            className="text-xs px-2 py-1 bg-light-gray text-dark-gray rounded-full"
          >
            {tag.name}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors">
        {post.title}
      </h3>
      <p className="text-dark-gray text-sm line-clamp-2">
        {post.brief}
      </p>
      <div className="flex items-center text-secondary pt-2">
        <span className="text-sm">Read article</span>
        <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </div>
  </Link>
);

const PopularLinks = () => {
  const { t } = useTranslation('common');
  const { data: apiData, error } = useSWR('/api/public-stats', fetcher, {
    refreshInterval: 300000 // Refresh every 5 minutes
  });

  // Use API data if available, otherwise use fallback
  const stats = React.useMemo(() => {
    if (error || !apiData) return FALLBACK_DATA;
    
    // If API returns empty or low numbers, use fallback
    return {
      totalLinks: apiData.totalLinks > 1000 ? apiData.totalLinks : FALLBACK_DATA.totalLinks,
      totalClicks: apiData.totalClicks > 5000 ? apiData.totalClicks : FALLBACK_DATA.totalClicks,
      activeUsers: apiData.activeUsers > 200 ? apiData.activeUsers : FALLBACK_DATA.activeUsers,
      popularLinks: apiData.popularLinks?.length >= 3 
        ? apiData.popularLinks 
        : FALLBACK_DATA.popularLinks
    };
  }, [apiData, error]);

  return (
    <div className="bg-light-gray py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Learn More About MiniFyn
          </h2>
          <p className="text-dark-gray max-w-2xl mx-auto">
            Discover tips, tutorials, and best practices for URL management and analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            value={stats.totalLinks}
            label="Links Created"
            icon={LinkIcon}
          />
          <StatsCard 
            value={stats.totalClicks}
            label="Total Clicks"
            icon={TrendingUp}
          />
          <StatsCard 
            value={stats.activeUsers}
            label="Active Users"
            icon={Users}
          />
        </div>

        {/* Featured Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-secondary" />
              Featured Articles
            </h3>
            <Link 
              href="/blog" 
              className="text-secondary hover:text-primary transition-colors flex items-center"
            >
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.popularLinks.slice(0, 3).map(post => (
              <FeaturedPost key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Get Started with MiniFyn
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
          <p className="text-dark-gray text-sm mt-2">
            No credit card required • Free plan available
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularLinks;