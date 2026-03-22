import { Badge } from "@/components/ui/badge";
import { getAppConfig } from "@/lib/config/app-config";

export function RuntimeModeBadge() {
  const config = getAppConfig();

  if (config.features.fallbackMode) {
    return <Badge variant="warning">Fallback mode</Badge>;
  }

  return <Badge variant="success">Supabase mode</Badge>;
}
