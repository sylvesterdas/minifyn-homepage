'use client';

import BlogList from "./blog-list";

import { Post } from "@/lib/blog";

export default function BlogContent({ posts, nextCursor }: { posts: Post[], nextCursor: string | null }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Built for developers. Simple for everyone.
            </p>
          </div>
          <BlogList initialCursor={nextCursor} initialPosts={posts} />
        </div>
      </div>
    </div>
  );
}