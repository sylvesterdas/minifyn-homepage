import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateName, AuthError, createAuthResponse } from '@/lib/authUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, fullName, plan = 'free' } = req.body;

  try {
    // Validate inputs
    const emailError = validateEmail(email);
    if (emailError) throw new AuthError(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) throw new AuthError(passwordError);

    const nameError = validateName(fullName);
    if (nameError) throw new AuthError(nameError);

    // Start transaction
    await db.query(db.sql`BEGIN`);

    try {
      // Check if user exists
      const { rows: existingUsers } = await db.query(db.sql`
        SELECT id FROM users WHERE email = ${email.toLowerCase()}
      `);

      if (existingUsers.length > 0) {
        throw new AuthError('Email already registered');
      }

      // Get subscription type
      const { rows: subscriptionTypes } = await db.query(db.sql`
        SELECT id FROM subscription_types WHERE name = ${plan} LIMIT 1
      `);

      if (subscriptionTypes.length === 0) {
        throw new AuthError('Invalid subscription plan', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const { rows: [newUser] } = await db.query(db.sql`
        INSERT INTO users (
          email,
          password_hash,
          full_name,
          is_verified,
          is_admin,
          created_at,
          "updatedAt"
        )
        VALUES (
          ${email.toLowerCase()},
          ${hashedPassword},
          ${fullName.trim()},
          false,
          false,
          NOW(),
          NOW()
        )
        RETURNING id, email, full_name, is_verified, is_admin
      `);

      // Create subscription
      await db.query(db.sql`
        INSERT INTO user_subscriptions (
          user_id,
          subscription_type_id,
          status,
          current_period_start,
          current_period_end,
          created_at,
          updated_at
        )
        VALUES (
          ${newUser.id},
          ${subscriptionTypes[0].id},
          'active',
          NOW(),
          NOW() + INTERVAL '1 year',
          NOW(),
          NOW()
        )
      `);

      await db.query(db.sql`COMMIT`);

      // Create auth response with token
      const authResponse = createAuthResponse({
        ...newUser,
        subscriptionType: plan
      });

      res.status(201).json({
        message: 'Account created successfully',
        ...authResponse
      });
    } catch (error) {
      await db.query(db.sql`ROLLBACK`);
      throw error;
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(error.statusCode || 500).json({ 
      error: error instanceof AuthError ? error.message : 'Failed to create account'
    });
  }
}