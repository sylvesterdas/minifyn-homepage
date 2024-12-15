import { getFilteredPosts } from '@/lib/blog';

export default async function handler(req, res) {
  const { search, tag, page = 1 } = req.query;
  
  try {
    const result = await getFilteredPosts({
      search,
      tag,
      page: parseInt(page),
      limit: 12
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}