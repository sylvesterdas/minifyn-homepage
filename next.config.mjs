import {withSentryConfig} from '@sentry/nextjs';
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "minifyn",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
  enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});