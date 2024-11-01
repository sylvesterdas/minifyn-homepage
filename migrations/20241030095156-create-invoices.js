'use strict';

exports.migrate = async (db, opt) => {
  await db.createTable('invoices', {
    id: { 
      type: 'uuid', 
      primaryKey: true, 
      defaultValue: { raw: 'gen_random_uuid()' } 
    },
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
    amount: { 
      type: 'decimal', 
      notNull: true 
    },
    currency: { 
      type: 'string', 
      notNull: true,
      defaultValue: 'INR'
    },
    status: { 
      type: 'string', 
      notNull: true,
      defaultValue: 'pending'
    },
    invoice_date: { 
      type: 'timestamp with time zone', 
      notNull: true,
      defaultValue: { raw: 'now()' }
    },
    paid_at: { 
      type: 'timestamp with time zone'
    },
    payment_id: { 
      type: 'string'
    },
    subscription_id: { 
      type: 'string'
    },
    created_at: { 
      type: 'timestamp with time zone', 
      notNull: true, 
      defaultValue: { raw: 'now()' } 
    },
    updated_at: { 
      type: 'timestamp with time zone', 
      notNull: true, 
      defaultValue: { special: 'CURRENT_TIMESTAMP' } 
    }
  });

  await db.addIndex('invoices', 'payment_id_unique', ['payment_id'], true);
};

exports._meta = {
  version: 2
};