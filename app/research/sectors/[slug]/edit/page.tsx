import { notFound } from "next/navigation";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchItemForm } from "@/components/research/research-item-form";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { getResearchItemBySlug, listAnalystPrompts } from "@/lib/repositories";

export default async function EditSectorResearchPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, prompts] = await Promise.all([params, listAnalystPrompts()]);
  const item = await getResearchItemBySlug(slug, "sector");

  if (!item) {
    notFound();
  }

  return (
    <AppShell
      analystPanel={<AnalystPanel prompts={prompts} title={`${item.title} Analyst`} description="Refine the sector thesis directly from the item form, then continue the thread." />}
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Research</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Edit {item.title}</h2>
            </div>
            <RuntimeModeBadge />
          </div>
        </section>
        <section className="rounded-[1.6rem] border border-border/80 bg-card/90 p-6 shadow-whisper">
          <ResearchItemForm mode="edit" item={item} />
        </section>
      </div>
    </AppShell>
  );
}
