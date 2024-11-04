import db from '../db';
import { APIError } from './errorHandler';

export async function validateApiKeyPermissions(apiKey, requiredPermissions = []) {
  const { rows } = await db.query(db.sql`
    WITH user_features AS (
      SELECT DISTINCT f.name
      FROM api_keys ak
      JOIN active_subscriptions us ON ak.user_id = us.user_id
      JOIN subscription_features sf ON us.subscription_type_id = sf.subscription_type_id
      JOIN features f ON sf.feature_id = f.id
      WHERE ak.key = ${apiKey}
      AND ak.is_active = true
    )
    SELECT array_agg(name) as features
    FROM user_features
  `);

  const userFeatures = rows[0]?.features || [];
  const missingPermissions = requiredPermissions.filter(p => !userFeatures.includes(p));

  if (missingPermissions.length > 0) {
    throw new APIError(
      `Missing required permissions: ${missingPermissions.join(', ')}`,
      403,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}