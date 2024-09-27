import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, fullName } = req.body;

  try {
    // Check if user already exists
    const checkUserQuery = db.sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    const { rows } = await db.query(checkUserQuery);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const getDefaultSubscriptionQuery = db.sql`
      SELECT id FROM subscription_types WHERE name = 'free' LIMIT 1
    `;
    const { rows: subscriptionRows } = await db.query(getDefaultSubscriptionQuery);
    if (subscriptionRows.length === 0) {
      throw new Error('Default subscription type not found');
    }
    const defaultSubscriptionTypeId = subscriptionRows[0].id;

    // Create new user
    const insertUserQuery = db.sql`
      INSERT INTO users (email, password_hash, full_name, is_verified, is_admin, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${fullName}, false, false, NOW(), NOW())
      RETURNING id, email
    `;
    const { rows: [newUser] } = await db.query(insertUserQuery);

    // Create user subscription
    const createSubscriptionQuery = db.sql`
      INSERT INTO user_subscriptions (user_id, subscription_type_id, status, current_period_start, current_period_end, created_at, updated_at)
      VALUES (${newUser.id}, ${defaultSubscriptionTypeId}, 'active', NOW(), NOW() + INTERVAL '1 year', NOW(), NOW())
    `;
    await db.query(createSubscriptionQuery);

    // TODO: Send confirmation email

    res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}