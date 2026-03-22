import { seedInsights } from "@/lib/mock/seed-data";
import { runWithDataFallback } from "@/lib/repositories/runtime";
import { createId } from "@/lib/repositories/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CreateInsightInput } from "@/types/domain";

export async function listInsights() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase.from("insights").select("*").order("published_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      publishedAt: String(row.published_at),
      summary: String(row.summary),
      whatMatters: String(row.what_matters),
      relatedFileId: row.related_file_id ? String(row.related_file_id) : undefined,
      relatedResearchId: row.related_research_id ? String(row.related_research_id) : undefined,
      relatedThreadId: row.related_thread_id ? String(row.related_thread_id) : undefined,
      reviewStatus: (row.review_status as "draft" | "ready" | "reviewed" | null) ?? undefined
    }));
  }, async () => seedInsights);
}

export async function getInsightsForResearch(researchItemId: string) {
  const insights = await listInsights();
  return insights.filter((insight) => insight.relatedResearchId === researchItemId);
}

export async function createInsight(input: CreateInsightInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const payload = {
      title: input.title,
      published_at: new Date().toISOString(),
      summary: input.summary,
      what_matters: input.whatMatters,
      related_file_id: input.relatedFileId ?? null,
      related_research_id: input.relatedResearchId ?? null,
      related_thread_id: input.relatedThreadId ?? null,
      review_status: "draft"
    };

    const { data, error } = await supabase.from("insights").insert(payload).select("*").single();
    if (error) throw error;
    return {
      id: String(data.id),
      title: String(data.title),
      publishedAt: String(data.published_at),
      summary: String(data.summary),
      whatMatters: String(data.what_matters),
      relatedFileId: data.related_file_id ? String(data.related_file_id) : undefined,
      relatedResearchId: data.related_research_id ? String(data.related_research_id) : undefined,
      relatedThreadId: data.related_thread_id ? String(data.related_thread_id) : undefined,
      reviewStatus: (data.review_status as "draft" | "ready" | "reviewed" | null) ?? undefined
    };
  }, async () => ({
    id: createId("insight"),
    title: input.title,
    publishedAt: new Date().toISOString(),
    summary: input.summary,
    whatMatters: input.whatMatters,
    relatedFileId: input.relatedFileId,
    relatedResearchId: input.relatedResearchId,
    relatedThreadId: input.relatedThreadId,
    reviewStatus: "draft" as const
  }));
}
