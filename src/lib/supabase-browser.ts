import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (uses NEXT_PUBLIC_ variables, accessible in browser)
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabaseBrowser = url && key ? createClient(url, key) : null