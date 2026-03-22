import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/utils";
import { ChatMessage } from "@/types/domain";

interface WorkspaceThreadProps {
  items: ChatMessage[];
}

export function WorkspaceThread({ items }: WorkspaceThreadProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={item.author === "Analyst" ? "rounded-[1.5rem] border border-border/80 bg-card/95 px-5 py-5" : "rounded-[1.5rem] border border-transparent bg-accent/70 px-5 py-5"}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant={item.author === "Analyst" ? "accent" : "default"}>{item.author}</Badge>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {formatDisplayDate(item.createdAt)}
            </p>
          </div>
          <p className="mt-4 max-w-reading text-sm leading-8 text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
