'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('analytics', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      defaultValue: { raw: 'gen_random_uuid()' }
    },
    short_url_code: {
      type: 'string',
      length: 10,
      notNull: true,
      foreignKey: {
        name: 'analytics_short_url_fk',
        table: 'short_urls',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'short_code'
      }
    },
    ip_address: {
      type: 'string'
    },
    user_agent: {
      type: 'text'
    },
    referer: {
      type: 'text'
    },
    country: {
      type: 'string',
      length: 2
    },
    city: {
      type: 'string',
      length: 100
    },
    device_type: {
      type: 'string',
      length: 50
    },
    browser: {
      type: 'string',
      length: 50
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      defaultValue: { raw: 'now()' }
    }
  });

  await db.addIndex('analytics', 'idx_analytics_short_url_code', ['short_url_code']);
  await db.addIndex('analytics', 'idx_analytics_created_at', ['created_at']);
};

exports._meta = {
  version: 2
};