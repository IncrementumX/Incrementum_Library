import { NextResponse } from "next/server";

import { getResolvedDataMode } from "@/lib/env";
import { createFolder } from "@/lib/repositories";

export async function POST(request: Request) {
  const body = await request.json();
  const folder = await createFolder({
    name: String(body.name ?? ""),
    description: body.description ? String(body.description) : ""
  });

  return NextResponse.json({
    mode: getResolvedDataMode(),
    folder
  });
}
