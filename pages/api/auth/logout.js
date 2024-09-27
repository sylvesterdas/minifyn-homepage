
/** @param {import('next').NextApiResponse} res  */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  res.setHeader('Set-Cookie', `sessionId=deleted; HttpOnly; Path=/; Max-Age=-1; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
  res.status(200).end();
}