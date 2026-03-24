import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { createAsset } from "@/lib/repositories";

export async function POST(request: Request) {
  const body = await request.json();

  const item = await createAsset({
    title: String(body.title),
    symbol: body.symbol ? String(body.symbol) : undefined,
    assetType: body.assetType ? String(body.assetType) : undefined,
    thesis: body.thesis ? String(body.thesis) : undefined,
    executiveSummary: body.executiveSummary ? String(body.executiveSummary) : undefined,
    whatMatters: body.whatMatters ? String(body.whatMatters) : undefined,
    keyRisks: body.keyRisks ? String(body.keyRisks) : undefined,
    counterview: body.counterview ? String(body.counterview) : undefined,
    notes: body.notes ? String(body.notes) : undefined
  });

  return NextResponse.json({
    mode: getResolvedDataMode(),
    item
  });
}
