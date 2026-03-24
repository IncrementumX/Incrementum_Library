import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { linkFileToAsset } from "@/lib/repositories";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const result = await linkFileToAsset(String(body.fileId), id);

  return NextResponse.json({
    mode: getResolvedDataMode(),
    ...result
  });
}
