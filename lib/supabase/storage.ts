import { env } from "@/lib/env";

export function buildStoragePath(folderSlug: string, fileName: string) {
  const normalizedName = fileName.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return `folders/${folderSlug}/${timestamp}-${normalizedName}`;
}

export function getStorageBucketName() {
  return env.supabaseStorageBucket;
}
