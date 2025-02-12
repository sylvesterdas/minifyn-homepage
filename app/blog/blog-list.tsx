'use client';

import { Card } from "@heroui/card";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { SearchBar } from './SearchBar';

import { Post, getPosts, searchPosts } from "@/lib/blog";

export default function BlogList({ initialPosts, initialCursor }: {
  initialPosts: Post[],
  initialCursor: string | null
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadMore = useCallback(async () => {
    if (loading || !cursor) return;
    setLoading(true);

    try {
      const result = searchTerm
        ? await searchPosts(searchTerm, cursor)
        : await getPosts(cursor);

      setPosts(prev => [...prev, ...result.posts]);
      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, searchTerm]);

  const handleSearch = useCallback(
    debounce(async (term: string) => {
      setSearchTerm(term);
      setLoading(true);

      try {
        const result = term
          ? await searchPosts(term)
          : await getPosts();

        setPosts(result.posts);
        setCursor(result.nextCursor);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && cursor && !loading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    const sentinel = document.getElementById('infinite-scroll-sentinel');

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect();
  }, [cursor, loading, loadMore]);

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[200px]">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="group relative bg-slate-900/70 border-slate-800/50 backdrop-blur-sm overflow-hidden cursor-pointer">
              <Image
                alt={post.title}
                className="w-full h-min bg-contain bg-center bg-no-repeat rounded-xl mb-4 border-none border-slate-800"
                height={600}
                src={`/blog/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}`}
                width={1200}
              />

              <div className="p-6 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full capitalize">
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-base text-slate-400">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-blue-400">
                    Read Article
                    <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
              </Card>
          </Link>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="text-slate-400">Loading posts...</div>
        </div>
      )}

      <div className="h-px" id="infinite-scroll-sentinel" />
    </div>
  );
}