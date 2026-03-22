import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { createResearchItem } from "@/lib/repositories";

export async function POST(request: Request) {
  const body = await request.json();

  const item = await createResearchItem({
    title: String(body.title),
    type: body.type as "asset" | "sector" | "company",
    executiveSummary: body.executiveSummary ? String(body.executiveSummary) : undefined,
    coreView: body.coreView ? String(body.coreView) : undefined
  });

  return NextResponse.json({
    mode: getResolvedDataMode(),
    item
  });
}
