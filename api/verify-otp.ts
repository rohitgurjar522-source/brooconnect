import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP required" });
  }

  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=${phone}&otp=${otp}`,
      {
        method: "POST",
        headers: {
          "authkey": (process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY) as string
        }
      }
    );

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Server Verify Error:", err);
    return res.status(500).json({ type: "error", message: "OTP verify failed" });
  }
}