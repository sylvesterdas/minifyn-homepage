import db from './db';

export async function getUserSubscription(userId) {
  let subscriptionTypeId = null;

  if (userId) {
    // User is logged in, fetch their subscription type
    const { rows } = await db.query(db.sql`
      SELECT st.id, sl.limit_type, sl.limit_value
      FROM user_subscriptions us
      JOIN subscription_types st ON us.subscription_type_id = st.id
      JOIN subscription_limits sl ON st.id = sl.subscription_type_id
      WHERE us.user_id = ${userId} AND us.status = 'active'
      ORDER BY us.created_at DESC
    `);
    if (rows.length > 0) {
      subscriptionTypeId = rows[0].id;
      const hourlyLimit = rows.find(r => r.limit_type === 'urls_per_hour')?.limit_value || 5;
      const dailyLimit = rows.find(r => r.limit_type === 'urls_per_day')?.limit_value || 30;
      return { userId, subscriptionTypeId, hourlyLimit, dailyLimit };
    }
  }

  // If no active subscription found or user is not logged in, use the 'free' subscription
  const { rows } = await db.query(db.sql`
    SELECT st.id, sl.limit_type, sl.limit_value
    FROM subscription_types st
    JOIN subscription_limits sl ON st.id = sl.subscription_type_id
    WHERE st.name = 'free'
  `);
  if (rows.length === 0) {
    throw new Error('Free subscription type not found');
  }
  subscriptionTypeId = rows[0].id;
  const hourlyLimit = rows.find(r => r.limit_type === 'urls_per_hour')?.limit_value || 5;
  const dailyLimit = rows.find(r => r.limit_type === 'urls_per_day')?.limit_value || 30;
  return { subscriptionTypeId, hourlyLimit, dailyLimit };
}