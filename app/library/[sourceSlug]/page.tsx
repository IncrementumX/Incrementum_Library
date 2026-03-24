import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { InsightWorkflowCard } from "@/components/insights/insight-workflow-card";
import { AppShell } from "@/components/layout/app-shell";
import { ProcessingStateBadge } from "@/components/library/processing-state-badge";
import { FileLinkManager } from "@/components/research/file-link-manager";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getActiveInvestmentFramework,
  getFileBySlug,
  getFolderById,
  listAnalystPrompts,
  listAssets
} from "@/lib/repositories";
import { formatDisplayDate } from "@/lib/utils";

export default async function SourceDetailPage({
  params
}: {
  params: Promise<{ sourceSlug: string }>;
}) {
  const { sourceSlug } = await params;
  const [prompts, file, allAssets, activeFramework] = await Promise.all([
    listAnalystPrompts(),
    getFileBySlug(sourceSlug),
    listAssets(),
    getActiveInvestmentFramework()
  ]);

  if (!file) {
    notFound();
  }

  const folder = await getFolderById(file.folderId);
  const linkedAssets = allAssets.filter((item) => file.linkedAssetIds.includes(item.id));

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          title="File Analyst"
          description="The analyst should interpret what this file changes, not merely summarize it."
          prompts={prompts}
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/92 px-6 py-8 shadow-panel">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{file.kind}</Badge>
            {folder ? <Badge variant="accent">{folder.name}</Badge> : null}
            <ProcessingStateBadge status={file.processingStatus} />
            <RuntimeModeBadge />
          </div>
          <h1 className="mt-5 max-w-reading font-serif text-5xl leading-tight text-foreground">{file.title}</h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            {file.author} · Published {formatDisplayDate(file.publishedAt)} · Added {formatDisplayDate(file.addedAt)}
          </p>
          {file.storagePath ? (
            <div className="mt-5">
              <Link href={`/api/files/${file.id}/download`} className="text-sm font-medium text-foreground underline underline-offset-4">
                Open or download original file
              </Link>
            </div>
          ) : null}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <p className="max-w-reading text-base leading-8 text-muted-foreground">{file.summary}</p>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">What Matters</p>
                <div className="mt-4 space-y-3">
                  {file.keyTakeaways.map((item) => (
                    <div key={item} className="rounded-[1.2rem] bg-accent/70 px-4 py-4 text-sm leading-7 text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Analyst Interpretation</p>
                <p className="mt-3 max-w-reading text-sm leading-8 text-muted-foreground">{file.analystInterpretation}</p>
              </div>

              {activeFramework ? (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Framework Context</p>
                  <p className="mt-3 max-w-reading text-sm leading-8 text-muted-foreground">
                    Active framework: {activeFramework.name}. This file should be evaluated against the active question set and red flags before its conclusions are treated as final.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Excerpts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {file.excerpts.map((excerpt) => (
                  <div key={excerpt} className="rounded-[1.2rem] border border-border/70 bg-card/80 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    {excerpt}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Linked Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {linkedAssets.length ? (
                  linkedAssets.map((item) => (
                    <Link
                      key={item.id}
                      href={`/research/assets/${item.slug}`}
                      className="block rounded-[1.2rem] border border-border/70 bg-card/80 px-4 py-4 transition-colors hover:bg-accent/60"
                    >
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.executiveSummary}</p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[1.2rem] bg-accent/60 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    Not linked yet. This file can be connected to an asset thread later.
                  </div>
                )}
              </CardContent>
            </Card>

            <FileLinkManager fileId={file.id} linkedAssetLabels={linkedAssets.map((item) => item.title)} assets={allAssets} />

            <InsightWorkflowCard fileId={file.id} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
