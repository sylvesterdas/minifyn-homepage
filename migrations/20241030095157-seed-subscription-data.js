'use strict';

exports.up = async function(db) {
  const freeTypeId = await db.runSql(`
    INSERT INTO subscription_types (name, display_name, description, price_monthly, price_yearly)
    VALUES ('free', 'LinkFree', 'Free account with basic features', 0, 0)
    RETURNING id;
  `);

  const proTypeId = await db.runSql(`
    INSERT INTO subscription_types (name, display_name, description, price_monthly, price_yearly)
    VALUES ('pro', 'LinkPro', 'Pro account with advanced features', 99, 999)
    RETURNING id;
  `);

  const features = [
    { name: 'api_access', description: 'API endpoint access' },
    { name: 'basic_analytics', description: 'Basic link analytics' },
    { name: 'detailed_analytics', description: 'Advanced analytics with detailed insights' },
    { name: 'bulk_operations', description: 'Bulk URL operations support' },
    { name: 'personal_dashboard', description: 'Personal dashboard access' },
    { name: 'custom_alias', description: 'Custom URL aliases' }
  ];

  for (const feature of features) {
    await db.runSql(`
      INSERT INTO features (name, description)
      VALUES ($1, $2);
    `, [feature.name, feature.description]);
  }

  const freeFeatures = ['api_access', 'basic_analytics', 'personal_dashboard'];
  for (const feature of freeFeatures) {
    await db.runSql(`
      INSERT INTO subscription_features (subscription_type_id, feature_id, value)
      SELECT $1, id, 'true' FROM features WHERE name = $2;
    `, [freeTypeId.rows[0].id, feature]);
  }

  const proFeatures = ['api_access', 'detailed_analytics', 'bulk_operations', 'personal_dashboard', 'custom_alias'];
  for (const feature of proFeatures) {
    await db.runSql(`
      INSERT INTO subscription_features (subscription_type_id, feature_id, value)
      SELECT $1, id, 'true' FROM features WHERE name = $2;
    `, [proTypeId.rows[0].id, feature]);
  }

  const freeLimits = [
    { type: 'urls_per_day', value: 10 },
    { type: 'link_validity_days', value: 60 },
    { type: 'api_calls_per_month', value: 500 }
  ];

  for (const limit of freeLimits) {
    await db.runSql(`
      INSERT INTO subscription_limits (subscription_type_id, limit_type, limit_value)
      VALUES ($1, $2, $3);
    `, [freeTypeId.rows[0].id, limit.type, limit.value]);
  }

  const proLimits = [
    { type: 'urls_per_day', value: 50 },
    { type: 'link_validity_days', value: 365 },
    { type: 'api_calls_per_month', value: 10000 }
  ];

  for (const limit of proLimits) {
    await db.runSql(`
      INSERT INTO subscription_limits (subscription_type_id, limit_type, limit_value)
      VALUES ($1, $2, $3);
    `, [proTypeId.rows[0].id, limit.type, limit.value]);
  }
};

exports.down = async function(db) {
  await db.runSql(`
    DELETE FROM subscription_limits;
    DELETE FROM subscription_features;
    DELETE FROM features;
    DELETE FROM subscription_types;
  `);
};