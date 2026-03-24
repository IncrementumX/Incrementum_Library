import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { saveInvestmentFramework } from "@/lib/repositories";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const framework = await saveInvestmentFramework({
    id,
    name: String(body.name),
    description: body.description ? String(body.description) : "",
    instructions: body.instructions ? String(body.instructions) : "",
    questionSet: Array.isArray(body.questionSet) ? body.questionSet.map(String) : [],
    checklist: Array.isArray(body.checklist) ? body.checklist.map(String) : [],
    keyLenses: Array.isArray(body.keyLenses) ? body.keyLenses.map(String) : [],
    preferredMemoStructure: Array.isArray(body.preferredMemoStructure) ? body.preferredMemoStructure.map(String) : [],
    redFlags: Array.isArray(body.redFlags) ? body.redFlags.map(String) : [],
    outputPreferences: Array.isArray(body.outputPreferences) ? body.outputPreferences.map(String) : [],
    isActive: Boolean(body.isActive)
  });

  return NextResponse.json({
    mode: getResolvedDataMode(),
    framework
  });
}
