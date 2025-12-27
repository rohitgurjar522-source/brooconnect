import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, oldPin, newPin } = req.body;

  if (!userId || !oldPin || !newPin) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('pin_hash')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(oldPin, user.pin_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect current PIN" });
    }

    const newPinHash = await bcrypt.hash(newPin, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ pin_hash: newPinHash })
      .eq('id', userId);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true, message: "PIN updated successfully" });
  } catch (err: any) {
    console.error("Change PIN Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update PIN" });
  }
}