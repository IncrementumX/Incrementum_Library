import { NextResponse } from "next/server";

import { getFileById } from "@/lib/repositories";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const file = await getFileById(fileId);

  if (!file?.storageBucket || !file.storagePath) {
    return NextResponse.json({ error: "No stored file is available for this record yet." }, { status: 404 });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(file.storageBucket).createSignedUrl(file.storagePath, 60);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: `Download URL generation failed: ${error?.message ?? "Unknown error"}` }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
