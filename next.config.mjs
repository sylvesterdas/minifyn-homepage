const allowedOrigins = ["https://www.minifyn.com", "https://www.mnfy.in"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    BASE_URL: process.env.BASE_URL,
    NEXT_RECAPTCHA_SECRET_KEY: process.env.NEXT_RECAPTCHA_SECRET_KEY,
    NEXT_RAZORPAY_KEY_SECRET: process.env.NEXT_RAZORPAY_KEY_SECRET,
    NEXT_HASHNODE_ACCESS_TOKEN: process.env.NEXT_HASHNODE_ACCESS_TOKEN,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_RAZORPAY_KEY_ID: process.env.NEXT_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "cdn.hashnode.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        has: [{ type: "host", value: "www.mnfy.in" }],
        destination: "https://www.minifyn.com/dashboard",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        has: [{ type: "host", value: "www.mnfy.in" }],
        destination: "https://www.minifyn.com/dashboard/:path*",
        permanent: false,
      },
      {
        source: "/blog",
        has: [{ type: "host", value: "www.mnfy.in" }],
        destination: "https://www.minifyn.com/blog",
        permanent: false,
      },
      {
        source: "/blog/:path*",
        has: [{ type: "host", value: "www.mnfy.in" }],
        destination: "https://www.minifyn.com/blog/:path*",
        permanent: false,
      },
      {
        source: "/api/payment/:path*",
        destination: "/404",
        permanent: false,
      },
      {
        source: "/api/webhooks/razorpay",
        destination: "/404",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
