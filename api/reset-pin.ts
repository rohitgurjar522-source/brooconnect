import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { mobile, otp, newPin } = req.body;

  if (!mobile || !otp || !newPin) {
    return res.status(400).json({ success: false, message: "Mobile, OTP, and New PIN are required" });
  }

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

  try {
    // 1. VERIFY OTP
    const authKey = process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY;
    const verifyUrl = `https://api.msg91.com/api/v5/otp/verify?mobile=${formattedMobile}&otp=${otp}`;
    
    const otpRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "authkey": authKey as string }
    });
    const otpData = await otpRes.json();

    if (otpData.type !== "success") {
      return res.status(401).json({ success: false, message: "Verification failed: Invalid OTP" });
    }

    // 2. HASH NEW PIN
    const pinHash = await bcrypt.hash(newPin, 10);

    // 3. UPDATE DB
    const { error } = await supabase
      .from('users')
      .update({ pin_hash: pinHash })
      .eq('mobile', formattedMobile);

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Security PIN updated successfully" });
  } catch (err: any) {
    console.error("Reset PIN Server Error:", err);
    return res.status(500).json({ success: false, message: "Failed to reset PIN" });
  }
}