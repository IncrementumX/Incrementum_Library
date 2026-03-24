import Link from "next/link";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchItemForm } from "@/components/research/research-item-form";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { listAnalystPrompts } from "@/lib/repositories";

export default async function NewResearchPage() {
  const prompts = await listAnalystPrompts();

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Research Analyst"
          description="New research now begins from a single asset. Add the asset, then let linked files, drafts, and the analyst build it out."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Research</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Create asset</h2>
            </div>
            <RuntimeModeBadge />
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-card/90 p-6 shadow-whisper">
          <ResearchItemForm mode="create" />
        </section>

        <Button asChild variant="outline">
          <Link href="/research">Back to Research</Link>
        </Button>
      </div>
    </AppShell>
  );
}
