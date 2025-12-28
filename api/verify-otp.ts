import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ verified: false });

  const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;
  const authKey = (process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY) as string;

  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=${formattedPhone}&otp=${otp}`,
      {
        method: "POST",
        headers: { "authkey": authKey }
      }
    );

    const data = await response.json();
    if (data.type === "success") {
      return res.status(200).json({ verified: true });
    }
    return res.status(401).json({ verified: false, message: data.message });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return res.status(500).json({ verified: false });
  }
}