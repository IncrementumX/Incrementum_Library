import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatComposerProps {
  contextLabel?: string;
}

export function ChatComposer({ contextLabel }: ChatComposerProps) {
  return (
    <div className="rounded-[1.5rem] border border-border/80 bg-card/90 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {contextLabel ? `New message · ${contextLabel}` : "New message"}
      </p>
      <Textarea
        className="mt-4 min-h-[120px] border-0 bg-accent/50 focus-visible:ring-0"
        placeholder="Ask the analyst a question, leave a note, or continue the thread..."
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Context tagging and persistence can attach this to research later.</p>
        <Button variant="outline">Send</Button>
      </div>
    </div>
  );
}
