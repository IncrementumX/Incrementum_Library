import Link from "next/link";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { InsightWorkflowCard } from "@/components/insights/insight-workflow-card";
import { AppShell } from "@/components/layout/app-shell";
import { ChatComposer } from "@/components/notebook/chat-composer";
import { FileLinkManager } from "@/components/research/file-link-manager";
import { ResearchLinkManager } from "@/components/research/research-link-manager";
import { SectionJumpNav } from "@/components/research/section-jump-nav";
import { UpdateCard } from "@/components/research/update-card";
import { WorkspaceThread } from "@/components/research/workspace-thread";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getActiveInvestmentFramework,
  getInsightsForAsset,
  getMessagesForThread,
  getThreadForAsset,
  listAnalystPrompts,
  listAssetUpdates,
  listAssets,
  listFiles
} from "@/lib/repositories";
import { formatDisplayDate } from "@/lib/utils";
import { Asset } from "@/types/domain";

interface ResearchDetailViewProps {
  item: Asset;
}

export async function ResearchDetailView({ item }: ResearchDetailViewProps) {
  const [prompts, allFiles, itemUpdates, thread, relatedInsights, allAssets, activeFramework] = await Promise.all([
    listAnalystPrompts(),
    listFiles(),
    listAssetUpdates(item.id),
    getThreadForAsset(item.id),
    getInsightsForAsset(item.id),
    listAssets(),
    getActiveInvestmentFramework()
  ]);
  const linkedFiles = allFiles.filter((file) => item.linkedFileIds.includes(file.id));
  const threadItems = thread ? await getMessagesForThread(thread.id) : [];

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          title={`${item.title} Analyst`}
          description="This asset is a living working thread. The analyst should stay grounded in linked files, apply the active framework, and leave every important output editable by you."
          prompts={prompts}
        />
      }
    >
      <article className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-border/80 bg-card/92 px-6 py-8 shadow-panel md:px-8 md:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{item.assetType ?? "Asset"}</Badge>
            {item.symbol ? <Badge variant="accent">{item.symbol}</Badge> : null}
            <Badge variant={item.status === "active" ? "success" : "default"}>{item.status}</Badge>
            <RuntimeModeBadge />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-5xl leading-tight text-foreground">{item.title}</h1>
              {activeFramework ? (
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Active framework: <span className="font-medium text-foreground">{activeFramework.name}</span>
                </p>
              ) : null}
            </div>
            <Button asChild variant="outline">
              <Link href={`/research/assets/${item.slug}/edit`}>Edit asset</Link>
            </Button>
          </div>
        </header>

        <SectionJumpNav />

        <section id="summary" className="rounded-[2rem] border border-border/80 bg-card/96 px-6 py-8 shadow-panel md:px-8 md:py-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Executive Summary</p>
          <h2 className="mt-5 max-w-reading font-serif text-4xl leading-tight text-foreground md:text-[2.85rem]">
            {item.executiveSummary}
          </h2>
          <p className="mt-5 max-w-reading text-sm leading-8 text-muted-foreground">{item.thesis}</p>
        </section>

        <section id="pillars" className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{item.whatMatters}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Key Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{item.keyRisks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Counterview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">{item.counterview}</p>
            </CardContent>
          </Card>
        </section>

        <section id="sources" className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Sources</p>
            <p className="mt-3 max-w-reading text-sm leading-7 text-muted-foreground">
              Linked files ground the drafts on this asset. Add source material before expecting the analyst to improve the thread.
            </p>
          </div>
          <div className="grid gap-4">
            {linkedFiles.length ? (
              linkedFiles.map((file) => (
                <Card key={file.id}>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{file.kind}</Badge>
                        <Badge variant={file.processingStatus === "summary-ready" ? "success" : "warning"}>
                          {file.processingStatus.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {formatDisplayDate(file.publishedAt)}
                      </p>
                    </div>
                    <CardTitle>{file.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-7 text-muted-foreground">{file.summary}</p>
                    <div className="rounded-[1.2rem] bg-accent/70 px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">What matters</p>
                      <p className="mt-2 text-sm leading-7 text-foreground">{file.keyTakeaways[0]}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                  No files linked yet. Add materials in Library and connect them to this asset before drafting heavily.
                </CardContent>
              </Card>
            )}
            <FileLinkManager
              fileId={linkedFiles[0]?.id ?? ""}
              linkedAssetLabels={linkedFiles[0] ? allAssets.filter((entry) => linkedFiles[0].linkedAssetIds.includes(entry.id)).map((entry) => entry.title) : []}
              assets={allAssets}
            />
            <ResearchLinkManager assetId={item.id} linkedFileTitles={linkedFiles.map((file) => file.title)} availableFiles={allFiles} />
          </div>
        </section>

        <section id="updates" className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Updates</p>
            <p className="mt-3 max-w-reading text-sm leading-7 text-muted-foreground">
              Updates stay thesis-aware: what changed, why it matters, and whether the current view is stronger or weaker.
            </p>
          </div>
          <div className="space-y-4">
            {itemUpdates.length ? (
              itemUpdates.map((update) => <UpdateCard key={update.id} update={update} />)
            ) : (
              <Card>
                <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                  No updates yet. Use this section for thesis revisions, not generic activity logging.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section id="thread" className="space-y-5 pb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Thread / Notebook</p>
            <p className="mt-3 max-w-reading text-sm leading-7 text-muted-foreground">
              This is the working relationship around the asset: your questions, the analyst&apos;s responses, and ongoing iteration.
            </p>
          </div>
          {threadItems.length ? (
            <WorkspaceThread items={threadItems} />
          ) : (
            <Card>
              <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                No thread yet. Start a tagged chat in Notebook or link a new thread to this asset.
              </CardContent>
            </Card>
          )}
          {item.notes ? (
            <div className="rounded-[1.5rem] border border-border/80 bg-card/90 px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Notes</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.notes}</p>
            </div>
          ) : null}
          {relatedInsights.length ? (
            <div className="rounded-[1.5rem] border border-border/80 bg-card/90 px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Related insight</p>
              <p className="mt-3 font-serif text-2xl text-foreground">{relatedInsights[0].title}</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{relatedInsights[0].whatMatters}</p>
            </div>
          ) : null}
          {linkedFiles[0] ? <InsightWorkflowCard fileId={linkedFiles[0].id} /> : null}
          <ChatComposer contextLabel={item.title} />
        </section>
      </article>
    </AppShell>
  );
}
