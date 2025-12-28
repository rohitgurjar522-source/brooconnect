import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { mobile, purpose } = req.body;
  if (!mobile) return res.status(400).json({ success: false, message: "Mobile number required" });

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;
  const authKey = (process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY) as string;
  const templateId = (process.env.MSG91_TEMPLATE_ID || process.env.VITE_MSG91_TEMPLATE_ID) as string;
  const senderId = (process.env.MSG91_SENDER_ID || process.env.VITE_MSG91_SENDER_ID || "BROOCT") as string;

  try {
    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": authKey
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: formattedMobile,
        sender: senderId
      })
    });

    const data = await response.json();
    if (data.type === "success") {
      return res.status(200).json({ success: true, message: "OTP sent" });
    }
    return res.status(400).json({ success: false, message: data.message || "Failed to send OTP" });
  } catch (err) {
    console.error("OTP Send Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}