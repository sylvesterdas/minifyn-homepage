import { lazy } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Image } from "@heroui/image";
import NextImage from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { notFound } from "next/navigation";
import Head from "next/head";
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm';

import BlogConnect from "./connect";
import { CodeBlock } from "@/components/CodeBlock";
import { getPost } from "@/lib/blog";
import { JsonLd } from "@/app/components/JsonLd";

const ShareBlog = lazy(() => import('./share'));

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const article = await getPost(slug);

  if (!article) return {};
  const ogImage = `https://www.minifyn.com/blog/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent(article.tags.join(","))}`;

  const publishDate = new Date(article.date).toISOString();
  const modifiedDate = article.updatedAt ? new Date(article.updatedAt).toISOString() : publishDate;

  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: article.canonical,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: article.canonical,
      type: "article",
      authors: [article.author.name],
      tags: article.tags,
      siteName: "MiniFyn",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
    other: {
      "article:published_time": publishDate,
      "article:modified_time": modifiedDate,
      "article:author": article.author.name,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
    },
  };
}

const generateArticleSchema = (article) => {
  // Ensure absolute URLs for all links in schema
  const baseUrl = "https://www.minifyn.com";
  const articleUrl = article.canonical;
  const ogImage = `https://www.minifyn.com/blog/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent(article.tags.join(","))}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: ogImage,
    datePublished: new Date(article.date).toISOString(),
    dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date(article.date).toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "MiniFyn",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: article.tags.join(", "),
    articleBody: article.content.markdown,
    wordCount: article.content.markdown.split(/\s+/).length,
    // Add article section if available
    articleSection: article.category || "Blog",
  };
};

// Add breadcrumb schema for better navigation and SEO
const generateBreadcrumbSchema = (article) => {
  const baseUrl = "https://www.minifyn.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${baseUrl}/blog/${article.slug}`
      }
    ]
  };
};

