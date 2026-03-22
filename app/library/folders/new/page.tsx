import Link from "next/link";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { NewFolderForm } from "@/components/library/new-folder-form";
import { AppShell } from "@/components/layout/app-shell";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { listAnalystPrompts } from "@/lib/repositories";

export default async function NewFolderPage() {
  const prompts = await listAnalystPrompts();

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Folder Analyst"
          description="Folders organize the document layer first, so the analyst can work from stable material groupings later."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Library</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">New folder</h2>
            </div>
            <RuntimeModeBadge />
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-card/90 p-6 shadow-whisper">
          <NewFolderForm />
        </section>

        <Button asChild variant="outline">
          <Link href="/library">Back to Library</Link>
        </Button>
      </div>
    </AppShell>
  );
}
