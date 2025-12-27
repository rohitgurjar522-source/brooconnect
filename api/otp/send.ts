import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number required" });
  }

  try {
    const authKey = process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID || process.env.VITE_MSG91_TEMPLATE_ID;
    const senderId = process.env.MSG91_SENDER_ID || process.env.VITE_MSG91_SENDER_ID || "BROOCT";

    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": authKey as string
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: phone,
        sender: senderId
      })
    });

    const data = await response.json();
    if (data.type === "success") {
      return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } else {
      return res.status(400).json({ success: false, message: data.message || "Failed to send OTP" });
    }
  } catch (err: any) {
    console.error("OTP Send Server Error:", err);
    return res.status(500).json({ success: false, message: "Server error sending OTP" });
  }
}