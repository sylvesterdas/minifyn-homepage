'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('features', {
    id: { type: 'uuid', primaryKey: true, defaultValue: { raw: 'gen_random_uuid()' } },
    name: { type: 'string', notNull: true, unique: true },
    description: { type: 'text' },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });
};

exports._meta = {
  version: 2
};