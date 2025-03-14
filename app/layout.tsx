import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
// import clsx from "clsx";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import { JsonLd } from "./components/JsonLd";

import { siteConfig } from "@/config/site";
// import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { LayoutProps } from "@/.next/types/app/page";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

const mono = Inter({
  subsets: ['latin'],
  display: 'optional'
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MiniFyn",
  url: "https://www.minifyn.com",
  description: "Free URL shortener with advanced analytics and custom URLs"
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MiniFyn",
  url: "https://www.minifyn.com",
  logo: "https://www.minifyn.com/logo.png",
  sameAs: [
    "https://x.com/minifyncom",
    "https://www.linkedin.com/company/minifyn",
    "https://www.instagram.com/minifyn",
    "https://www.facebook.com/minifyncom",
    "https://github.com/minifyn"
  ]
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html suppressHydrationWarning className={inter.className + ' ' + mono.className} lang="en">
      <head>
        <GoogleAnalytics />
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
      </head>
      <body
        className="min-h-screen bg-slate-950 antialiased"
      >
        <AnalyticsProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="flex flex-col h-screen text-foreground bg-background">
              <Navbar />
              {children}
            </div>
          </Providers>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
