import { getAppConfig } from "@/lib/config/app-config";
import { getActiveInvestmentFramework } from "@/lib/repositories/frameworks";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FileSummaryResult, LibraryFile } from "@/types/domain";

interface GenerateFileSummaryInput {
  title: string;
  author?: string;
  kind: string;
  extractedText?: string;
}

export async function generateFileSummary(input: GenerateFileSummaryInput): Promise<FileSummaryResult> {
  const config = getAppConfig();
  const framework = await getActiveInvestmentFramework();
  const excerpt = input.extractedText?.slice(0, 500) ?? "";
  const excerptList = excerpt ? [excerpt] : [];

  if (!config.features.openAIEnabled) {
    return {
      mode: "fallback",
      summary: framework
        ? `${input.title} has been staged for analyst review under the active framework "${framework.name}". AI generation is not configured yet, so this file still needs either a live provider or a manual pass.`
        : `Summary generation is ready, but no AI credentials are configured yet. ${input.title} has been staged for analyst review.`,
      keyTakeaways: [
        `${input.kind} uploaded and ready for processing.`,
        framework ? `The active framework will guide the first real draft once AI credentials are configured.` : "Analyst summary is pending once AI credentials are configured or a manual review is added.",
        "This file can already be linked into research and threads."
      ],
      excerpts: excerptList,
      analystInterpretation:
        "The file workflow is prepared, but the analyst cannot generate a grounded summary until AI access is configured or manual review is completed."
    };
  }

  return {
    mode: "generated",
    summary: framework
      ? `${input.title} has been queued for a grounded analyst summary using the configured AI model and the active framework "${framework.name}".`
      : `${input.title} has been queued for a grounded analyst summary using the configured AI model.`,
    keyTakeaways: [
      "The file has enough structure to enter the processing pipeline.",
      excerpt ? `A preliminary excerpt is available: ${excerpt}` : "Text extraction still needs to be completed.",
      "The next step is to save the generated summary back onto the file record."
    ],
    excerpts: excerptList,
    analystInterpretation:
      "This is the service boundary where the analyst should synthesize the uploaded material, rather than inventing context that was never provided."
  };
}

export async function saveGeneratedSummary(
  file: LibraryFile,
  summary: FileSummaryResult
) {
  const resolvedFile = {
    ...file,
    summaryStatus: summary.mode === "generated" ? "processed" : "needs-review",
    processingStatus: summary.mode === "generated" ? "summary-ready" : "processing",
    summary: summary.summary,
    keyTakeaways: summary.keyTakeaways,
    excerpts: summary.excerpts ?? file.excerpts,
    analystInterpretation: summary.analystInterpretation
  };

  if (getAppConfig().features.supabaseEnabled) {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("files")
      .update({
        summary_status: resolvedFile.summaryStatus,
        processing_status: resolvedFile.processingStatus,
        summary: resolvedFile.summary,
        key_takeaways: resolvedFile.keyTakeaways,
        excerpts: resolvedFile.excerpts,
        analyst_interpretation: resolvedFile.analystInterpretation
      })
      .eq("id", file.id);

    if (error) {
      throw error;
    }
  }

  return resolvedFile;
}
