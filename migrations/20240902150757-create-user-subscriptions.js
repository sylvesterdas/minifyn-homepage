'use strict';

exports.migrate = async (db, opt) => {
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
    stripe_subscription_id: { type: 'string' },
    stripe_customer_id: { type: 'string' },
    current_period_start: { type: 'timestamp with time zone' },
    current_period_end: { type: 'timestamp with time zone' },
    status: { type: 'string', notNull: true },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });
};

exports._meta = {
  version: 2
};