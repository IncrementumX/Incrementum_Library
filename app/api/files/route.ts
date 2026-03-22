import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { processFileSummary, requestFileProcessing, uploadLibraryFile } from "@/lib/services/file-processing-service";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  const uploaded = await uploadLibraryFile({
    input: {
      folderId: String(formData.get("folderId")),
      title: String(formData.get("title")),
      author: String(formData.get("author") || "Unknown"),
      kind: String(formData.get("kind")) as "Report" | "Presentation" | "Transcript" | "Research Letter" | "Memo",
      publishedAt: String(formData.get("publishedAt") || ""),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      fileName: file instanceof File ? file.name : "untitled-file",
      fileSizeBytes: file instanceof File ? file.size : undefined,
      mimeType: file instanceof File ? file.type : undefined
    },
    file: file instanceof File ? file : undefined
  });

  const processing = await requestFileProcessing(uploaded.file.id);
  const summarized = await processFileSummary({
    title: uploaded.file.title,
    author: uploaded.file.author,
    kind: uploaded.file.kind,
    file: uploaded.file
  });

  return NextResponse.json({
    mode: getResolvedDataMode(),
    processing,
    file: summarized.file,
    summary: summarized.summary
  });
}
