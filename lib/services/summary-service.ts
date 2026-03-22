import { getAppConfig } from "@/lib/config/app-config";
import { FileSummaryResult, LibraryFile } from "@/types/domain";

interface GenerateFileSummaryInput {
  title: string;
  author?: string;
  kind: string;
  extractedText?: string;
}

export async function generateFileSummary(input: GenerateFileSummaryInput): Promise<FileSummaryResult> {
  const config = getAppConfig();

  if (!config.features.openAIEnabled) {
    return {
      mode: "fallback",
      summary: `Summary generation is ready, but no AI credentials are configured yet. ${input.title} has been staged for analyst review.`,
      keyTakeaways: [
        `${input.kind} uploaded and ready for processing.`,
        "Analyst summary is pending once AI credentials are configured or a manual review is added.",
        "This file can already be linked into research and threads."
      ],
      analystInterpretation:
        "The file workflow is prepared, but the analyst cannot generate a grounded summary until AI access is configured or manual review is completed."
    };
  }

  const excerpt = input.extractedText?.slice(0, 500) ?? "";

  return {
    mode: "generated",
    summary: `${input.title} has been queued for a grounded analyst summary using the configured AI model.`,
    keyTakeaways: [
      "The file has enough structure to enter the processing pipeline.",
      excerpt ? `A preliminary excerpt is available: ${excerpt}` : "Text extraction still needs to be completed.",
      "The next step is to save the generated summary back onto the file record."
    ],
    analystInterpretation:
      "This is the service boundary where the analyst should synthesize the uploaded material, rather than inventing context that was never provided."
  };
}

export async function saveGeneratedSummary(
  file: LibraryFile,
  summary: FileSummaryResult
) {
  return {
    ...file,
    summaryStatus: summary.mode === "generated" ? "processed" : "needs-review",
    processingStatus: summary.mode === "generated" ? "summary-ready" : "processing",
    summary: summary.summary,
    keyTakeaways: summary.keyTakeaways,
    analystInterpretation: summary.analystInterpretation
  };
}
