import db from '@/lib/db';
import { kv } from '@vercel/kv';

const CACHE_KEY = 'pricing:plans';
const CACHE_TTL = 3600; // 1 hour

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try cache first
    const cachedPricing = await kv.get(CACHE_KEY);
    if (cachedPricing) {
      return res.status(200).json(cachedPricing);
    }

    // Get all subscription types and their features in a single query
    const { rows: subscriptionData } = await db.query(db.sql`
      WITH subscription_features AS (
        SELECT 
          st.id as subscription_id,
          json_agg(
            json_build_object(
              'name', f.name,
              'description', f.description
            )
          ) as features
        FROM subscription_types st
        LEFT JOIN subscription_features sf ON sf.subscription_type_id = st.id
        LEFT JOIN features f ON sf.feature_id = f.id
        GROUP BY st.id
      )
      SELECT 
        st.id,
        st.name,
        st.display_name,
        st.description,
        st.price_monthly,
        COALESCE(sf.features, '[]') as features
      FROM subscription_types st
      LEFT JOIN subscription_features sf ON sf.subscription_id = st.id
      ORDER BY st.price_monthly ASC
    `);

    const pricingData = subscriptionData.map(type => ({
      id: type.id,
      name: type.display_name,
      key: type.name,
      price: `₹${type.price_monthly}/month`,
      features: type.features
    }));

    // Cache the pricing data
    await kv.set(CACHE_KEY, pricingData, { ex: CACHE_TTL });

    res.status(200).json(pricingData);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Error fetching pricing data' });
  }
}