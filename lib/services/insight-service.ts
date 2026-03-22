import { createInsight } from "@/lib/repositories/insights";
import { LibraryFile } from "@/types/domain";

export async function generateInsightFromFile(file: LibraryFile) {
  return createInsight({
    title: `${file.title}: analyst insight`,
    summary: file.summary,
    whatMatters:
      file.analystInterpretation || "This file has been staged for analyst review, but the final insight still needs to be confirmed.",
    relatedFileId: file.id,
    relatedResearchId: file.linkedResearchIds[0]
  });
}
