import { seedAssets, seedAssetUpdates } from "@/lib/mock/seed-data";
import { runWithDataFallback } from "@/lib/repositories/runtime";
import { createId, createUniqueSlug } from "@/lib/repositories/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { Asset, AssetDraftField, AssetDraftRecord, AssetUpdate, CreateAssetInput, UpdateAssetInput } from "@/types/domain";

type AssetRow = {
  id: string;
  slug: string;
  title: string;
  symbol: string | null;
  asset_type: string | null;
  status: string;
  thesis: string;
  notes: string;
  primary_thread_id: string | null;
  asset_files?: Array<{ file_id: string }>;
  asset_drafts?: Array<{
    id: string;
    field_key: AssetDraftField;
    generated_content: string;
    edited_content: string | null;
    updated_at: string | null;
  }>;
};

function toDraftRecordMap(records: AssetDraftRecord[]) {
  return records.reduce<Record<AssetDraftField, AssetDraftRecord | undefined>>(
    (accumulator, record) => {
      accumulator[record.field] = record;
      return accumulator;
    },
    {
      executive_summary: undefined,
      what_matters: undefined,
      key_risks: undefined,
      counterview: undefined
    }
  );
}

function resolveDraft(record: AssetDraftRecord | undefined, fallback: string) {
  const generated = record?.generatedContent ?? fallback;
  const edited = record?.editedContent ?? undefined;
  return {
    generated,
    edited,
    resolved: edited ?? generated
  };
}

function mapAsset(row: AssetRow): Asset {
  const rowDrafts: AssetDraftRecord[] =
    row.asset_drafts?.map((draft) => ({
      id: draft.id,
      assetId: row.id,
      field: draft.field_key,
      generatedContent: draft.generated_content,
      editedContent: draft.edited_content ?? undefined,
      updatedAt: draft.updated_at ?? undefined
    })) ?? [];
  const draftMap = toDraftRecordMap(rowDrafts);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    symbol: row.symbol ?? undefined,
    assetType: row.asset_type ?? undefined,
    status: row.status as Asset["status"],
    thesis: row.thesis,
    executiveSummary: resolveDraft(draftMap.executive_summary, "Working draft not yet created.").resolved,
    whatMatters: resolveDraft(draftMap.what_matters, "No grounded what-matters draft yet.").resolved,
    keyRisks: resolveDraft(draftMap.key_risks, "No key-risks draft yet.").resolved,
    counterview: resolveDraft(draftMap.counterview, "No counterview drafted yet.").resolved,
    notes: row.notes,
    linkedFileIds: row.asset_files?.map((link) => link.file_id) ?? [],
    updateIds: seedAssetUpdates.filter((update) => update.assetId === row.id).map((update) => update.id),
    primaryThreadId: row.primary_thread_id ?? undefined,
    drafts: {
      executive_summary: resolveDraft(draftMap.executive_summary, "Working draft not yet created."),
      what_matters: resolveDraft(draftMap.what_matters, "No grounded what-matters draft yet."),
      key_risks: resolveDraft(draftMap.key_risks, "No key-risks draft yet."),
      counterview: resolveDraft(draftMap.counterview, "No counterview drafted yet.")
    }
  };
}

async function upsertAssetDrafts(assetId: string, input: CreateAssetInput | UpdateAssetInput) {
  const supabase = createSupabaseAdminClient();
  const draftPayloads = [
    { field_key: "executive_summary" as const, content: input.executiveSummary },
    { field_key: "what_matters" as const, content: input.whatMatters },
    { field_key: "key_risks" as const, content: input.keyRisks },
    { field_key: "counterview" as const, content: input.counterview }
  ].filter((entry) => entry.content !== undefined);

  if (!draftPayloads.length) {
    return;
  }

  const { error } = await supabase.from("asset_drafts").upsert(
    draftPayloads.map((entry) => ({
      asset_id: assetId,
      field_key: entry.field_key,
      generated_content: String(entry.content ?? ""),
      edited_content: String(entry.content ?? "")
    })),
    { onConflict: "asset_id,field_key" }
  );

  if (error) {
    throw error;
  }
}

export async function listAssets() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("assets")
      .select("*, asset_files(file_id), asset_drafts(id, field_key, generated_content, edited_content, updated_at)")
      .order("title");

    if (error) throw error;
    return (data as AssetRow[] | null)?.map(mapAsset) ?? [];
  }, async () => seedAssets);
}

export async function getAssetBySlug(slug: string) {
  const assets = await listAssets();
  return assets.find((asset) => asset.slug === slug);
}

export async function getAssetById(assetId: string) {
  const assets = await listAssets();
  return assets.find((asset) => asset.id === assetId);
}

