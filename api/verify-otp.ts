import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ error: "Missing mobile or otp" });
  }

  try {
    // Note: Using the AuthKey from environment variables for security.
    // The mobile number should include the country code (e.g., 91XXXXXXXXXX)
    const authKey = process.env.MSG91_AUTH_KEY || "483852Tm7V0MKK694ad662P1"; 
    
    const response = await fetch(
      `https://api.msg91.com/api/v5/otp/verify?mobile=${mobile}&otp=${otp}`,
      {
        method: "GET", // MSG91 Verify endpoint is typically GET or POST with params
        headers: {
          "authkey": authKey,
        },
      }
    );

    const data = await response.json();

    if (data.type === "success") {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: data.message || "Invalid OTP" 
      });
    }
  } catch (error) {
    console.error("OTP Verification Backend Error:", error);
    return res.status(500).json({ error: "Internal OTP verification failure" });
  }
}