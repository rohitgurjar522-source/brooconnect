import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, mobile, age, city, pincode, email, pin } = req.body;
  if (!name || !mobile || !pin) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

  try {
    // 1. Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // 2. Referral Code
    const referralCode = "BR" + Math.floor(1000 + Math.random() * 9000);

    // 3. Database Insertion
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        full_name: name,
        mobile: formattedMobile,
        age: parseInt(age) || null,
        city: city || null,
        pincode: pincode || null,
        email: email || null,
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
      if (error.code === '23505') return res.status(400).json({ success: false, message: "Account already exists" });
      throw error;
    }

    const { pin_hash, ...safeUser } = user;
    return res.status(200).json({ success: true, user: safeUser });
  } catch (err: any) {
    console.error("Account Creation Error:", err);
    return res.status(500).json({ success: false, message: "Failed to create account" });
  }
}