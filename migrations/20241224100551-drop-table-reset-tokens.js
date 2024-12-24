'use strict';

exports.migrate = async (db, opt) => {
  const type = opt.dbm.dataType;
  return db.dropTable('reset_tokens');
};

exports._meta = {
  version: 2
};