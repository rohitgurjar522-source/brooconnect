import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: process.env.MSG91_AUTH_KEY as string,
        },
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return res.status(500).json({ type: 'error', message: 'OTP verify failed' });
  }
}