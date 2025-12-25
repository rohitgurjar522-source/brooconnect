import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number required" });
  }

  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp?mobile=91${mobile}&template_id=${process.env.VITE_MSG91_TEMPLATE_ID}`,
      {
        method: "GET",
        headers: {
          authkey: process.env.VITE_MSG91_AUTH_KEY as string
        }
      }
    );

    const data = await response.json();

    if (data.type === "error") {
      return res.status(400).json({ message: data.message });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "OTP send failed" });
  }
}