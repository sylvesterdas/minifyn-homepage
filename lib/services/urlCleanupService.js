import db from '@/lib/db';

export async function deleteUserUrl(userId, shortCode) {
  // First delete from analytics to maintain referential integrity
  await db.query(db.sql`
    DELETE FROM analytics
    WHERE short_url_code = ${shortCode}
  `);

  // Then delete the URL
  const result = await db.query(db.sql`
    DELETE FROM short_urls
    WHERE user_id = ${userId}
    AND short_code = ${shortCode}
    RETURNING id
  `);

  return result.rowCount > 0;
}