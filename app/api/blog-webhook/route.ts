import { addBlogSlug, fetchBlogSitemapData } from '@/lib/blog'

export async function POST(req: Request) {
  const body = await req.json()

  if (body.data.eventType === 'post_published') {
    const blog = await fetchBlogSitemapData(body.data.post.id)

    addBlogSlug(blog)
  }

  return new Response('OK')
}

