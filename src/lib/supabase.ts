import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sgvpiljodxoyghluvdhi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNndnBpbGpvZHhveWdobHV2ZGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzQ0MzMsImV4cCI6MjA2NjkxMDQzM30.WPKSO5yx85-AgJTsHQZpuGAQx1ItATOlmMUK8ihC1N0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)