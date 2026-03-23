import { seedFiles } from "@/lib/mock/seed-data";
import { runWithDataFallback, runWithoutFallback } from "@/lib/repositories/runtime";
import { createId, createUniqueSlug, slugify } from "@/lib/repositories/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { LibraryFile, UploadFileInput } from "@/types/domain";

type FileRow = {
  id: string;
  slug: string;
  folder_id: string;
  title: string;
  author: string;
  kind: string;
  published_at: string | null;
  added_at: string;
  tags: string[] | null;
  summary_status: string;
  processing_status?: string | null;
  summary: string;
  key_takeaways: string[] | null;
  excerpts: string[] | null;
  analyst_interpretation: string;
  storage_bucket: string | null;
  storage_path: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  original_file_name: string | null;
  file_research_links?: Array<{ research_item_id: string }>;
};

function mapFile(row: FileRow): LibraryFile {
  return {
    id: row.id,
    slug: row.slug,
    folderId: row.folder_id,
    title: row.title,
    author: row.author,
    kind: row.kind as LibraryFile["kind"],
    publishedAt: row.published_at ?? row.added_at,
    addedAt: row.added_at,
    tags: row.tags ?? [],
    linkedResearchIds: row.file_research_links?.map((link) => link.research_item_id) ?? [],
    summaryStatus: row.summary_status as LibraryFile["summaryStatus"],
    processingStatus: (row.processing_status ?? "uploaded") as LibraryFile["processingStatus"],
    summary: row.summary,
    keyTakeaways: row.key_takeaways ?? [],
    excerpts: row.excerpts ?? [],
    analystInterpretation: row.analyst_interpretation,
    storageBucket: row.storage_bucket ?? undefined,
    storagePath: row.storage_path ?? undefined,
    originalFileName: row.original_file_name ?? undefined,
    mimeType: row.mime_type ?? undefined,
    fileSizeBytes: row.file_size_bytes ?? undefined
  };
}

function normalizeNullableString(value: string | undefined | null) {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function listFiles() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase
      .from("files")
      .select("*, file_research_links(research_item_id)")
      .order("added_at", { ascending: false });

    if (error) throw error;
    return (data as FileRow[] | null)?.map(mapFile) ?? [];
  }, async () => seedFiles);
}

export async function listFilesByFolder(folderId: string) {
  const files = await listFiles();
  return files.filter((file) => file.folderId === folderId);
}

export async function getFileBySlug(slug: string) {
  const files = await listFiles();
  return files.find((file) => file.slug === slug);
}

export async function createFileRecord(input: UploadFileInput & Partial<LibraryFile>) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");
    const { finalSlug } = createUniqueSlug(input.title || input.fileName.replace(/\.[^.]+$/, ""));

    const payload = {
      folder_id: input.folderId,
      slug: finalSlug,
      title: input.title,
      author: input.author ?? "Unknown",
      kind: input.kind,
      published_at: normalizeNullableString(input.publishedAt),
      tags: input.tags ?? [],
      summary_status: input.summaryStatus ?? "queued",
      processing_status: input.processingStatus ?? "uploaded",
      summary: input.summary ?? "",
      key_takeaways: input.keyTakeaways ?? [],
      excerpts: input.excerpts ?? [],
      analyst_interpretation: input.analystInterpretation ?? "",
      storage_bucket: normalizeNullableString(input.storageBucket),
      storage_path: normalizeNullableString(input.storagePath),
      mime_type: normalizeNullableString(input.mimeType),
      file_size_bytes: input.fileSizeBytes ?? null,
      original_file_name: normalizeNullableString(input.originalFileName ?? input.fileName)
    };

    const { data, error } = await supabase.from("files").insert(payload).select("*").single();
    if (error) throw error;
    return mapFile(data as FileRow);
  }, async () => ({
    id: createId("file"),
    slug: createUniqueSlug(input.title || input.fileName.replace(/\.[^.]+$/, "")).finalSlug,
    folderId: input.folderId,
    title: input.title,
    author: input.author ?? "Unknown",
    kind: input.kind,
    publishedAt: input.publishedAt ?? new Date().toISOString(),
    addedAt: new Date().toISOString(),
    tags: input.tags ?? [],
    linkedResearchIds: [],
    summaryStatus: input.summaryStatus ?? "queued",
    processingStatus: input.processingStatus ?? "uploaded",
    summary: input.summary ?? "",
    keyTakeaways: input.keyTakeaways ?? [],
    excerpts: input.excerpts ?? [],
    analystInterpretation: input.analystInterpretation ?? "",
    storageBucket: input.storageBucket,
    storagePath: input.storagePath,
    originalFileName: input.originalFileName ?? input.fileName,
    mimeType: input.mimeType,
    fileSizeBytes: input.fileSizeBytes
  }));
}

export async function createPersistedFileRecord(input: UploadFileInput & Partial<LibraryFile>) {
  return runWithoutFallback(async () => {
    const supabase = createSupabaseAdminClient();
    const { baseSlug, finalSlug } = createUniqueSlug(input.title || input.fileName.replace(/\.[^.]+$/, ""));

    const payload = {
      folder_id: input.folderId,
      slug: finalSlug,
      title: input.title,
      author: input.author ?? "Unknown",
      kind: input.kind,
      published_at: normalizeNullableString(input.publishedAt),
      tags: input.tags ?? [],
      summary_status: input.summaryStatus ?? "queued",
      processing_status: input.processingStatus ?? "uploaded",
      summary: input.summary ?? "",
      key_takeaways: input.keyTakeaways ?? [],
      excerpts: input.excerpts ?? [],
      analyst_interpretation: input.analystInterpretation ?? "",
      storage_bucket: normalizeNullableString(input.storageBucket),
      storage_path: normalizeNullableString(input.storagePath),
      mime_type: normalizeNullableString(input.mimeType),
      file_size_bytes: input.fileSizeBytes ?? null,
      original_file_name: normalizeNullableString(input.originalFileName ?? input.fileName)
    };

    console.info("[upload] db insert start", {
      title: payload.title,
      baseSlug,
      finalSlug: payload.slug,
      folderId: payload.folder_id,
      storageBucket: payload.storage_bucket,
      storagePath: payload.storage_path,
      sanitizedPayload: {
        slug: payload.slug,
        published_at: payload.published_at,
        summary_status: payload.summary_status,
        processing_status: payload.processing_status,
        mime_type: payload.mime_type,
        file_size_bytes: payload.file_size_bytes,
        original_file_name: payload.original_file_name
      }
    });

    const { data, error } = await supabase.from("files").insert(payload).select("*").single();
    if (error) {
      console.error("[upload] db insert failed", {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`DB insert failed: ${error.message}`);
    }

    console.info("[upload] db insert success", {
      fileId: data.id,
      slug: data.slug
    });

    return mapFile(data as FileRow);
  });
}

export async function linkFileToResearch(fileId: string, researchItemId: string) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { error } = await supabase
      .from("file_research_links")
      .upsert({ file_id: fileId, research_item_id: researchItemId }, { onConflict: "file_id,research_item_id" });

    if (error) throw error;
    return { ok: true };
  }, async () => ({ ok: true }));
}

export async function unlinkFileFromResearch(fileId: string, researchItemId: string) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { error } = await supabase
      .from("file_research_links")
      .delete()
      .eq("file_id", fileId)
      .eq("research_item_id", researchItemId);

    if (error) throw error;
    return { ok: true };
  }, async () => ({ ok: true }));
}
