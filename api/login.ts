import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { mobile, pin } = req.body;

  if (!mobile || !pin) {
    return res.status(400).json({ success: false, message: "Mobile and PIN are required" });
  }

  // Ensure mobile has 91 prefix for database consistency
  const formattedMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('mobile', formattedMobile)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Invalid mobile number or account not found" });
    }

    // Verify hashed PIN
    const match = await bcrypt.compare(pin, user.pin_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect PIN. Please try again." });
    }

    // Success - return user data (minus sensitive hash)
    const { pin_hash, ...safeUser } = user;
    return res.status(200).json({ success: true, user: safeUser });
  } catch (err: any) {
    console.error("Login Server Error:", err);
    return res.status(500).json({ success: false, message: "Server-side login failed" });
  }
}