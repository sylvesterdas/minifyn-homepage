import { Sidebar } from "@/components/sidebar";
import { Shortener } from "@/components/shortner";

const keywords = 'url shortener, link management, analytics, url minification, custom urls';
const ogImage = `https://www.minifyn.com/images/og.png`;

export const metadata = {
  title: 'MiniFyn - Simple & Secure URL Shortener',
  description: 'Free URL shortener with advanced analytics, custom URLs, and secure link management. Built for developers, simple for everyone.',
  keywords,
  openGraph: {
    type: 'website',
    url: 'https://www.minifyn.com',
    siteName: 'MiniFyn',
    title: 'MiniFyn - Simple & Secure URL Shortener',
    description: 'Free URL shortener with advanced analytics, custom URLs, and secure link management. Built for developers, simple for everyone.',
    locale: 'en_US',
    images: [{
      url: ogImage,
      width: 1200,
      height: 630,
      alt: 'MiniFyn - URL Shortener'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiniFyn - Simple & Secure URL Shortener',
    description: 'Free URL shortener with advanced analytics, custom URLs, and secure link management.',
    images: [ogImage]
  },
  authors: [{ name: 'Sylvester Das' }],
  metadataBase: new URL('https://www.minifyn.com'),
  alternates: {
    canonical: 'https://www.minifyn.com'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large'
    }
  }
}

export default function Home() {
  return (
    <div className="flex max-md:flex-col-reverse flex-1">
      <Sidebar className="max-md:w-full max-md:text-start" onPress={undefined} />
      <main className="w-full">
        <div className="max-w-4xl mx-auto p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl max-sm:text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Professional URL Shortener
              </h1>
              <p className="mt-2 text-lg max-sm:text-xs text-slate-400">
                Built for developers. Simple for everyone.
              </p>
            </div>

            <Shortener />

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { title: "Enterprise Ready", desc: "99.9% Uptime SLA" },
                { title: "Developer First", desc: "RESTful API & SDKs" },
                { title: "Privacy Focused", desc: "EU/US Compliant" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-lg bg-slate-900/30 border border-slate-800/50"
                >
                  <h3 className="font-medium max-sm:text-xs max-sm:text-center text-slate-200">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm max-sm:text-xs max-sm:text-center text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
