import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { mobile, newPin } = req.body;
  if (!mobile || !newPin) return res.status(400).json({ success: false, message: "Invalid data" });

  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

  try {
    const pinHash = await bcrypt.hash(newPin, 10);
    const { data: user, error } = await supabase
      .from('users')
      .update({ pin_hash: pinHash })
      .eq('mobile', formattedMobile)
      .select()
      .single();

    if (error) throw error;

    const { pin_hash, ...safeUser } = user;
    return res.status(200).json({ success: true, user: safeUser });
  } catch (err) {
    console.error("Reset PIN Error:", err);
    return res.status(500).json({ success: false, message: "Failed to reset PIN" });
  }
}