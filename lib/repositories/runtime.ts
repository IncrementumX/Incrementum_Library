import { getAppConfig } from "@/lib/config/app-config";

export async function runWithDataFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T> | T
) {
  const config = getAppConfig();

  if (config.features.fallbackMode) {
    return fallback();
  }

  try {
    return await primary();
  } catch (error) {
    console.warn("Falling back to mock data repository", error);
    return fallback();
  }
}
