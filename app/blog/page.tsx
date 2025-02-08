import type { Metadata } from 'next'

import { getPosts } from './get-posts'
import { PostCard } from './post-card'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts()
  const latestPost = posts[0]

  return {
    title: 'MiniFyn Blog - Web Performance & Development Tips',
    description: 'Learn about web performance, JavaScript optimization, and modern development techniques.',
    openGraph: {
      title: 'MiniFyn Blog',
      description: latestPost?.excerpt || 'Web development insights and tips',
      images: [{
        url: `/blog/og?title=${encodeURIComponent(latestPost?.title || '')}&tags=${encodeURIComponent(latestPost?.tags.join(',') || '')}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
    }
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

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

          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
