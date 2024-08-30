'use strict';

exports.migrate = async (db, opt) => {
  const type = opt.dbm.dataType;
  await db.createTable('reset_tokens', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      defaultValue: {
        raw: 'gen_random_uuid()'
      },
    },
    token: {
      type: 'string',
      length: 255,
      notNull: true,
      unique: true
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'user_reset_tokens_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    expiry: {
      type: 'timestamp with time zone',
      notNull: true
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      defaultValue: new String('now()')
    }
  });
};

exports._meta = {
  version: 2
};