import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { rows: subscriptionTypes } = await sql`
        SELECT id, name, display_name, description, price_monthly
        FROM subscription_types
        ORDER BY price_monthly ASC
      `;

      const pricingData = await Promise.all(subscriptionTypes.map(async (type) => {
        const { rows: features } = await sql`
          SELECT f.name, f.description
          FROM subscription_features sf
          JOIN features f ON sf.feature_id = f.id
          WHERE sf.subscription_type_id = ${type.id}
        `;

        return {
          id: type.id,
          name: type.display_name,
          key: type.name,
          price: `₹${type.price_monthly}/month`,
          features: features
        };
      }));

      res.status(200).json(pricingData);
    } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Error fetching pricing data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}