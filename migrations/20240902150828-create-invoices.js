'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('invoices', {
    id: { type: 'uuid', primaryKey: true, defaultValue: { raw: 'gen_random_uuid()' } },
    user_id: { 
      type: 'uuid', 
      notNull: true,
      foreignKey: {
        name: 'invoices_user_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    stripe_invoice_id: { type: 'string', notNull: true },
    amount: { type: 'decimal', notNull: true },
    currency: { type: 'string', notNull: true },
    status: { type: 'string', notNull: true },
    invoice_date: { type: 'timestamp with time zone', notNull: true },
    due_date: { type: 'timestamp with time zone' },
    paid_at: { type: 'timestamp with time zone' },
    created_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { raw: 'now()' } },
    updated_at: { type: 'timestamp with time zone', notNull: true, defaultValue: { special: 'CURRENT_TIMESTAMP' } }
  });
};

exports._meta = {
  version: 2
};