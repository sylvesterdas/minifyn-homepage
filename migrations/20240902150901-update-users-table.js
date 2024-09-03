'use strict';

exports.migrate = async (db, opt) => {
  await db.addColumn('users', 'stripe_customer_id', { type: 'string' });
  await db.addColumn('users', 'updated_at', { 
    type: 'timestamp with time zone', 
    notNull: true, 
    defaultValue: { special: 'CURRENT_TIMESTAMP' } 
  });
};

exports._meta = {
  version: 2
};