export async function createAsset(input: CreateAssetInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    const { finalSlug } = createUniqueSlug(input.title);

    const payload = {
      slug: finalSlug,
      title: input.title,
      symbol: input.symbol?.trim() || null,
      asset_type: input.assetType?.trim() || null,
      status: "seeded",
      thesis: input.thesis?.trim() || "Waiting for linked files and a first grounded draft.",
      notes: input.notes?.trim() || ""
    };

    const { data, error } = await supabase.from("assets").insert(payload).select("*").single();
    if (error) throw error;

    await upsertAssetDrafts(String(data.id), input);

    const asset = await getAssetBySlug(String(data.slug));
    if (!asset) {
      throw new Error("Created asset could not be reloaded.");
    }

    return asset;
  }, async () => {
    const { finalSlug } = createUniqueSlug(input.title);
    const fallbackDrafts = {
      executive_summary: resolveDraft(undefined, input.executiveSummary ?? "Working draft not yet created."),
      what_matters: resolveDraft(undefined, input.whatMatters ?? "No grounded what-matters draft yet."),
      key_risks: resolveDraft(undefined, input.keyRisks ?? "No key-risks draft yet."),
      counterview: resolveDraft(undefined, input.counterview ?? "No counterview drafted yet.")
    };

    return {
      id: createId("asset"),
      slug: finalSlug,
      title: input.title,
      symbol: input.symbol?.trim() || undefined,
      assetType: input.assetType?.trim() || undefined,
      status: "seeded" as const,
      thesis: input.thesis?.trim() || "Waiting for linked files and a first grounded draft.",
      executiveSummary: fallbackDrafts.executive_summary.resolved,
      whatMatters: fallbackDrafts.what_matters.resolved,
      keyRisks: fallbackDrafts.key_risks.resolved,
      counterview: fallbackDrafts.counterview.resolved,
      notes: input.notes?.trim() || "",
      linkedFileIds: [],
      updateIds: [],
      drafts: fallbackDrafts
    };
  });
}

export async function updateAsset(assetId: string, input: UpdateAssetInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();

    const payload: Record<string, unknown> = {};
    if (input.title !== undefined) payload.title = input.title;
    if (input.symbol !== undefined) payload.symbol = input.symbol.trim() || null;
    if (input.assetType !== undefined) payload.asset_type = input.assetType.trim() || null;
    if (input.thesis !== undefined) payload.thesis = input.thesis;
    if (input.notes !== undefined) payload.notes = input.notes;

    if (Object.keys(payload).length) {
      const { error } = await supabase.from("assets").update(payload).eq("id", assetId);
      if (error) throw error;
    }

    await upsertAssetDrafts(assetId, input);

    const asset = await getAssetById(assetId);
    if (!asset) {
      throw new Error("Updated asset could not be reloaded.");
    }

    return asset;
  }, async () => {
    const asset = seedAssets.find((entry) => entry.id === assetId);
    if (!asset) {
      throw new Error("Asset not found");
    }

    const executiveSummary = input.executiveSummary ?? asset.executiveSummary;
    const whatMatters = input.whatMatters ?? asset.whatMatters;
    const keyRisks = input.keyRisks ?? asset.keyRisks;
    const counterview = input.counterview ?? asset.counterview;

    return {
      ...asset,
      title: input.title ?? asset.title,
      symbol: input.symbol ?? asset.symbol,
      assetType: input.assetType ?? asset.assetType,
      thesis: input.thesis ?? asset.thesis,
      executiveSummary,
      whatMatters,
      keyRisks,
      counterview,
      notes: input.notes ?? asset.notes,
      drafts: {
        executive_summary: { generated: asset.drafts.executive_summary.generated, edited: executiveSummary, resolved: executiveSummary },
        what_matters: { generated: asset.drafts.what_matters.generated, edited: whatMatters, resolved: whatMatters },
        key_risks: { generated: asset.drafts.key_risks.generated, edited: keyRisks, resolved: keyRisks },
        counterview: { generated: asset.drafts.counterview.generated, edited: counterview, resolved: counterview }
      }
    };
  });
}

export async function listAssetUpdates(assetId: string) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("asset_updates")
      .select("*")
      .eq("asset_id", assetId)
      .order("happened_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: String(row.id),
      assetId: String(row.asset_id),
      title: String(row.title),
      happenedAt: String(row.happened_at),
      whatChanged: String(row.what_changed),
      whyItMatters: String(row.why_it_matters),
      thesisImpact: row.thesis_impact as AssetUpdate["thesisImpact"],
      analystView: String(row.analyst_view)
    }));
  }, async () => seedAssetUpdates.filter((update) => update.assetId === assetId));
}
