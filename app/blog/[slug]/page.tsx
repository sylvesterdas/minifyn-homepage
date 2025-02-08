import { Metadata } from 'next';
import { Calendar, Clock, Share2, Bookmark, ArrowLeft, Facebook, Linkedin, Send } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/github-dark.css';
import { CopyButton } from '@/components/CopyButton';
import { CodeBlock } from '@/components/CodeBlock';

async function getArticle(slug: string) {
  return {
    title: "Optimizing JavaScript Bundle Size",
    excerpt: "Learn effective techniques to reduce your JavaScript bundle size and improve loading performance",
    author: {
      name: "Sylvester Das",
      role: "Senior Engineer",
      avatar: "/api/placeholder/40/40"
    },
    date: "Feb 8, 2024",
    readTime: "5 min",
    tags: ["Performance", "JavaScript"],
    content: "Performance is crucial for modern web applications. Let's explore effective techniques to reduce your JavaScript bundle size.\n\n## Why Bundle Size Matters\n\nWhen users visit your website, their browsers need to download, parse, and execute all JavaScript code before the site becomes fully interactive. Larger bundles mean:\n\n- Longer download times, especially on slower connections\n- More processing overhead for the browser\n- Higher memory usage\n- Reduced mobile performance\n\n## Code Splitting Techniques\n\nCode splitting is one of the most effective ways to reduce initial bundle size. Here's how you can implement it:\n\n```javascript\n// Instead of importing everything at once\nconst Dashboard = React.lazy(() => import('./Dashboard'))\nconst Settings = React.lazy(() => import('./Settings'))\n\n// Wrap with Suspense\n<Suspense fallback={<LoadingSpinner />}>\n  <Dashboard />\n</Suspense>\n```\n\n## Tree Shaking\n\nModern bundlers can automatically remove unused code through a process called tree shaking. To enable effective tree shaking:\n\n1. Use ES modules (import/export)\n2. Enable production mode in your bundler\n3. Avoid side effects in modules\n\n## Measuring Impact\n\nAlways measure the impact of your optimizations:\n\n```javascript\n// Before optimization: 1.2MB\n// After code splitting: 400KB initial, 800KB lazy loaded\n// After tree shaking: 300KB initial, 600KB lazy loaded\n```\n\nRemember to test on real devices and slower network connections to ensure a good user experience for all your users."
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getArticle(slug);
  
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      authors: [article.author.name],
      tags: article.tags
    }
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'optimizing-javascript-bundle-size' },
    { slug: 'understanding-web-vitals' }
  ];
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;
  const article = await getArticle(slug);
  const coverImage = `/blog/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent(article.tags.join(','))}&time=${new Date().getTime()}`;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12 aspect-video">
        <div className="mb-8">
          <a className="inline-flex items-center text-slate-400 hover:text-white transition-colors" href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </a>
        </div>

        <article>
          <Image
            alt={article.title}
            className="w-full h-min bg-contain bg-center bg-no-repeat rounded-xl mb-12 border-none border-slate-800"
            height={600}
            src={coverImage}
            width={1200}
          />

          <div className="max-w-3xl mx-auto">
            <header className="mb-12">
              <div className="flex gap-2 mb-6">
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium bg-slate-900 text-slate-300 rounded-full border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-white mb-8">{article.title}</h1>

              <div className="flex items-center justify-between py-4 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-slate-200">{article.author.name}</div>
                  <div className="text-sm text-slate-400">{article.author.role}</div>
                </div>
              </div>

                <div className="flex items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            </header>

            <main className="prose prose-invert max-w-none mb-12">
              <ReactMarkdown
                components={{
                  h1: ({children, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>{children}</h1>,
                  h2: ({children, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white" {...props} >{children}</h2>,
                  p: ({children, ...props}) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} >{children}</p>,
                  ul: ({children, ...props}) => <ul className="my-4 space-y-2 list-disc list-inside" {...props} >{children}</ul>,
                  li: ({children, ...props}) => <li className="text-slate-300" {...props} >{children}</li>,
                  code: ({children, className, ...props}) => {
                    if (className) {
                      return <CodeBlock>{children}</CodeBlock>;
                    }

                    return <code className="bg-slate-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
                  },
                }}
                rehypePlugins={[rehypeHighlight]}
              >
                {article.content}
              </ReactMarkdown>
            </main>

            <footer className="pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="p-2 text-slate-400">
                    <Bookmark className="w-5 h-5" />
                  </span>
                  <span className="p-2 text-slate-400">
                    <Share2 className="w-5 h-5" />
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="p-2 text-slate-400">
                    <FaXTwitter className="w-5 h-5" />
                  </span>
                  <span className="p-2 text-slate-400">
                    <Share2 className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </footer>

            <div className="py-8 mt-8 border-t border-slate-800">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white">Connect with MiniFyn</h3>
                <p className="text-sm text-slate-400 mt-1">Join our community for updates and discussions</p>
              </div>
              <div className="flex justify-center gap-8">
                <a href="https://x.com/minifyn" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <FaXTwitter className="w-5 h-5" />
                  <span>X (Twitter)</span>
                </a>
                <a href="https://facebook.com/minifyn" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                  <span>Facebook</span>
                </a>
                <a href="https://linkedin.com/company/minifyn" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
                <a href="https://t.me/minifyn" target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}