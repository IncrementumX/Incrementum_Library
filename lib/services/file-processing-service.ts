import { buildStoragePath, getStorageBucketName } from "@/lib/supabase/storage";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createFileRecord, createPersistedFileRecord } from "@/lib/repositories/files";
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

  const hasBinaryFile = file instanceof File;
  const stored = hasBinaryFile ? await uploadBinaryToStorage(file, storagePath) : null;

  if (hasBinaryFile && !stored) {
    throw new Error("File upload did not complete successfully. Storage upload must succeed before creating the file record.");
  }

  const recordInput = {
    ...input,
    originalFileName: input.fileName,
    storageBucket: stored?.bucket,
    storagePath: stored?.path,
    processingStatus: hasBinaryFile ? ("uploaded" as const) : ("idle" as const),
    summaryStatus: "queued" as const
  };

  const record = hasBinaryFile
    ? await createPersistedFileRecord(recordInput)
    : await createFileRecord(recordInput);

  return {
    file: record,
    uploadState: hasBinaryFile ? "uploaded" : "idle",
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

  try {
    const supabase = createSupabaseAdminClient();
    const bucket = getStorageBucketName();
    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      throw new Error(`Supabase storage upload failed: ${error.message}`);
    }

    return {
      bucket,
      path: storagePath,
      uploaded: true
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`File upload failed before record creation: ${error.message}`);
    }

    throw new Error("File upload failed before record creation due to an unknown storage error.");
  }
}
