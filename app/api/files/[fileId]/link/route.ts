import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { linkFileToResearch } from "@/lib/repositories";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const body = await request.json();

  const result = await linkFileToResearch(fileId, String(body.researchItemId));

  return NextResponse.json({
    mode: getResolvedDataMode(),
    ...result
  });
}
