import i18nConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: i18nConfig.i18n,
  serverRuntimeConfig: {
    // Will only be available on the server side
    NEXT_RECAPTCHA_SECRET_KEY: process.env.NEXT_RECAPTCHA_SECRET_KEY,
    NEXT_RAZORPAY_KEY_ID: process.env.NEXT_RAZORPAY_KEY_ID,
    NEXT_RAZORPAY_KEY_SECRET: process.env.NEXT_RAZORPAY_KEY_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
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
