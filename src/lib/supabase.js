import { createClient } from '@supabase/supabase-js'

// Read from build-time env (Vite injects VITE_* into the bundle).
// If unset, the app falls back to "auth-disabled" mode and runs as before.
const url  = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(url && anon)

export const supabase = supabaseEnabled
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  : null
