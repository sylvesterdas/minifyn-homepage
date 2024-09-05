export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Log the failed payment attempt
    console.error('Payment failed:', req.body);
    res.status(200).json({ message: 'Payment failed' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}