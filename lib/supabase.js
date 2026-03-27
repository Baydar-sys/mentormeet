import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qwozpufccleetmumelki.supabase.co'
const supabaseKey = 'sb_publishable_FJaBwXm5IP4oUAMMDDW8kw_tz-htDrf'

export const supabase = createClient(supabaseUrl, supabaseKey)