import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile & OTP required" });
  }

  try {
    const authKey = process.env.VITE_MSG91_AUTH_KEY || "483852Tm7V0MKK694ad662P1";

    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`,
      {
        headers: {
          authkey: authKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok || data.type === "error") {
      return res.status(400).json({ message: data.message || "Invalid OTP" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Backend Verify Error:", err);
    return res.status(500).json({ message: "OTP verify error" });
  }
}