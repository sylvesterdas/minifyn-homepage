import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Send } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Image } from "@heroui/image";
import NextImage from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { notFound } from "next/navigation";
import Head from "next/head";
import rehypeRaw from "rehype-raw";

import ShareBlog from "./share";

import { CodeBlock } from "@/components/CodeBlock";
import { getPost } from "@/lib/blog";
import { PageProps } from "@/.next/types/app/blog/page";
import { JsonLd } from "@/app/components/JsonLd";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const article = await getPost(slug);

  if (!article) return {};
  const ogImage = `/blog/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent(article.tags.join(","))}}`;

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
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
    other: {
      "article:published_time": article.publishedAt,
      "article:author": article.author.name,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
    },
  };
}

const generateArticleSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: article.title,
  description: article.excerpt,
  image: `/api/og/blog/${article.slug}`,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  author: {
    "@type": "Person",
    name: article.author.name,
  },
  publisher: {
    "@type": "Organization",
    name: "MiniFyn",
    logo: {
      "@type": "ImageObject",
      url: "https://www.minifyn.com/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://www.minifyn.com/blog/${article.slug}`,
  },
  keywords: article.tags.join(", "),
  articleBody: article.content.markdown,
  wordCount: article.content.markdown.split(/\s+/).length,
});

export default async function ArticlePage({ params }: PageProps) {
  const slug = (await params).slug;
  const article = await getPost(slug);

  if (!article) return notFound();

  const coverImage = `/blog/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent(article.tags.join(","))}}`;

  return (
    <>
      <Head>
        <link key="canonical" href={article.canonical} rel="canonical" />
      </Head>
      <JsonLd data={generateArticleSchema(article)} />
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-12 aspect-video">
          <div className="mb-8">
            <Link
              className="inline-flex items-center text-slate-400 hover:text-white transition-colors"
              href="/blog"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>

          <article>
            <div className="mb-12 aspect-[1200/630]">
              <Image
                alt={article.title}
                as={NextImage}
                disableSkeleton={false}
                height={0}
                isBlurred={true}
                quality={100}
                shadow="sm"
                src={coverImage}
                width={1200}
              />
            </div>

            <div className="max-w-3xl mx-auto">
              <header className="mb-12">
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center min-w-max px-3 py-1 text-xs font-medium bg-slate-900 text-slate-300 rounded-full border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl font-bold text-white mb-8">
                  {article.title}
                </h1>

                <div className="flex items-center justify-between py-4 border-t border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200">
                      {article.author.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">
                        {article.author.name}
                      </div>
                      {/* <div className="text-sm text-slate-400">{article.author.role}</div> */}
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

              <main className="prose prose-invert max-w-none max-xl:mx-4 mb-12">
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
                      >
                        {children}
                      </h2>
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
                        className="my-4 space-y-2 list-disc list-outside"
                        {...props}
                      >
                        {children}
                      </ul>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-slate-300" {...props}>
                        {children}
                      </li>
                    ),
                    code: ({ children, className, ...props }) => {
                      if (className) {
                        return <CodeBlock>{children}</CodeBlock>;
                      }

                      return (
                        <code
                          className="bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    a: ({ children, ...props }) => (
                      <a
                        className="text-blue-500 hover:text-blue-700 relative hover:opacity-90 transition-all delay-200 duration-500"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    img: ({ ...props }) => (
                      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                      <img
                        className="border shadow-inner border-slate-700"
                        {...props}
                      />
                    ),
                  }}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                >
                  {article.content.markdown?.replace(
                    /!\[(.*?)\]\((.*?)(?:\s+[^)]*?)?\)/g,
                    "![$1]($2)"
                  )}
                </ReactMarkdown>
              </main>

              <footer className="pt-6 border-t border-slate-800">
                <ShareBlog post={article} />
              </footer>

              <div className="py-8 mt-8 border-t border-slate-800">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Connect with MiniFyn
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Join our community for updates and discussions
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-8">
                  <a
                    className="flex max-md:flex-col justify-center items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    href="https://x.com/minifyncom"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FaXTwitter className="w-5 h-5" />
                    <span>X (formerly Twitter)</span>
                  </a>
                  <a
                    className="flex max-md:flex-col justify-center items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    href="https://facebook.com/minifyncom"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FaFacebookF className="w-5 h-5" />
                    <span>Facebook</span>
                  </a>
                  <a
                    className="flex max-md:flex-col justify-center items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    href="https://linkedin.com/company/minifyn"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FaLinkedinIn className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    className="flex max-md:flex-col justify-center items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    href="https://t.me/minifyn"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Send className="w-5 h-5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
