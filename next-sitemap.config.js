/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.HOME_URL || 'https://www.minifyn.com',
  generateRobotsTxt: true,
  exclude: [
    '/hi/*',       // Hindi routes
    '/dashboard*', // Dashboard routes
    '/forgot-password',
    '/blog',       // Exclude blog routes as they'll be handled dynamically
    '/blog/*'      // Exclude all blog post routes
  ],
  alternateRefs: [
    {
      href: 'https://www.minifyn.com/hi',
      hreflang: 'hi',
    },
    {
      href: 'https://mnfy.in.com',
      hreflang: 'en',
    },
    {
      href: 'https://mnfy.in.com/hi',
      hreflang: 'hi',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/forgot-password', '/api/', '/*.json$', '/*?*sort=', '/*?*filter='],
        crawlDelay: 1
      }
    ],
    additionalSitemaps: [
      'https://www.minifyn.com/api/sitemap.xml' // Dynamic blog sitemap
    ]
  }
}