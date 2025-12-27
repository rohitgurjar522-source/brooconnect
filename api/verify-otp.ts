import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ success: false, message: "Mobile and OTP required" });

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;
  const authKey = (process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY) as string;

  try {
    const verifyUrl = `https://api.msg91.com/api/v5/otp/verify?mobile=${formattedMobile}&otp=${otp}`;
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: { "authkey": authKey }
    });

    const data = await response.json();
    if (data.type === "success") {
      return res.status(200).json({ success: true, message: "OTP verified" });
    }
    return res.status(401).json({ success: false, message: data.message || "Invalid OTP" });
  } catch (err) {
    console.error("Server Verify Error:", err);
    return res.status(500).json({ success: false, message: "Server-side verification failed" });
  }
}