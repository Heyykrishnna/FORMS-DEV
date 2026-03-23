
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pjzieaxsfzfafmlmxhjp.supabase.co'
const supabaseKey = 'sb_publishable_Yh3LfFTjWHW85uC_gCZ72w_ReZ-thhV'

export const supabase = createClient(supabaseUrl, supabaseKey)
