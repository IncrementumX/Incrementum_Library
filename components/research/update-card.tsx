import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate } from "@/lib/utils";
import { ResearchUpdate } from "@/types/domain";

interface UpdateCardProps {
  update: ResearchUpdate;
}

const impactVariant = {
  strengthens: "success",
  weakens: "danger",
  mixed: "warning"
} as const;

export function UpdateCard({ update }: UpdateCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant={impactVariant[update.thesisImpact]}>{update.thesisImpact}</Badge>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {formatDisplayDate(update.happenedAt)}
          </p>
        </div>
        <CardTitle>{update.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">What Changed</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{update.whatChanged}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Why It Matters</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{update.whyItMatters}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Analyst View</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{update.analystView}</p>
        </div>
      </CardContent>
    </Card>
  );
}
