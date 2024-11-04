import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, email, name, customerId } = req.body;

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 charges for annual subscription
      notes: {
        customer_id: customerId,
        email,
        name
      }
    });

    return res.status(200).json({ subscription });
  } catch (error) {
    console.error('Subscription creation failed:', error);
    return res.status(500).json({ error: 'Failed to create subscription' });
  }
}