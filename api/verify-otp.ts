import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile and OTP required" });
  }

  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`,
      {
        method: "GET",
        headers: {
          authkey: process.env.VITE_MSG91_AUTH_KEY as string
        }
      }
    );

    const data = await response.json();

    if (data.type === "error") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ message: "OTP verify failed" });
  }
}