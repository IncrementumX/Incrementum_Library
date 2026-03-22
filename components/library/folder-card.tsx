import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { LibraryFolder } from "@/types/domain";

interface FolderCardProps {
  folder: LibraryFolder;
  fileCount: number;
}

export function FolderCard({ folder, fileCount }: FolderCardProps) {
  return (
    <Link
      href={`#${folder.slug}`}
      className="block rounded-[1.4rem] border border-border/80 bg-card/90 px-5 py-5 transition-colors hover:bg-accent/60"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-2xl text-foreground">{folder.name}</p>
        <Badge variant="accent">{fileCount} files</Badge>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{folder.description}</p>
    </Link>
  );
}