export default async function ArticlePage({ params }) {
  const slug = (await params).slug;
  const article = await getPost(slug);

  if (!article) return notFound();

  const coverImage = `https://www.minifyn.com/blog/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent(article.tags.join(","))}`;

  // Format publish date for display
  const publishDate = new Date(article.date);
  const formattedDate = article.date || publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Head>
        <link key="canonical" href={article.canonical} rel="canonical" />
        <meta name="robots" content="index, follow" />
        <meta property="article:published_time" content={new Date(article.date).toISOString()} />
        {article.updatedAt && (
          <meta property="article:modified_time" content={new Date(article.updatedAt).toISOString()} />
        )}
      </Head>

      <JsonLd data={generateArticleSchema(article)} />
      <JsonLd data={generateBreadcrumbSchema(article)} />

      <div className="min-h-screen bg-slate-950">
        <a
          href="#article-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
        >
          Skip to content
        </a>

        <div className="max-w-4xl mx-auto px-4 py-12 aspect-video">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              className="inline-flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1"
              href="/blog"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Back to Blog</span>
            </Link>
          </nav>

          <article id="article-content" itemScope itemType="https://schema.org/BlogPosting">
            <meta itemProp="datePublished" content={new Date(article.date).toISOString()} />
            {article.updatedAt && (
              <meta itemProp="dateModified" content={new Date(article.updatedAt).toISOString()} />
            )}
            <meta itemProp="author" content={article.author.name} />

            <div className="mb-12 aspect-[1200/630]">
              <Image
                alt={`Cover image for article: ${article.title}`}
                as={NextImage}
                disableSkeleton={false}
                height={0}
                isBlurred={false}
                quality={100}
                shadow="sm"
                src={coverImage}
                width={1200}
                itemProp="image"
                loading="eager"
                priority={true}
              />
            </div>

            <div className="mx-auto">
              <header className="mb-12">
                <div className="flex flex-wrap justify-center gap-2 mb-6" aria-label="Article tags">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center min-w-max px-3 py-1 text-xs font-medium bg-slate-900 text-slate-300 rounded-full border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl font-bold text-white mb-8" itemProp="headline">
                  {article.title}
                </h1>

                <div className="flex items-center justify-between py-4 border-t border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200" aria-hidden="true">
                      {article.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200" itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span itemProp="name">{article.author.name}</span>
                      </div>
                      {/* <div className="text-sm text-slate-400">{article.author.role}</div> */}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      <time dateTime={new Date(article.date).toISOString()} itemProp="datePublished">
                        {formattedDate}
                      </time>
                    </div>
                    <div className="flex items-center gap-2" aria-label="Estimated reading time">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </header>

              <main className="prose prose-invert max-w-none max-xl:mx-4 mb-12" itemProp="articleBody">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => (
                      <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2
                        className="text-2xl font-bold mt-8 mb-4 text-white"
                        {...props}
                        id={children?.toString().toLowerCase().replace(/\s+/g, '-')}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3
                        className="text-xl font-bold mt-6 mb-3 text-white"
                        {...props}
                        id={children?.toString().toLowerCase().replace(/\s+/g, '-')}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children, ...props }) => (
                      <p
                        className="mb-4 text-slate-300 leading-relaxed"
                        {...props}
                      >
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul
                        className="my-4 space-y-2 list-disc list-outside pl-5"
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol
                        className="my-4 space-y-2 list-decimal list-outside pl-5"
                        {...props}
                      >
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-slate-300 pl-1" {...props}>
                        {children}
                      </li>
                    ),
                    code: ({ children, className, ...props }) => {
                      if (className) {
                        return <CodeBlock>{children}</CodeBlock>;
                      }

                      return (
                        <code
                          className="bg-slate-700 px-1.5 py-0.5 rounded text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    a: ({ children, href, ...props }) => (
                      <a
                        className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline relative hover:opacity-90 transition-all delay-200 duration-500"
                        href={href}
                        {...props}
                        rel={(() => {
                          try {
                            const url = new URL(href);
                            const allowedHosts = ['minifyn.com', 'www.minifyn.com'];
                            return url.host && !allowedHosts.includes(url.host) ? "noopener noreferrer" : undefined;
                          } catch {
                            return undefined;
                          }
                        })()}
                        target={(() => {
                          try {
                            const url = new URL(href);
                            const allowedHosts = ['minifyn.com', 'www.minifyn.com'];
                            return url.host && !allowedHosts.includes(url.host) ? "_blank" : undefined;
                          } catch {
                            return undefined;
                          }
                        })()}
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt, ...props }) => (
                      <span  className="my-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="p-4 shadow-inner border-slate-700 rounded-lg w-full h-auto"
                          src={src}
                          alt={alt || "Article image"}
                          loading="lazy"
                          {...props}
                        />
                        {alt && alt.includes(':caption:') && (
                          <figcaption className="text-center text-sm text-slate-400 mt-2">
                            {alt.split(':caption:')[1].trim()}
                          </figcaption>
                        )}
                      </span>
                    ),
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto my-6" role="region" aria-label="Table">
                        <table className="min-w-full bg-slate-800 rounded-lg overflow-hidden" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children, ...props }) => (
                      <thead className="bg-slate-700" {...props}>
                        {children}
                      </thead>
                    ),
                    tbody: ({ children, ...props }) => (
                      <tbody className="divide-y divide-slate-600" {...props}>
                        {children}
                      </tbody>
                    ),
                    tr: ({ children, ...props }) => (
                      <tr className="hover:bg-slate-700 transition-colors" {...props}>
                        {children}
                      </tr>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider" scope="col" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="px-6 py-4 whitespace-nowrap text-slate-300" {...props}>
                        {children}
                      </td>
                    ),
                    hr: ({ ...props }) => (
                      <hr className="my-8 border-slate-700" {...props} />
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="pl-4 border-l-4 border-blue-500 italic text-slate-300 my-6"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    )
                  }}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                >
                  {article.content.markdown?.replace(
                    /!\[(.*?)\]\((.*?)(?:\s+[^)]*?)?\)/g,
                    (_, alt, src) => `![${alt}](${src})`
                  )}
                </ReactMarkdown>
              </main>
            </div>
          </article>

          <footer className="py-6 border-y border-slate-800">
            <div aria-label="Share this article">
              <ShareBlog post={article} />
            </div>
          </footer>

          <aside aria-label="Connect with us" className="mt-12">
            <BlogConnect />
          </aside>
        </div>
      </div>
    </>
  );
}