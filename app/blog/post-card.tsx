import type { Post } from "@/app/blog/get-posts"

import { Calendar, Clock, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@heroui/card"


export function PostCard({ post }: { post: Post }) {
  const ogUrl = `/blog/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}&time=${new Date().getTime()}`

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group relative bg-slate-900/70 border-slate-800/50 backdrop-blur-sm overflow-hidden">
        <Image
          alt={post.title}
          className="w-full h-48 object-cover"
          height={630}
          quality={100}
          src={ogUrl}
          width={1200}
        />
        <div className="p-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span key={tag} className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
              {post.title}
            </h2>
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
  )
}