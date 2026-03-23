import { NextResponse } from "next/server";

import { getAppConfig } from "@/lib/config/app-config";
import { env, getResolvedDataMode } from "@/lib/env";
import { processFileSummary, requestFileProcessing, uploadLibraryFile } from "@/lib/services/file-processing-service";

export async function POST(request: Request) {
  try {
    console.info("[upload] request received");

    const config = getAppConfig();
    console.info("[upload] env validation start", {
      dataMode: config.dataMode,
      supabaseEnabled: config.features.supabaseEnabled,
      fallbackMode: config.features.fallbackMode
    });

    if (!env.supabaseUrl) {
      console.error("[upload] env validation failed", {
        missing: "NEXT_PUBLIC_SUPABASE_URL"
      });
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
    }

    if (!env.supabaseServiceRoleKey) {
      console.error("[upload] env validation failed", {
        missing: "SUPABASE_SERVICE_ROLE_KEY"
      });
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    if (config.features.fallbackMode) {
      console.error("[upload] env validation failed", {
        reason: "fallback mode active"
      });
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
      console.error("[upload] request invalid", {
        reason: "missing file"
      });
      return NextResponse.json({ error: "No file was provided." }, { status: 400 });
    }

    const uploaded = await uploadLibraryFile({
      input: {
        folderId: String(formData.get("folderId")),
        title: String(formData.get("title")),
        author: String(formData.get("author") || "Unknown"),
        kind: String(formData.get("kind")) as "Report" | "Presentation" | "Transcript" | "Research Letter" | "Memo",
        publishedAt: String(formData.get("publishedAt") || "").trim() || undefined,
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

    console.info("[upload] request completed", {
      fileId: summarized.file.id,
      processingStatus: summarized.file.processingStatus
    });

    return NextResponse.json({
      mode: getResolvedDataMode(),
      processing,
      file: summarized.file,
      summary: summarized.summary
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upload error.";
    console.error("[upload] request failed", {
      error: message
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
