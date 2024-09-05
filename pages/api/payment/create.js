import { createPayment } from '../../../lib/payu';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, productInfo, firstName, email, phone } = req.body;
      const paymentResponse = await createPayment(amount, productInfo, firstName, email, phone);
      res.status(200).json(paymentResponse);
    } catch (error) {
      res.status(500).json({ error: 'Error creating payment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}