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
  getInsightsForResearch,
  getMessagesForThread,
  getThreadForResearch,
  listAnalystPrompts,
  listFiles,
  listResearchItems,
  listResearchUpdates
} from "@/lib/repositories";
import { formatDisplayDate } from "@/lib/utils";
import { ResearchItem } from "@/types/domain";

interface ResearchDetailViewProps {
  item: ResearchItem;
}

export async function ResearchDetailView({ item }: ResearchDetailViewProps) {
  const [prompts, allFiles, itemUpdates, thread, relatedInsights, allResearchItems] = await Promise.all([
    listAnalystPrompts(),
    listFiles(),
    listResearchUpdates(item.id),
    getThreadForResearch(item.id),
    getInsightsForResearch(item.id),
    listResearchItems()
  ]);
  const linkedFiles = allFiles.filter((file) => item.linkedFileIds.includes(file.id));
  const threadItems = thread ? await getMessagesForThread(thread.id) : [];

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          title={`${item.title} Analyst`}
          description="This research item is treated as a living working thread. The analyst can refine the thesis, challenge it, and keep continuity over time."
          prompts={prompts}
        />
      }
    >
      <article className="mx-auto max-w-5xl space-y-8">
        <header className="rounded-[2rem] border border-border/80 bg-card/92 px-6 py-8 shadow-panel md:px-8 md:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{item.categoryLabel}</Badge>
            <Badge variant={item.status === "active" ? "success" : "default"}>{item.status}</Badge>
            <RuntimeModeBadge />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-serif text-5xl leading-tight text-foreground">{item.title}</h1>
            <Button asChild variant="outline">
              <Link href={`/research/${item.type === "sector" ? "sectors" : "assets"}/${item.slug}/edit`}>Edit item</Link>
            </Button>
          </div>
        </header>

        <SectionJumpNav />

        <section id="summary" className="rounded-[2rem] border border-border/80 bg-card/96 px-6 py-8 shadow-panel md:px-8 md:py-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Executive Summary</p>
          <h2 className="mt-5 max-w-reading font-serif text-4xl leading-tight text-foreground md:text-[2.85rem]">
            {item.executiveSummary}
          </h2>
        </section>

        <section id="pillars" className="space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Key Pillars / Core View</p>
            <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">{item.coreView}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {item.keyPillars.map((pillar) => (
              <Card key={pillar}>
                <CardContent className="p-6">
                  <p className="font-serif text-2xl leading-tight text-foreground">{pillar}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="sources" className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Sources</p>
            <p className="mt-3 max-w-reading text-sm leading-7 text-muted-foreground">
              Files linked into this thesis thread. Add more materials here before expecting the analyst to deepen the view.
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
                  No files linked yet. Add materials in Library and connect them to this research item.
                </CardContent>
              </Card>
            )}
            <FileLinkManager
              fileId={linkedFiles[0]?.id ?? ""}
              linkedResearchLabels={linkedFiles[0] ? allResearchItems.filter((entry) => linkedFiles[0].linkedResearchIds.includes(entry.id)).map((entry) => entry.title) : []}
              researchItems={allResearchItems}
            />
            <ResearchLinkManager
              researchItemId={item.id}
              linkedFileTitles={linkedFiles.map((file) => file.title)}
              availableFiles={allFiles}
            />
          </div>
        </section>

        <section id="updates" className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Updates</p>
            <p className="mt-3 max-w-reading text-sm leading-7 text-muted-foreground">
              Updates remain thesis-aware: what changed, why it matters, and whether the current view is stronger or weaker.
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
              This is the working relationship around the thesis: your questions, the analyst&apos;s responses, and ongoing iteration.
            </p>
          </div>
          {threadItems.length ? (
            <WorkspaceThread items={threadItems} />
          ) : (
            <Card>
              <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                No thread yet. Start a tagged chat in Notebook or link a new thread to this research item.
              </CardContent>
            </Card>
          )}
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
