import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] Client initialized for Lumina Soaps');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client, running in local persistence mode:', err);
  }
} else {
  console.log('[Supabase] No credentials configured. Running with local atomic single-server persistence (database.json).');
}

export const isSupabaseConfigured = (): boolean => Boolean(supabase);
