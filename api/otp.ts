import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { action, mobile, otp } = req.body;
  
  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required" });
  }

  const authKey = process.env.VITE_MSG91_AUTH_KEY;
  const templateId = process.env.VITE_MSG91_TEMPLATE_ID;
  const senderId = process.env.VITE_MSG91_SENDER_ID || "BROOCT";

  if (!authKey) {
    return res.status(500).json({ message: "Server configuration error: AuthKey missing" });
  }

  // Ensure mobile is in 91xxxxxxxxxx format
  const formattedMobile = mobile.length === 10 ? `91${mobile}` : mobile;

  try {
    if (action === "send") {
      const response = await fetch("https://api.msg91.com/api/v5/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authkey": authKey
        },
        body: JSON.stringify({
          mobile: formattedMobile,
          template_id: templateId,
          sender: senderId
        })
      });

      const data = await response.json();
      if (data.type === "success") {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ message: data.message || "Failed to send OTP" });
      }
    } 
    
    else if (action === "verify") {
      if (!otp) {
        return res.status(400).json({ message: "OTP is required for verification" });
      }

      const response = await fetch(
        `https://api.msg91.com/api/v5/otp/verify?mobile=${formattedMobile}&otp=${otp}`,
        {
          method: "GET",
          headers: { "authkey": authKey }
        }
      );

      const data = await response.json();
      if (data.type === "success") {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ message: data.message || "Invalid OTP" });
      }
    }

    return res.status(400).json({ message: "Invalid action" });

  } catch (error) {
    console.error("OTP API Error:", error);
    return res.status(500).json({ message: "Internal server error during OTP operation" });
  }
}