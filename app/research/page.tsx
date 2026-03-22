import Link from "next/link";
import { Plus } from "lucide-react";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchItemCard } from "@/components/research/research-item-card";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAnalystPrompts, listResearchByType } from "@/lib/repositories";

export default async function ResearchPage() {
  const [prompts, sectors, assets] = await Promise.all([
    listAnalystPrompts(),
    listResearchByType("sector"),
    listResearchByType("asset")
  ]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Research Analyst"
          description="Research should feel user-seeded. Define the asset or sector first, then let the analyst build on top of your materials and questions."
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
              <h2 className="mt-4 font-serif text-4xl text-foreground">Assets and sectors</h2>
              <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
                Keep this layer thesis-first and explicitly defined by you. The analyst should work from what you add, not invent a world on its own.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/research/new?type=sector">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sector
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/research/new?type=asset">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Asset
                </Link>
              </Button>
              <Button asChild>
                <Link href="/research/new?type=company">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Company
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Sectors</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {sectors.map((item) => (
                <ResearchItemCard key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Assets</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {assets.map((item) => (
                <ResearchItemCard key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
