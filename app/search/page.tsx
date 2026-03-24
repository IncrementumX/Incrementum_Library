import { SearchIcon } from "lucide-react";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listAnalystPrompts, listAssets, listChatThreads, listFiles } from "@/lib/repositories";

export default async function SearchPage() {
  const [prompts, libraryFiles, assets, chatThreads] = await Promise.all([
    listAnalystPrompts(),
    listFiles(),
    listAssets(),
    listChatThreads()
  ]);

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Search Analyst"
          description="Search stays intentionally light in v1, but the shape is here for a context-aware retrieval layer later."
        />
      }
    >
      <div className="space-y-8">
        <section className="rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Search</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground">Find files, assets, and threads</h2>
            </div>
            <RuntimeModeBadge />
          </div>
          <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
            Keep this as retrieval for your workspace, not a generic discovery feed.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Search workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-11" placeholder="Search files, assets, chats, or insights..." />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[1.4rem] bg-accent/70 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Files</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {libraryFiles.map((file) => (
                    <Badge key={file.id}>{file.title}</Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.4rem] bg-accent/70 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Assets</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {assets.map((item) => (
                    <Badge key={item.id} variant="accent">
                      {item.title}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.4rem] bg-accent/70 p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Threads</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chatThreads.map((thread) => (
                    <Badge key={thread.id}>{thread.title}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
