import Head from 'next/head';

const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MiniFyn",
  "url": "https://www.minifyn.com",
  "logo": "https://www.minifyn.com/logo.png",
  "sameAs": [
    "https://twitter.com/minifyn",
    "https://github.com/minifyn"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@minifyn.com",
    "contactType": "customer support"
  }
};

const blogPostSchema = (post) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.brief,
  "image": post.coverImage?.url || "https://www.minifyn.com/og-image.jpg",
  "author": {
    "@type": "Person",
    "name": post.author?.name || "MiniFyn Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MiniFyn",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.minifyn.com/logo.png"
    }
  },
  "url": `https://www.minifyn.com/blog/${post.slug}`,
  "datePublished": post.dateAdded || new Date().toISOString(),
  "dateModified": post.dateUpdated || new Date().toISOString(),
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.minifyn.com/blog/${post.slug}`
  }
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MiniFyn",
  "url": "https://www.minifyn.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.minifyn.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const SEO = ({ 
  title = "MiniFyn - Quick Links & QR Codes for Devs",
  description = "Free URL shortener & QR generator for developers. Perfect for side projects, API testing, and small businesses. Try MiniFyn now!",
  keywords = [],
  canonical = "https://www.minifyn.com",
  ogImage = "https://www.minifyn.com/og-image.jpg",
  twitterImage = "https://www.minifyn.com/twitter-image.jpg",
  noindex = false,
  blogPost = null,
  alternateUrls = {
    en: 'https://www.minifyn.com',
    hi: 'https://www.minifyn.com/hi'
  },
  type = 'website',
  published = null,
  modified = null,
  author = "MiniFyn Team"
}) => {
  // Combine default and custom keywords
  const allKeywords = [
    ...new Set([
      'URL shortener',
      'QR code generator',
      'developer tools',
      'free link management',
      'API testing',
      'side projects',
      'small business tools',
      ...keywords
    ])
  ];

  // Determine which schema to use
  const schema = blogPost ? blogPostSchema(blogPost) : 
    type === 'website' ? websiteSchema : defaultSchema;

  return (
    <Head>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={allKeywords.join(', ')} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Canonical and Alternate URLs */}
      <link rel="canonical" href={canonical} />
      {Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:site_name" content="MiniFyn" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@minifyn" />
      <meta name="twitter:creator" content="@minifyn" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      
      {/* Article Specific (for blog posts) */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={published} />
          <meta property="article:modified_time" content={modified} />
          <meta property="article:author" content={author} />
          {keywords.map(keyword => (
            <meta key={keyword} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Robots */}
      <meta 
        name="robots" 
        content={`${noindex ? 'noindex' : 'index'}, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`} 
      />
      
      {/* Google */}
      <meta name="google-adsense-account" content="ca-pub-4781198854082500" />
      
      {/* JSON-LD Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default SEO;