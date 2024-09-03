'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('subscription_features', {
    id: { type: 'uuid', primaryKey: true, defaultValue: { raw: 'gen_random_uuid()' } },
    subscription_type_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'subscription_features_subscription_type_fk',
        table: 'subscription_types',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    feature_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'subscription_features_feature_fk',
        table: 'features',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    value: { type: 'string', notNull: true },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });
};

exports._meta = {
  version: 2
};