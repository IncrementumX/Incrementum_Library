import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { updateResearchItem } from "@/lib/repositories";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const item = await updateResearchItem(id, {
    title: body.title ? String(body.title) : undefined,
    executiveSummary: body.executiveSummary ? String(body.executiveSummary) : undefined,
    coreView: body.coreView ? String(body.coreView) : undefined,
    keyPillars: Array.isArray(body.keyPillars) ? body.keyPillars.map(String) : undefined
  });

  return NextResponse.json({
    mode: getResolvedDataMode(),
    item
  });
}
