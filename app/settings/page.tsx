import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppConfig } from "@/lib/config/app-config";
import { listAnalystPrompts } from "@/lib/repositories";
import { persistencePlan } from "@/lib/persistence-plan";

const settingsSections = [
  {
    title: "Workspace Preferences",
    description: "Reserved for reading density, editor comfort, and how much analyst guidance should be visible."
  },
  {
    title: "Research Workflow",
    description: "Reserved for linking files to research items, chat context defaults, and how updates should be proposed."
  },
  {
    title: "Analyst Behavior",
    description: "Reserved for tone, skepticism, drafting style, and how strongly the analyst should push back."
  }
];

export default async function SettingsPage() {
  const config = getAppConfig();
  const prompts = await listAnalystPrompts();

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Settings Analyst"
          description="Settings remains quiet in v1, but this page now also prepares the project for future persistence and public deployment."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Settings</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Workspace controls</h2>
            </div>
            <RuntimeModeBadge />
          </div>
          <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
            Keep controls focused on how you work, how the analyst behaves, and how the workspace will persist once it goes public.
          </p>
        </section>

        <div className="grid gap-5 xl:grid-cols-3">
          {settingsSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

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
            <div className="grid gap-3 md:grid-cols-2">
              {persistencePlan.pieces.map((piece) => (
                <div key={piece} className="rounded-[1.2rem] bg-accent/70 px-4 py-4 text-sm leading-7 text-foreground">
                  {piece}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
