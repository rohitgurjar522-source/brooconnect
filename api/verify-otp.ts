import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`,
      {
        method: "GET",
        headers: {
          "authkey": process.env.VITE_MSG91_AUTH_KEY as string,
        },
      }
    );

    const data = await response.json();

    if (data.type === "error") {
      return res.status(400).json({ error: data.message || "Invalid OTP" });
    }

    return res.status(200).json({ verified: true });
  } catch (err) {
    console.error("Server Verify Error:", err);
    return res.status(500).json({ error: "OTP verification failed" });
  }
}