import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ type: 'error', message: 'Mobile and OTP are required' });
  }

  const authKey = process.env.VITE_MSG91_AUTH_KEY || process.env.MSG91_AUTH_KEY;

  if (!authKey) {
    return res.status(500).json({ type: 'error', message: 'Server configuration error' });
  }

  const formattedMobile = mobile.startsWith('91') && mobile.length > 10 ? mobile : `91${mobile}`;

  try {
    // MSG91 v5 Verify API
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=${formattedMobile}&otp=${otp}`,
      {
        method: 'GET',
        headers: {
          'authkey': authKey
        }
      }
    );

    const data = await response.json();

    if (data.type === 'success') {
      return res.status(200).json({ type: 'success', message: 'OTP verified' });
    } else {
      return res.status(400).json({ type: 'error', message: data.message || 'Invalid OTP' });
    }
  } catch (error) {
    console.error('OTP Verify Exception:', error);
    return res.status(500).json({ type: 'error', message: 'OTP verification failed on server' });
  }
}