// Supabase project setup — no billing card required, unlike Firebase.
// These values come from your Supabase Dashboard > Project Settings > API.
// The "anon" key is safe to expose in frontend code — access is controlled
// separately by Row Level Security (RLS) policies on the table, not by
// hiding this key.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
