import Head from 'next/head';

const SEO = ({ 
  title = "MiniFyn - Quick Links & QR Codes for Devs",
  description = "Free URL shortener & QR generator for developers. Perfect for side projects, API testing, and small businesses. Try MiniFyn now!",
  keywords = [],
  canonical = "https://www.minifyn.com",
  ogImage = "https://www.minifyn.com/og-image.jpg",
  twitterImage = "https://www.minifyn.com/twitter-image.jpg"
}) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    {keywords.length > 0 ? '<meta name="keywords" content="MiniFyn, developers, software, integration, REST API, JSON">' : ''}
    <link rel="icon" href="/favicon.ico" />
    <link rel="canonical" href={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={twitterImage} />
    <meta name="google-adsense-account" content="ca-pub-4781198854082500" />
    <meta name="keywords" content="URL shortener, QR code generator, developer tools, free link management, API testing, side projects, small business tools" />
  </Head>
);

export default SEO;