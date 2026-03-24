import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { linkFileToAsset } from "@/lib/repositories";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const body = await request.json();

  const result = await linkFileToAsset(fileId, String(body.assetId));

  return NextResponse.json({
    mode: getResolvedDataMode(),
    ...result
  });
}
