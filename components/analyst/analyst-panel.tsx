import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AnalystPrompt } from "@/types/domain";

interface AnalystPanelProps {
  title?: string;
  description?: string;
  prompts: AnalystPrompt[];
}

export function AnalystPanel({
  title = "Analyst",
  description = "The analyst works on top of the materials and threads you provide.",
  prompts
}: AnalystPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="accent" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          Analyst
        </Badge>
        <h3 className="mt-4 font-serif text-2xl text-foreground">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-[1.5rem] border border-border/80 bg-card/85 p-4 shadow-whisper">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Ready to work on</p>
        <div className="mt-4 space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="rounded-[1.1rem] bg-accent/70 px-4 py-4">
              <p className="text-sm font-medium text-foreground">{prompt.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{prompt.body}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{prompt.actionLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
