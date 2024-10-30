import db from '../db';
import { getSubscriptionLimits } from './subscriptionService';
import { APIError } from './errorHandler';

export async function validateBatchOperation(shortCodes, userId, subscriptionType) {
  const limits = await getSubscriptionLimits(subscriptionType);
  if (shortCodes.length > limits.batchSize) {
    throw new APIError(`Batch size exceeds limit of ${limits.batchSize}`, 400, 'BATCH_LIMIT_EXCEEDED');
  }

  const { rows } = await db.query(db.sql`
    SELECT COUNT(*) as count 
    FROM short_urls 
    WHERE short_code = ANY(${shortCodes}) 
    AND user_id = ${userId}
  `);

  if (rows[0].count !== shortCodes.length) {
    throw new APIError('Some URLs not found or unauthorized', 404, 'NOT_FOUND');
  }
}

export async function executeBatchOperation(action, shortCodes, userId) {
  switch (action) {
    case 'delete':
      return db.query(db.sql`
        UPDATE short_urls 
        SET is_active = false 
        WHERE short_code = ANY(${shortCodes})
        AND user_id = ${userId}
      `);

    case 'details':
      const { rows } = await db.query(db.sql`
        SELECT 
          short_code as "shortCode",
          original_url as "originalUrl",
          clicks,
          created_at as "createdAt",
          expires_at as "expiresAt"
        FROM short_urls
        WHERE short_code = ANY(${shortCodes})
        AND user_id = ${userId}
        AND is_active = true
      `);
      return rows.map(row => ({
        ...row,
        shortUrl: `${process.env.BASE_URL}/${row.shortCode}`
      }));

    default:
      throw new APIError('Invalid action', 400, 'INVALID_ACTION');
  }
}