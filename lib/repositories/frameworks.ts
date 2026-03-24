import { seedFrameworks } from "@/lib/mock/seed-data";
import { runWithDataFallback } from "@/lib/repositories/runtime";
import { createId } from "@/lib/repositories/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { InvestmentFramework } from "@/types/domain";

function mapFramework(row: Record<string, unknown>): InvestmentFramework {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description ?? ""),
    instructions: String(row.instructions ?? ""),
    questionSet: Array.isArray(row.question_set) ? row.question_set.map(String) : [],
    checklist: Array.isArray(row.checklist) ? row.checklist.map(String) : [],
    keyLenses: Array.isArray(row.key_lenses) ? row.key_lenses.map(String) : [],
    preferredMemoStructure: Array.isArray(row.preferred_memo_structure) ? row.preferred_memo_structure.map(String) : [],
    redFlags: Array.isArray(row.red_flags) ? row.red_flags.map(String) : [],
    outputPreferences: Array.isArray(row.output_preferences) ? row.output_preferences.map(String) : [],
    isActive: Boolean(row.is_active),
    version: Number(row.version ?? 1),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined
  };
}

export async function listInvestmentFrameworks() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("investment_frameworks").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapFramework(row as Record<string, unknown>));
  }, async () => seedFrameworks);
}

export async function getActiveInvestmentFramework() {
  const frameworks = await listInvestmentFrameworks();
  return frameworks.find((framework) => framework.isActive) ?? frameworks[0];
}

export async function saveInvestmentFramework(input: Omit<InvestmentFramework, "id" | "version" | "createdAt" | "updatedAt"> & { id?: string }) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();

    if (input.isActive) {
      const { error: deactivateError } = await supabase.from("investment_frameworks").update({ is_active: false }).eq("is_active", true);
      if (deactivateError) throw deactivateError;
    }

    const payload = {
      name: input.name,
      description: input.description,
      instructions: input.instructions,
      question_set: input.questionSet,
      checklist: input.checklist,
      key_lenses: input.keyLenses,
      preferred_memo_structure: input.preferredMemoStructure,
      red_flags: input.redFlags,
      output_preferences: input.outputPreferences,
      is_active: input.isActive,
      version: 1
    };

    const query = input.id
      ? supabase.from("investment_frameworks").update(payload).eq("id", input.id).select("*").single()
      : supabase.from("investment_frameworks").insert(payload).select("*").single();

    const { data, error } = await query;
    if (error) throw error;
    return mapFramework(data as Record<string, unknown>);
  }, async () => ({
    id: input.id ?? createId("framework"),
    name: input.name,
    description: input.description,
    instructions: input.instructions,
    questionSet: input.questionSet,
    checklist: input.checklist,
    keyLenses: input.keyLenses,
    preferredMemoStructure: input.preferredMemoStructure,
    redFlags: input.redFlags,
    outputPreferences: input.outputPreferences,
    isActive: input.isActive,
    version: 1
  }));
}
