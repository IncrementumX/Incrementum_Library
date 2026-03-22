import { env, getResolvedDataMode, isOpenAIConfigured, isSupabaseConfigured } from "@/lib/env";

export function getAppConfig() {
  const dataMode = getResolvedDataMode();

  return {
    env,
    dataMode,
    features: {
      supabaseEnabled: dataMode === "supabase" && isSupabaseConfigured(),
      openAIEnabled: isOpenAIConfigured(),
      fallbackMode: dataMode === "mock"
    }
  };
}
