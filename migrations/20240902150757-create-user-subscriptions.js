'use strict';

exports.up = async (db, opt) => {
  // Create main table
  await db.createTable('user_subscriptions', {
    id: { type: 'uuid', primaryKey: true, defaultValue: { raw: 'gen_random_uuid()' } },
    user_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'user_subscriptions_user_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    subscription_type_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'user_subscriptions_subscription_type_fk',
        table: 'subscription_types',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    subscription_id: { type: 'string' },     // Razorpay subscription ID
    payment_id: { type: 'string' },          // Razorpay payment ID
    current_period_start: { type: 'timestamp with time zone' },
    current_period_end: { type: 'timestamp with time zone' },
    status: { type: 'string', notNull: true },
    cancelled_at: { type: 'timestamp with time zone' },
    cancel_at_period_end: { type: 'boolean', notNull: true, defaultValue: false },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });

  // Add unique constraint for subscription_id
  await db.addIndex('user_subscriptions', 'subscription_id_unique', ['subscription_id'], true);

  // Add index for status checks
  await db.addIndex('user_subscriptions', 'idx_subscription_status', [
    'status',
    'cancel_at_period_end',
    'current_period_end'
  ]);

  // Add index for user lookups
  await db.addIndex('user_subscriptions', 'idx_user_subscriptions', ['user_id', 'status']);

  // Create view for active subscriptions
  await db.runSql(`
    CREATE VIEW active_subscriptions AS
    SELECT 
      us.*,
      st.name as subscription_type,
      st.display_name as plan_name
    FROM user_subscriptions us
    JOIN subscription_types st ON us.subscription_type_id = st.id
    WHERE 
      us.status = 'active' 
      OR (
        us.status = 'cancelled' 
        AND us.cancel_at_period_end = true 
        AND us.current_period_end > NOW()
      );
  `);
};

exports.down = async function(db) {
  // Drop view first
  await db.runSql('DROP VIEW IF EXISTS active_subscriptions;');

  // Drop indexes
  await db.removeIndex('user_subscriptions', 'idx_user_subscriptions');
  await db.removeIndex('user_subscriptions', 'idx_subscription_status');
  await db.removeIndex('user_subscriptions', 'subscription_id_unique');

  // Drop table
  await db.dropTable('user_subscriptions');
};