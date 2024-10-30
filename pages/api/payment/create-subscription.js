import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    console.log('Creating subscription with data:', req.body);
    const { planId, email, name } = req.body;

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months subscription
      quantity: 1,
      notes: {
        email,
        name
      },
      notify_info: {
        notify_phone: false,
        notify_email: true
      },
      offer_id: null
    });

    console.log('Subscription created:', subscription);
    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Subscription creation error:', error);
    
    // Send more specific error message
    const errorMessage = error.error?.description || error.message || 'Failed to create subscription';
    res.status(error.statusCode || 500).json({ 
      error: errorMessage,
      details: error.error || error 
    });
  }
}