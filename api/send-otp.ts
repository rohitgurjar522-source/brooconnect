import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ success: false, message: "Mobile number required" });

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

  try {
    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": (process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY) as string
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID || process.env.VITE_MSG91_TEMPLATE_ID,
        mobile: formattedMobile,
        sender: process.env.MSG91_SENDER_ID || process.env.VITE_MSG91_SENDER_ID || "BROOCT"
      })
    });

    const data = await response.json();
    if (data.type === "success") {
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    }
    return res.status(400).json({ success: false, message: data.message || "Failed to send OTP" });
  } catch (err) {
    console.error("Server Send Error:", err);
    return res.status(500).json({ success: false, message: "Server error sending OTP" });
  }
}