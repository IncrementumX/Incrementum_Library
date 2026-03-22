import { createClient } from "@supabase/supabase-js";

import { env, isSupabaseConfigured } from "@/lib/env";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}

export function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      persistSession: false
    }
  });
}
