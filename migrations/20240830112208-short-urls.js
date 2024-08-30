'use strict';

exports.migrate = async (db, opt) => {
  const type = opt.dbm.dataType;
  await db.createTable('short_urls', {
    short_code: { type: 'string', length: 8, primaryKey: true, notNull: true },
    original_url: { type: 'text', notNull: true },
    clicks: { type: 'int', notNull: true, defaultValue: '0' },
    expires_at: { type: 'timestamp', notNull: true },
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