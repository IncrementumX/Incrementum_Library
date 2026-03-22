import { seedResearchItems, seedResearchUpdates } from "@/lib/mock/seed-data";
import { runWithDataFallback } from "@/lib/repositories/runtime";
import { createId, slugify } from "@/lib/repositories/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CreateResearchItemInput, ResearchItem, UpdateResearchItemInput } from "@/types/domain";

type ResearchRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  category_label: string;
  status: string;
  executive_summary: string;
  key_pillars: string[] | null;
  core_view: string;
  primary_thread_id: string | null;
  file_research_links?: Array<{ file_id: string }>;
};

function mapResearch(row: ResearchRow): ResearchItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type as ResearchItem["type"],
    categoryLabel: row.category_label,
    status: row.status as ResearchItem["status"],
    executiveSummary: row.executive_summary,
    keyPillars: row.key_pillars ?? [],
    coreView: row.core_view,
    linkedFileIds: row.file_research_links?.map((link) => link.file_id) ?? [],
    updateIds: seedResearchUpdates.filter((update) => update.researchItemId === row.id).map((update) => update.id),
    primaryThreadId: row.primary_thread_id ?? undefined
  };
}

export async function listResearchItems() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase
      .from("research_items")
      .select("*, file_research_links(file_id)")
      .order("title");

    if (error) throw error;
    return (data as ResearchRow[] | null)?.map(mapResearch) ?? [];
  }, async () => seedResearchItems);
}

export async function listResearchByType(type: ResearchItem["type"]) {
  const items = await listResearchItems();
  return items.filter((item) => item.type === type);
}

export async function getResearchItemBySlug(slug: string, type: ResearchItem["type"]) {
  const items = await listResearchItems();
  return items.find((item) => item.slug === slug && item.type === type);
}

export async function createResearchItem(input: CreateResearchItemInput) {
  const normalizedType = input.type === "company" ? "asset" : input.type;
  const categoryLabel = input.type === "company" ? "Company" : normalizedType === "asset" ? "Asset" : "Sector";

  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const payload = {
      slug: slugify(input.title),
      title: input.title,
      type: normalizedType,
      category_label: categoryLabel,
      status: "seeded",
      executive_summary: input.executiveSummary ?? "Working thesis not yet drafted.",
      key_pillars: [],
      core_view: input.coreView ?? "Waiting for source material and iteration with the analyst."
    };

    const { data, error } = await supabase.from("research_items").insert(payload).select("*").single();
    if (error) throw error;
    return mapResearch(data as ResearchRow);
  }, async () => ({
    id: createId("research"),
    slug: slugify(input.title),
    title: input.title,
    type: normalizedType,
    categoryLabel,
    status: "seeded" as const,
    executiveSummary: input.executiveSummary ?? "Working thesis not yet drafted.",
    keyPillars: [],
    coreView: input.coreView ?? "Waiting for source material and iteration with the analyst.",
    linkedFileIds: [],
    updateIds: []
  }));
}

export async function updateResearchItem(researchItemId: string, input: UpdateResearchItemInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const payload: Record<string, unknown> = {};
    if (input.title !== undefined) payload.title = input.title;
    if (input.executiveSummary !== undefined) payload.executive_summary = input.executiveSummary;
    if (input.coreView !== undefined) payload.core_view = input.coreView;
    if (input.keyPillars !== undefined) payload.key_pillars = input.keyPillars;

    const { data, error } = await supabase
      .from("research_items")
      .update(payload)
      .eq("id", researchItemId)
      .select("*, file_research_links(file_id)")
      .single();

    if (error) throw error;
    return mapResearch(data as ResearchRow);
  }, async () => {
    const item = seedResearchItems.find((entry) => entry.id === researchItemId);
    if (!item) {
      throw new Error("Research item not found");
    }

    return {
      ...item,
      title: input.title ?? item.title,
      executiveSummary: input.executiveSummary ?? item.executiveSummary,
      coreView: input.coreView ?? item.coreView,
      keyPillars: input.keyPillars ?? item.keyPillars
    };
  });
}

export async function listResearchUpdates(researchItemId: string) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase
      .from("research_updates")
      .select("*")
      .eq("research_item_id", researchItemId)
      .order("happened_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: String(row.id),
      researchItemId: String(row.research_item_id),
      title: String(row.title),
      happenedAt: String(row.happened_at),
      whatChanged: String(row.what_changed),
      whyItMatters: String(row.why_it_matters),
      thesisImpact: row.thesis_impact as "strengthens" | "weakens" | "mixed",
      analystView: String(row.analyst_view)
    }));
  }, async () => seedResearchUpdates.filter((update) => update.researchItemId === researchItemId));
}
