import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL as string
const SUPABASE_KEY = process.env.SUPABASE_KEY as string

if (!SUPABASE_URL) throw new Error('ERR_SUPABASE_001: SUPABASE_URL is required')
if (!SUPABASE_KEY) throw new Error('ERR_SUPABASE_002: SUPABASE_KEY is required')

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)
