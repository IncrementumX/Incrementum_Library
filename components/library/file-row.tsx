import Link from "next/link";

import { ProcessingStateBadge } from "@/components/library/processing-state-badge";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/utils";
import { LibraryFile } from "@/types/domain";

interface FileRowProps {
  file: LibraryFile;
}

export function FileRow({ file }: FileRowProps) {
  return (
    <Link
      href={`/library/${file.slug}`}
      className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-card/80 px-4 py-4 transition-colors hover:bg-accent/60 md:grid-cols-[1.5fr_0.7fr_0.8fr]"
    >
      <div>
        <p className="font-medium text-foreground">{file.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{file.author}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge>{file.kind}</Badge>
        <Badge variant={file.summaryStatus === "processed" ? "success" : file.summaryStatus === "needs-review" ? "warning" : "default"}>
          {file.summaryStatus.replace("-", " ")}
        </Badge>
        <ProcessingStateBadge status={file.processingStatus} />
      </div>
      <p className="text-sm text-muted-foreground md:text-right">{formatDisplayDate(file.addedAt)}</p>
    </Link>
  );
}
