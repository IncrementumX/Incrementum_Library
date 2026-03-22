import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { InsightCard } from "@/components/insights/insight-card";
import { AppShell } from "@/components/layout/app-shell";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { listAnalystPrompts, listInsights } from "@/lib/repositories";

export default async function InsightsPage() {
  const [prompts, insights] = await Promise.all([listAnalystPrompts(), listInsights()]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Insights Analyst"
          description="Insights are where the analyst publishes what actually matters from the material, rather than repeating file summaries or update logs."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Insights</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Analyst conclusions worth keeping</h2>
            </div>
            <RuntimeModeBadge />
          </div>
          <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
            Keep insights curated and analytical. They should say what matters, what changed, or what deserves attention after the reading is done.
          </p>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
