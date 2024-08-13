/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    BASE_URL: process.env.BASE_URL,
  },
};

export default nextConfig;
