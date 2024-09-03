// 20230904000008-seed-subscription-data.js
'use strict';

exports.up = async function(db) {
  const freeTypeId = await db.runSql(`
    INSERT INTO subscription_types (name, display_name, description, price_monthly, price_yearly)
    VALUES ('free', 'LinkFree User', 'Free account with basic features', 0, 0)
    RETURNING id;
  `);

  const proTypeId = await db.runSql(`
    INSERT INTO subscription_types (name, display_name, description, price_monthly, price_yearly)
    VALUES ('pro', 'LinkPro User', 'Pro account with advanced features', 499, 4999)
    RETURNING id;
  `);

  const features = [
    'Personal dashboard',
    'Basic link analytics',
    'Limited API access',
    'Advanced link analytics',
    'Custom link aliases',
    'Bulk URL shortening',
    'Full API access'
  ];

  for (const feature of features) {
    await db.runSql(`
      INSERT INTO features (name, description)
      VALUES ($1, '${feature}');
    `, [feature]);
  }

  const freeFeatures = ['Personal dashboard', 'Basic link analytics', 'Limited API access'];
  for (const feature of freeFeatures) {
    await db.runSql(`
      INSERT INTO subscription_features (subscription_type_id, feature_id, value)
      SELECT $1, id, 'true' FROM features WHERE name = $2;
    `, [freeTypeId.rows[0].id, feature]);
  }

  const proFeatures = ['Personal dashboard', 'Advanced link analytics', 'Custom link aliases', 'Bulk URL shortening', 'Full API access'];
  for (const feature of proFeatures) {
    await db.runSql(`
      INSERT INTO subscription_features (subscription_type_id, feature_id, value)
      SELECT $1, id, 'true' FROM features WHERE name = $2;
    `, [proTypeId.rows[0].id, feature]);
  }

  const freeLimits = [
    { type: 'urls_per_hour', value: 10 },
    { type: 'urls_per_day', value: 50 },
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
    { type: 'urls_per_hour', value: 50 },
    { type: 'urls_per_day', value: 250 },
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