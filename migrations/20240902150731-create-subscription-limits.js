'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('subscription_limits', {
    id: { type: 'uuid', primaryKey: true, defaultValue: { raw: 'gen_random_uuid()' } },
    subscription_type_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'subscription_limits_subscription_type_fk',
        table: 'subscription_types',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    limit_type: { type: 'string', notNull: true },
    limit_value: { type: 'integer', notNull: true },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });
};

exports._meta = {
  version: 2
};