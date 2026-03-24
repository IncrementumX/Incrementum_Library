import Link from "next/link";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { UploadForm } from "@/components/library/upload-form";
import { AppShell } from "@/components/layout/app-shell";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { listAnalystPrompts, listFolders } from "@/lib/repositories";

export default async function LibraryUploadPage() {
  const [folders, prompts] = await Promise.all([listFolders(), listAnalystPrompts()]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Upload Analyst"
          description="Upload should create a real file record, stage processing, and keep the analyst grounded in the material you provided."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Library</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Add files</h2>
            </div>
            <RuntimeModeBadge />
          </div>
          <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
            Each file should upload, persist, and process independently. Use this layer as the source of truth for the analyst.
          </p>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-card/90 p-6 shadow-whisper">
          <UploadForm folders={folders} />
        </section>

        <Button asChild variant="outline">
          <Link href="/library">Back to Library</Link>
        </Button>
      </div>
    </AppShell>
  );
}
