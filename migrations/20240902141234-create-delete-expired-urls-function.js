'use strict';

exports.up = function(db) {
  return db.runSql(`
    CREATE OR REPLACE FUNCTION delete_expired_short_urls() RETURNS void AS $$
    BEGIN
      DELETE FROM short_urls WHERE expires_at < now();
    END;
    $$ LANGUAGE plpgsql;
  `);
};

exports.down = function(db) {
  return db.runSql(`DROP FUNCTION IF EXISTS delete_expired_short_urls();`);
};