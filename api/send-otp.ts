import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mobile } = req.body;

  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ type: 'error', message: 'Valid 10-digit mobile number is required' });
  }

  // Use either VITE_ prefixed or non-prefixed env vars based on availability in Vercel
  const authKey = process.env.VITE_MSG91_AUTH_KEY || process.env.MSG91_AUTH_KEY;
  const templateId = process.env.VITE_MSG91_TEMPLATE_ID || process.env.MSG91_TEMPLATE_ID;
  const senderId = process.env.VITE_MSG91_SENDER_ID || process.env.MSG91_SENDER_ID || 'BROOCT';

  if (!authKey || !templateId) {
    console.error('Missing MSG91 Configuration');
    return res.status(500).json({ type: 'error', message: 'Server configuration error' });
  }

  // Ensure mobile is in 91xxxxxxxxxx format
  const formattedMobile = mobile.startsWith('91') && mobile.length > 10 ? mobile : `91${mobile}`;

  try {
    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": authKey
      },
      body: JSON.stringify({
        mobile: formattedMobile,
        template_id: templateId,
        sender: senderId
      })
    });

    const data = await response.json();

    if (data.type === 'success') {
      return res.status(200).json({ type: 'success', message: 'OTP sent successfully' });
    } else {
      return res.status(400).json({ type: 'error', message: data.message || 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('OTP Send Exception:', error);
    return res.status(500).json({ type: 'error', message: 'Internal server error during OTP delivery' });
  }
}