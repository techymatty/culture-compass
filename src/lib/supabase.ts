import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  !supabaseUrl.includes('dummy') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('dummy')
)

// Prevent SDK from throwing errors if keys are unconfigured/dummy
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
