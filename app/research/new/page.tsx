import Link from "next/link";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchItemForm } from "@/components/research/research-item-form";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { listAnalystPrompts } from "@/lib/repositories";
import { ResearchEntityInputType } from "@/types/domain";

export default async function NewResearchPage({
  searchParams
}: {
  searchParams: Promise<{ type?: ResearchEntityInputType }>;
}) {
  const [{ type }, prompts] = await Promise.all([searchParams, listAnalystPrompts()]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Research Analyst"
          description="New research items should begin from your chosen entity, then grow through files, updates, and notebook work."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Research</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Create item</h2>
            </div>
            <RuntimeModeBadge />
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-card/90 p-6 shadow-whisper">
          <ResearchItemForm mode="create" defaultType={type ?? "asset"} />
        </section>

        <Button asChild variant="outline">
          <Link href="/research">Back to Research</Link>
        </Button>
      </div>
    </AppShell>
  );
}
