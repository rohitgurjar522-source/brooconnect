import { createClient } from '@supabase/supabase-js';

// Configuration from requirements
const SUPABASE_URL = "https://ncnhvitnllfzyusoatrt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NLQsEIVAimIM91l0-bBCyA_vhm6CPVJ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});