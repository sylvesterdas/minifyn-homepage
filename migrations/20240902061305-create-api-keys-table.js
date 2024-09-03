'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('api_keys', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      defaultValue: { raw: 'gen_random_uuid()' }
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'api_keys_user_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    key: {
      type: 'string',
      notNull: true,
      unique: true
    },
    name: {
      type: 'string',
      notNull: true
    },
    is_active: {
      type: 'boolean',
      defaultValue: true
    },
    last_used_at: {
      type: 'timestamp with time zone'
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      defaultValue: { raw: 'now()' }
    }
  });

  await db.addIndex('api_keys', 'idx_api_keys_user_id', ['user_id']);
};

exports._meta = {
  version: 2
};