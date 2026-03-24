import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Asset } from "@/types/domain";

interface ResearchItemCardProps {
  item: Asset;
}

export function ResearchItemCard({ item }: ResearchItemCardProps) {
  return (
    <Link
      href={`/research/assets/${item.slug}`}
      className="block rounded-[1.4rem] border border-border/80 bg-card/90 px-5 py-5 transition-colors hover:bg-accent/60"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{item.assetType ?? "Asset"}</Badge>
        <Badge variant={item.status === "active" ? "success" : "default"}>{item.status}</Badge>
      </div>
      <p className="mt-4 font-serif text-2xl text-foreground">{item.title}</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.executiveSummary}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {item.linkedFileIds.length} linked file{item.linkedFileIds.length === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
