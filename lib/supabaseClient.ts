import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ncnhvitnllfzyusoatrt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NLQsEIVAimIM91l0-bBCyA_vhm6CPVJ"; 

// NOTE: If you encounter "Load failed", please verify that the SUPABASE_ANON_KEY above 
// is the correct Anon/Public key from your Supabase Dashboard, not a Stripe key.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);