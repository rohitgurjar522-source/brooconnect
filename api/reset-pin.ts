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
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    // 1. Verify OTP
    const authKey = process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY;
    const verifyUrl = `https://api.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`;
    
    const otpRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "authkey": authKey as string }
    });
    const otpData = await otpRes.json();

    if (otpData.type !== "success") {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // 2. Hash New PIN
    const pinHash = await bcrypt.hash(newPin, 10);

    // 3. Update User
    const { error } = await supabase
      .from('users')
      .update({ pin_hash: pinHash })
      .eq('mobile', `91${mobile}`);

    if (error) throw error;

    return res.status(200).json({ success: true, message: "PIN reset successful" });
  } catch (err: any) {
    console.error("Reset PIN Error:", err);
    return res.status(500).json({ success: false, message: "PIN reset failed" });
  }
}