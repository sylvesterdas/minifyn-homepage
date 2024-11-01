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
    subscription_id: { type: 'string' },     // Razorpay subscription ID
    payment_id: { type: 'string' },          // Razorpay payment ID
    current_period_start: { type: 'timestamp with time zone' },
    current_period_end: { type: 'timestamp with time zone' },
    status: { type: 'string', notNull: true },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });

  await db.addIndex('user_subscriptions', 'subscription_id_unique', ['subscription_id'], true);
};

exports._meta = {
  version: 2
};