import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, otp, regData, resetData } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Mobile and OTP are required" });
  }

  try {
    // 1. Verify OTP with MSG91
    const authKey = process.env.MSG91_AUTH_KEY || process.env.VITE_MSG91_AUTH_KEY;
    const verifyUrl = `https://api.msg91.com/api/v5/otp/verify?mobile=${phone}&otp=${otp}`;
    
    const otpRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "authkey": authKey as string }
    });
    const otpData = await otpRes.json();

    if (otpData.type !== "success") {
      return res.status(401).json({ success: false, message: otpData.message || "Invalid or expired OTP" });
    }

    // 2. Handle Logic Based on Context
    if (regData) {
      // REGISTRATION FLOW
      const pinHash = await bcrypt.hash(regData.pin, 10);
      const referralCode = "BR" + Math.floor(1000 + Math.random() * 9000);
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          mobile: phone,
          full_name: regData.name,
          age: parseInt(regData.age),
          city: regData.city,
          pincode: regData.pincode,
          email: regData.email,
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

      if (insertError) {
        if (insertError.code === '23505') {
          return res.status(400).json({ success: false, message: "Mobile number already registered" });
        }
        throw insertError;
      }

      return res.status(200).json({ success: true, message: "Registration successful", user: newUser });
    } 
    
    if (resetData) {
      // PIN RESET FLOW
      const pinHash = await bcrypt.hash(resetData.newPin, 10);
      const { error: updateError } = await supabase
        .from('users')
        .update({ pin_hash: pinHash })
        .eq('mobile', phone);

      if (updateError) throw updateError;

      return res.status(200).json({ success: true, message: "PIN reset successful" });
    }

    // Default verify success (no actions)
    return res.status(200).json({ success: true, message: "OTP verified" });

  } catch (err: any) {
    console.error("OTP Verify Server Error:", err);
    return res.status(500).json({ success: false, message: "Server error verifying OTP" });
  }
}