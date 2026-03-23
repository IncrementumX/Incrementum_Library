import { createClient } from "@supabase/supabase-js";

import { env, isSupabaseAdminConfigured, requiredSupabaseAdminEnvVars } from "@/lib/env";

export function createSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      `Supabase admin client is not configured. Missing required environment variables: ${requiredSupabaseAdminEnvVars.join(", ")}.`
    );
  }

  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
