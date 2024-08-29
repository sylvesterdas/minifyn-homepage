import i18nConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n,
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    BASE_URL: process.env.BASE_URL,
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.mnfy.in',
          },
        ],
        destination: 'https://www.minifyn.com',
        permanent: false,
      },
    ];
  }
};

export default nextConfig;
