import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/utils";
import { ChatThread } from "@/types/domain";

interface ChatThreadListProps {
  threads: ChatThread[];
  activeThreadId: string;
}

export function ChatThreadList({ threads, activeThreadId }: ChatThreadListProps) {
  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={thread.id === activeThreadId ? "rounded-[1.4rem] border border-border/80 bg-card/95 px-4 py-4 shadow-whisper" : "rounded-[1.4rem] border border-border/60 bg-card/70 px-4 py-4"}
        >
          <div className="flex items-center justify-between gap-3">
            <Badge variant="accent">{thread.contextLabel}</Badge>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDisplayDate(thread.updatedAt)}</p>
          </div>
          <p className="mt-3 font-medium text-foreground">{thread.title}</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{thread.preview}</p>
        </div>
      ))}
    </div>
  );
}
