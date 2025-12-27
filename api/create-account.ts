import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, mobile, age, city, pin, email, pincode } = req.body;
  if (!mobile || !pin || !name) {
    return res.status(400).json({ success: false, message: "Missing required profile data" });
  }

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

  try {
    // 1. Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // 2. Create User
    const referralCode = "BR" + Math.floor(1000 + Math.random() * 9000);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        mobile: formattedMobile,
        full_name: name,
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

    if (insertError) {
      if (insertError.code === '23505') return res.status(400).json({ success: false, message: "Account already exists" });
      throw insertError;
    }

    const { pin_hash, ...safeUser } = newUser;
    return res.status(200).json({ success: true, user: safeUser });
  } catch (err: any) {
    console.error("Account Creation Error:", err);
    return res.status(500).json({ success: false, message: "Database failure during registration" });
  }
}