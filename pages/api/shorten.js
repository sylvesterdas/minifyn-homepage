import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    const shortCode = nanoid(8);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // await db.collection('urls').doc(shortCode).set({
    //   originalUrl: url,
    //   shortCode,
    //   createdBy: 'anonymous',
    //   createdAt: new Date(),
    //   expiresAt: expirationDate,
    // });

    res.status(200).json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create short URL' });
  }
}