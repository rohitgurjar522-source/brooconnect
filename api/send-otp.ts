import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mobile } = req.body;

  if (!mobile || mobile.length !== 10) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  try {
    const response = await fetch("https://api.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": process.env.VITE_MSG91_AUTH_KEY as string,
      },
      body: JSON.stringify({
        template_id: process.env.VITE_MSG91_TEMPLATE_ID,
        mobile: `91${mobile}`,
        sender: process.env.VITE_MSG91_SENDER_ID || "BROOCT",
      }),
    });

    const data = await response.json();

    if (data.type === "error") {
      return res.status(400).json({ error: data.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Server Send Error:", err);
    return res.status(500).json({ error: "OTP send failed" });
  }
}