/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.HOME_URL || 'https://www.minifyn.com',
  generateRobotsTxt: true,
  exclude: ['/hi*', '/dashboard*', '/forgot-password'],
  alternateRefs: [
    {
      href: 'https://www.minifyn.com/hi',
      hreflang: 'hi',
    }
  ],
}