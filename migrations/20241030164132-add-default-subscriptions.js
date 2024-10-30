'use strict';

exports.up = async function(db) {
  // First get free subscription type ID
  const freeType = await db.runSql(`
    SELECT id FROM subscription_types WHERE name = 'free' LIMIT 1;
  `);
  
  if (!freeType.rows[0]) return;

  // Add default subscriptions for users who don't have one
  await db.runSql(`
    INSERT INTO user_subscriptions (
      id, 
      user_id, 
      subscription_type_id, 
      status, 
      current_period_start, 
      current_period_end
    )
    SELECT 
      gen_random_uuid(),
      u.id,
      $1,
      'active',
      NOW(),
      NOW() + INTERVAL '1 year'
    FROM users u
    LEFT JOIN user_subscriptions us ON u.id = us.user_id
    WHERE us.id IS NULL;
  `, [freeType.rows[0].id]);
};

exports.down = async function(db) {
  await db.runSql(`
    DELETE FROM user_subscriptions 
    WHERE subscription_id IS NULL;
  `);
};