import Link from "next/link";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { InsightCard } from "@/components/insights/insight-card";
import { AppShell } from "@/components/layout/app-shell";
import { ResearchItemCard } from "@/components/research/research-item-card";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listAnalystPrompts,
  listAssets,
  listChatThreads,
  listFiles,
  listFolders,
  listInsights
} from "@/lib/repositories";

export default async function HomePage() {
  const [prompts, files, folders, assets, threads, insights] = await Promise.all([
    listAnalystPrompts(),
    listFiles(),
    listFolders(),
    listAssets(),
    listChatThreads(),
    listInsights()
  ]);

  const recentFiles = files.slice(0, 3);
  const activeResearch = assets.slice(0, 3);
  const recentChats = threads.slice(0, 3);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Resident Analyst"
          description="The analyst is ready to work on your files, your research threads, and the questions you actually seed into the workspace."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Home</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Workspace</h2>
            </div>
            <RuntimeModeBadge />
          </div>
          <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
            Continue from your files, active research threads, and current analyst conversations.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Library</p>
                <CardTitle className="mt-3 text-3xl">Recent files</CardTitle>
              </div>
              <Button asChild variant="outline">
                <Link href="/library">Open Library</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentFiles.map((file) => (
                <Link
                  key={file.id}
                  href={`/library/${file.slug}`}
                  className="block rounded-[1.2rem] border border-border/70 bg-card/80 px-4 py-4 transition-colors hover:bg-accent/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{file.title}</p>
                    <Badge variant="accent">{file.processingStatus.replace("-", " ")}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{file.summary}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Control layer</p>
              <CardTitle className="mt-3 text-3xl">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {folders.map((folder) => (
                <div key={folder.id} className="rounded-[1.2rem] bg-accent/65 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{folder.name}</p>
                    <Badge>{files.filter((file) => file.folderId === folder.id).length} files</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{folder.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader className="space-y-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Research</p>
              <CardTitle className="mt-3 text-3xl">Active threads</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {activeResearch.map((item) => (
                <ResearchItemCard key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Notebook</p>
              <CardTitle className="mt-3 text-3xl">Recent chats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentChats.map((thread) => (
                <Link
                  key={thread.id}
                  href="/notebook"
                  className="block rounded-[1.2rem] border border-border/70 bg-card/80 px-4 py-4 transition-colors hover:bg-accent/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{thread.title}</p>
                    <Badge variant="accent">{thread.contextLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{thread.preview}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Insights</p>
            <h3 className="mt-3 font-serif text-3xl text-foreground">What currently matters</h3>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
