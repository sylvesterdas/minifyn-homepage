'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('subscription_types', {
    id: { type: 'uuid', primaryKey: true, defaultValue: { raw: 'gen_random_uuid()' } },
    name: { type: 'string', notNull: true, unique: true },
    display_name: { type: 'string', notNull: true },
    description: { type: 'text' },
    price_monthly: { type: 'decimal', notNull: true },
    price_yearly: { type: 'decimal', notNull: true },
    stripe_monthly_price_id: { type: 'string' },
    stripe_yearly_price_id: { type: 'string' },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });
};

exports._meta = {
  version: 2
};