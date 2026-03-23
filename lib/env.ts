const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || "library-files",
  openAIApiKey: process.env.OPENAI_API_KEY,
  openAIModel: process.env.OPENAI_MODEL || "gpt-5.4-mini",
  dataMode: process.env.DATA_MODE || "auto"
} as const;

export const requiredSupabasePublicEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
] as const;

export const requiredSupabaseAdminEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function isSupabaseAdminConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isOpenAIConfigured() {
  return Boolean(env.openAIApiKey);
}

export function getResolvedDataMode(): "supabase" | "mock" {
  if (env.dataMode === "supabase" && isSupabaseConfigured()) {
    return "supabase";
  }

  if (env.dataMode === "mock") {
    return "mock";
  }

  return isSupabaseConfigured() ? "supabase" : "mock";
}

export { env };
