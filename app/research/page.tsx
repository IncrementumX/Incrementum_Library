import Link from "next/link";
import { Plus } from "lucide-react";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchItemCard } from "@/components/research/research-item-card";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAnalystPrompts, listAssets } from "@/lib/repositories";

export default async function ResearchPage() {
  const [prompts, assets] = await Promise.all([listAnalystPrompts(), listAssets()]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Research Analyst"
          description="Assets are now the center of research. Define the asset first, then let the analyst build on top of linked files, your framework, and your edits."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Research</p>
                <RuntimeModeBadge />
              </div>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Assets</h2>
              <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
                Keep this layer thesis-first and explicitly defined by you. Each asset should become a living research thread grounded in linked files and revised with your edits.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/research/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Asset
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Asset threads</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {assets.map((item) => (
              <ResearchItemCard key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
