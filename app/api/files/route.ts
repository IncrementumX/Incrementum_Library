import { NextResponse } from "next/server";

import { getAppConfig } from "@/lib/config/app-config";
import { getResolvedDataMode } from "@/lib/env";
import { processFileSummary, requestFileProcessing, uploadLibraryFile } from "@/lib/services/file-processing-service";

export async function POST(request: Request) {
  try {
    const config = getAppConfig();
    if (config.features.fallbackMode) {
      return NextResponse.json(
        {
          error: "Real file upload is unavailable in fallback mode. Configure Supabase credentials before using Add file."
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was provided." }, { status: 400 });
    }

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
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type
      },
      file
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upload error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
