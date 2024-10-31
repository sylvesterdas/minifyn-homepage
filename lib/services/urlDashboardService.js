import db from '@/lib/db';

export async function deleteUserUrl(userId, shortCode) {
  const result = await db.query(db.sql`
    WITH deleted_url AS (
      DELETE FROM short_urls
      WHERE user_id = ${userId}
      AND short_code = ${shortCode}
      RETURNING short_code
    )
    -- This will cascade delete related analytics due to foreign key constraints
    SELECT 1 FROM deleted_url;
  `);

  return result.rowCount > 0;
}

export async function getUserUrls({ userId, page = 1, limit = 10, search = '' }) {
  const offset = (page - 1) * limit;

  const query = db.sql`
    WITH counted_urls AS (
      SELECT 
        s.short_code, s.original_url, s.title, 
        s.created_at, s.clicks, s.is_active, s.expires_at,
        COUNT(*) OVER() as total_count
      FROM short_urls s
      WHERE s.user_id = ${userId}
        AND (
          LOWER(s.original_url) LIKE ${`%${search.toLowerCase()}%`} 
          OR LOWER(s.title) LIKE ${`%${search.toLowerCase()}%`}
          OR LOWER(s.short_code) LIKE ${`%${search.toLowerCase()}%`}
        )
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    )
    SELECT * FROM counted_urls
  `;

  const result = await db.query(query);
  return {
    urls: result.rows,
    totalPages: Math.ceil((result.rows[0]?.total_count || 0) / limit),
    totalUrls: result.rows[0]?.total_count || 0
  };
}