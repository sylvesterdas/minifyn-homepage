'use strict';

exports.migrate = async (db, opt) => {
  const type = opt.dbm.dataType;
  await db.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      notNull: true,
      defaultValue: {
        raw: 'gen_random_uuid()'
      },
    },
    email: {
      type: type.STRING,
      length: 255,
      notNull: true,
      unique: true,
    },
    password: {
      type: type.STRING,
      length: 255,
      notNull: true
    },
    createdAt: {
      type: 'TIMESTAMP WITH TIME ZONE',
      defaultValue: {
        raw: 'now()'
      },
      notNull: true
    }
  });
};

exports._meta = {
  version: 2
};