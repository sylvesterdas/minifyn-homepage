'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('short_urls', {
    short_code: {
      type: 'string',
      length: 8,
      primaryKey: true,
      notNull: true
    },
    original_url: {
      type: 'text',
      notNull: true
    },
    user_id: {
      type: 'uuid',
      foreignKey: {
        name: 'short_urls_user_fk',
        table: 'users',
        rules: {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    subscription_type_id: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'short_urls_subscription_type_fk',
        table: 'subscription_types',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    title: {
      type: 'string'
    },
    description: {
      type: 'text'
    },
    is_custom: {
      type: 'boolean',
      defaultValue: false
    },
    is_active: {
      type: 'boolean',
      defaultValue: true
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      defaultValue: { raw: 'now()' }
    },
    expires_at: {
      type: 'timestamp with time zone'
    },
    last_accessed_at: {
      type: 'timestamp with time zone'
    },
    clicks: {
      type: 'int',
      notNull: true,
      defaultValue: 0
    }
  });

  await db.addIndex('short_urls', 'idx_short_urls_user_id', ['user_id']);
  await db.addIndex('short_urls', 'idx_short_urls_subscription_type_id', ['subscription_type_id']);
};

exports._meta = {
  version: 2
};