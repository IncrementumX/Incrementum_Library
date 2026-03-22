import { createSupabaseAdminClient, } from "@/lib/supabase/admin";
import { seedFolders } from "@/lib/mock/seed-data";
import { runWithDataFallback } from "@/lib/repositories/runtime";
import { createId, slugify } from "@/lib/repositories/utils";
import { CreateFolderInput, LibraryFolder } from "@/types/domain";

function mapFolder(row: Record<string, unknown>): LibraryFolder {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description ?? ""),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined
  };
}

export async function listFolders() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      throw new Error("Supabase admin client unavailable");
    }

    const { data, error } = await supabase.from("folders").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map(mapFolder);
  }, async () => seedFolders);
}

export async function getFolderById(folderId: string) {
  const folders = await listFolders();
  return folders.find((folder) => folder.id === folderId);
}

export async function createFolder(input: CreateFolderInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) {
      throw new Error("Supabase admin client unavailable");
    }

    const payload = {
      name: input.name,
      description: input.description ?? "",
      slug: slugify(input.name)
    };

    const { data, error } = await supabase.from("folders").insert(payload).select("*").single();
    if (error) throw error;
    return mapFolder(data);
  }, async () => ({
    id: createId("folder"),
    slug: slugify(input.name),
    name: input.name,
    description: input.description ?? ""
  }));
}
