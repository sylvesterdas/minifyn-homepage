import { addBlogSlug } from '@/lib/blog'

export async function POST(req: Request) {
  const body = await req.json()

  if (body.type === 'post.publish') {
    addBlogSlug(body.data.post.slug)
  }

  return new Response('OK')
}