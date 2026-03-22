import { buildStoragePath, getStorageBucketName } from "@/lib/supabase/storage";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createFileRecord } from "@/lib/repositories/files";
import { getFolderById } from "@/lib/repositories/folders";
import { generateFileSummary, saveGeneratedSummary } from "@/lib/services/summary-service";
import { UploadFileInput } from "@/types/domain";

interface UploadLibraryFileArgs {
  input: UploadFileInput;
  file?: File;
}

export async function uploadLibraryFile({ input, file }: UploadLibraryFileArgs) {
  const folder = await getFolderById(input.folderId);
  const folderSlug = folder?.slug ?? "unassigned";
  const storagePath = buildStoragePath(folderSlug, input.fileName);

  const stored = await uploadBinaryToStorage(file, storagePath);

  const record = await createFileRecord({
    ...input,
    originalFileName: input.fileName,
    storageBucket: stored?.bucket ?? getStorageBucketName(),
    storagePath: stored?.path ?? storagePath,
    processingStatus: "uploaded",
    summaryStatus: "queued"
  });

  return {
    file: record,
    uploadState: stored ? "uploaded" : "idle",
    storage: stored ?? {
      bucket: getStorageBucketName(),
      path: storagePath,
      uploaded: false
    }
  };
}

export async function requestFileProcessing(fileId: string) {
  return {
    fileId,
    accepted: true,
    processingStatus: "processing" as const
  };
}

export async function processFileSummary(args: {
  title: string;
  author?: string;
  kind: string;
  extractedText?: string;
  file: Awaited<ReturnType<typeof createFileRecord>>;
}) {
  const generated = await generateFileSummary({
    title: args.title,
    author: args.author,
    kind: args.kind,
    extractedText: args.extractedText
  });

  const updatedFile = await saveGeneratedSummary(args.file, generated);

  return {
    file: updatedFile,
    summary: generated
  };
}

async function uploadBinaryToStorage(file: File | undefined, storagePath: string) {
  if (!file) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return null;
  }

  const bucket = getStorageBucketName();
  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    throw error;
  }

  return {
    bucket,
    path: storagePath,
    uploaded: true
  };
}
