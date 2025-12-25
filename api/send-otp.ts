import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ message: "Mobile required" });
  }

  try {
    const authKey = process.env.VITE_MSG91_AUTH_KEY || "483852Tm7V0MKK694ad662P1";
    const templateId = process.env.VITE_MSG91_TEMPLATE_ID;
    const sender = process.env.VITE_MSG91_SENDER_ID || "BROOCT";

    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: authKey
      },
      body: JSON.stringify({
        mobile: `91${mobile}`,
        template_id: templateId,
        sender: sender
      })
    });

    const data = await response.json();

    if (!response.ok || data.type === "error") {
      return res.status(400).json({ message: data.message || "OTP send failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Backend Send Error:", err);
    return res.status(500).json({ message: "OTP server error" });
  }
}