import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - Client will not function correctly')
}

// Create client with proper session persistence
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storage: typeof window !== 'undefined' ? window.localStorage : undefined
        },
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    }
)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
    return supabaseUrl && supabaseAnonKey &&
        !supabaseUrl.includes('placeholder') &&
        !supabaseAnonKey.includes('placeholder')
}
