'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      defaultValue: { raw: 'gen_random_uuid()' }
    },
    email: {
      type: 'string',
      notNull: true,
      unique: true
    },
    password_hash: {
      type: 'string',
      notNull: true
    },
    full_name: {
      type: 'string'
    },
    is_verified: {
      type: 'boolean',
      defaultValue: false
    },
    is_admin: {
      type: 'boolean',
      defaultValue: false
    },
    subscription_type_id: {
      type: 'uuid',
      foreignKey: {
        name: 'users_subscription_type_fk',
        table: 'subscription_types',
        rules: {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      defaultValue: { raw: 'now()' }
    },
    updatedAt: {
      type: 'timestamp with time zone',
      notNull: true,
      defaultValue: {
        special: 'CURRENT_TIMESTAMP'
      }
    }
  });
};

exports._meta = {
  version: 2
};