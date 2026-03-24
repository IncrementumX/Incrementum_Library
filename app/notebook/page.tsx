import { Plus } from "lucide-react";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ChatComposer } from "@/components/notebook/chat-composer";
import { ChatThreadList } from "@/components/notebook/chat-thread-list";
import { WorkspaceThread } from "@/components/research/workspace-thread";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAnalystPrompts, listChatThreads, getMessagesForThread } from "@/lib/repositories";

export default async function NotebookPage() {
  const [prompts, threads] = await Promise.all([listAnalystPrompts(), listChatThreads()]);
  const activeThread = threads[0];
  const messages = activeThread ? await getMessagesForThread(activeThread.id) : [];

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Notebook Analyst"
          description="Treat Notebook as ongoing conversation, not as a dead note archive. Each thread can stay attached to an asset or broader theme."
        />
      }
    >
      <div className="space-y-8">
        <section className="flex flex-col gap-5 rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Notebook</p>
              <RuntimeModeBadge />
            </div>
            <h2 className="mt-4 font-serif text-4xl text-foreground">Analyst threads</h2>
            <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
              Create chats, continue them over time, and keep each one tied to an asset context when needed.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </section>

        {activeThread ? (
          <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Chats</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatThreadList threads={threads} activeThreadId={activeThread.id} />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent">{activeThread.contextLabel}</Badge>
                    <Badge>{activeThread.contextType}</Badge>
                  </div>
                  <CardTitle className="text-3xl">{activeThread.title}</CardTitle>
                  <p className="text-sm leading-7 text-muted-foreground">{activeThread.preview}</p>
                </CardHeader>
                <CardContent>
                  <WorkspaceThread items={messages} />
                </CardContent>
              </Card>

              <ChatComposer contextLabel={activeThread.contextLabel} />
            </div>
          </section>
        ) : (
          <Card>
            <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
              No threads yet. Create the first analyst conversation and attach it to an asset or theme.
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
