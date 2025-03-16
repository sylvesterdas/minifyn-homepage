import "@/styles/globals.css";
import { Inter } from "next/font/google";

import { JsonLd } from "./components/JsonLd";
import { ClientProviders } from "./client-providers";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
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

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning className={inter.className} lang="en">
      <head>
        <GoogleAnalytics />
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
      </head>
      <body
        className="min-h-screen bg-slate-950 antialiased"
      >
        <ClientProviders>
          <div className="flex flex-col h-screen text-foreground bg-background">
            <Navbar />
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
