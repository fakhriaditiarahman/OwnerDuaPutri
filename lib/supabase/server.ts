import "server-only"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL belum diatur di .env.local")
}

// Pakai service role kalau tersedia (bypass RLS), fallback ke publishable key.
const key = serviceKey || publishableKey

if (!key) {
  throw new Error(
    "Supabase key belum diatur: isi SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local",
  )
}

export const supabase = createClient(supabaseUrl, key, {
  auth: { persistSession: false },
})