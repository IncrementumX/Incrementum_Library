import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { getFileBySlug, listFiles } from "@/lib/repositories";
import { generateInsightFromFile } from "@/lib/services/insight-service";

export async function POST(request: Request) {
  const body = await request.json();
  const files = await listFiles();
  const file =
    files.find((entry) => entry.id === body.fileId) ??
    (body.fileSlug ? await getFileBySlug(String(body.fileSlug)) : undefined);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const insight = await generateInsightFromFile(file);

  return NextResponse.json({
    mode: getResolvedDataMode(),
    insight
  });
}
