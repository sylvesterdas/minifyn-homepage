import BlogContent from './blog-content';

import { getPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function BlogPage() {
  const { posts, nextCursor } = await getPosts();

  return <BlogContent nextCursor={nextCursor} posts={posts} />
}
