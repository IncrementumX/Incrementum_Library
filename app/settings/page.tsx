import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { FrameworkForm } from "@/components/system/framework-form";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppConfig } from "@/lib/config/app-config";
import { getActiveInvestmentFramework, listAnalystPrompts } from "@/lib/repositories";
import { persistencePlan } from "@/lib/persistence-plan";

export default async function SettingsPage() {
  const config = getAppConfig();
  const [prompts, activeFramework] = await Promise.all([listAnalystPrompts(), getActiveInvestmentFramework()]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Settings Analyst"
          description="Settings should shape how the analyst works: the active framework, the runtime mode, and the path to persistence."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Settings</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Framework and runtime</h2>
            </div>
            <RuntimeModeBadge />
          </div>
          <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
            Keep controls focused on how the analyst drafts, what questions it asks, and how the workspace will persist once it goes public.
          </p>
        </section>

        <section className="rounded-[1.6rem] border border-border/80 bg-card/90 p-6 shadow-whisper">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Investment Framework</p>
            <h3 className="mt-3 font-serif text-3xl text-foreground">Active framework</h3>
          </div>
          <FrameworkForm framework={activeFramework} />
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Current runtime</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[1.2rem] bg-accent/70 px-4 py-4 text-sm leading-7 text-foreground">
                Data mode: {config.dataMode}
              </div>
              <div className="rounded-[1.2rem] bg-accent/70 px-4 py-4 text-sm leading-7 text-foreground">
                Supabase enabled: {config.features.supabaseEnabled ? "yes" : "no"}
              </div>
              <div className="rounded-[1.2rem] bg-accent/70 px-4 py-4 text-sm leading-7 text-foreground">
                AI summary enabled: {config.features.openAIEnabled ? "yes" : "no"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Persistence next step</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="max-w-reading text-sm leading-8 text-muted-foreground">{persistencePlan.summary}</p>
              <div className="grid gap-3">
                {persistencePlan.pieces.map((piece) => (
                  <div key={piece} className="rounded-[1.2rem] bg-accent/70 px-4 py-4 text-sm leading-7 text-foreground">
                    {piece}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
