import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/utils";
import { Insight } from "@/types/domain";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className="rounded-[1.6rem] border border-border/80 bg-card/90 px-5 py-5 shadow-whisper">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="accent">Insight</Badge>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatDisplayDate(insight.publishedAt)}</p>
      </div>
      <h3 className="mt-4 font-serif text-2xl text-foreground">{insight.title}</h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{insight.summary}</p>
      <div className="mt-5 rounded-[1.25rem] bg-accent/70 px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">What Matters</p>
        <p className="mt-2 text-sm leading-7 text-foreground">{insight.whatMatters}</p>
      </div>
      {insight.relatedResearchId ? (
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Related research · <Link href="/research" className="text-foreground">open in research</Link>
        </p>
      ) : null}
    </article>
  );
}
