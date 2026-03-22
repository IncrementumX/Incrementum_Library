import { Badge } from "@/components/ui/badge";
import { LibraryFile } from "@/types/domain";

interface ProcessingStateBadgeProps {
  status: LibraryFile["processingStatus"];
}

const statusVariant = {
  idle: "default",
  uploading: "warning",
  uploaded: "accent",
  processing: "warning",
  "summary-ready": "success",
  failed: "danger"
} as const;

export function ProcessingStateBadge({ status }: ProcessingStateBadgeProps) {
  return <Badge variant={statusVariant[status]}>{status.replace("-", " ")}</Badge>;
}
