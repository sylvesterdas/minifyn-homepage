import i18nConfig from './next-i18next.config.js';

const allowedOrigins = ['https://www.minifyn.com', 'https://www.mnfy.in'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n,
  serverRuntimeConfig: {
    NEXT_RECAPTCHA_SECRET_KEY: process.env.NEXT_RECAPTCHA_SECRET_KEY,
    NEXT_RAZORPAY_KEY_ID: process.env.NEXT_RAZORPAY_KEY_ID,
    NEXT_RAZORPAY_KEY_SECRET: process.env.NEXT_RAZORPAY_KEY_SECRET,
  },
  publicRuntimeConfig: {
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  async redirects() {
    return [
      // {
      //   source: '/',
      //   has: [{ type: 'host', value: 'www.mnfy.in' }],
      //   destination: 'https://www.minifyn.com',
      //   permanent: false,
      // },
      {
        source: '/dashboard',
        has: [{ type: 'host', value: 'www.mnfy.in' }],
        destination: 'https://www.minifyn.com/dashboard',
        permanent: false,
      },
      {
        source: '/dashboard/:path*',
        has: [{ type: 'host', value: 'www.mnfy.in' }],
        destination: 'https://www.minifyn.com/dashboard/:path*',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;