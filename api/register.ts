import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string // Need service role for server-side inserts
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, mobile, age, city, pincode, email, pin, otp } = req.body;

  if (!mobile || !pin || !otp || !name) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // 1. Verify OTP via MSG91
    const authKey = process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY;
    const verifyUrl = `https://api.msg91.com/api/v5/otp/verify?mobile=91${mobile}&otp=${otp}`;
    
    const otpRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "authkey": authKey as string }
    });
    const otpData = await otpRes.json();

    if (otpData.type !== "success") {
      return res.status(401).json({ success: false, message: otpData.message || "Invalid OTP" });
    }

    // 2. Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // 3. Save User
    const referralCode = "BR" + Math.floor(1000 + Math.random() * 9000);
    const { data, error } = await supabase
      .from('users')
      .insert([{
        mobile: `91${mobile}`,
        full_name: name,
        age: parseInt(age),
        city,
        pincode,
        email,
        pin_hash: pinHash,
        is_verified: true,
        referral_code: referralCode,
        wallet_balance: 0,
        total_earnings: 0,
        is_paid_member: false,
        role: 'USER',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ success: false, message: "Mobile already registered" });
      throw error;
    }

    return res.status(200).json({ success: true, user: data });
  } catch (err: any) {
    console.error("Registration Error:", err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
}