'use strict';

exports.up = async function(db) {
  await db.runSql(`
    -- Insert subscription types if not exists
    INSERT INTO subscription_types (id, name, display_name)
    VALUES 
      ('free', 'free', 'Free'),
      ('pro', 'pro', 'Pro')
    ON CONFLICT (name) DO NOTHING;

    -- Insert API call limits
    INSERT INTO subscription_limits (subscription_type_id, limit_type, limit_value)
    VALUES 
      ('free', 'api_monthly_calls', 500),
      ('pro', 'api_monthly_calls', 10000)
    ON CONFLICT (subscription_type_id, limit_type) DO UPDATE 
    SET limit_value = EXCLUDED.limit_value;
  `);
};

exports.down = function(db) {
  return null;
};