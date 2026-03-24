import { seedChatMessages, seedChatThreads } from "@/lib/mock/seed-data";
import { runWithDataFallback } from "@/lib/repositories/runtime";
import { createId } from "@/lib/repositories/utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { CreateChatMessageInput, CreateChatThreadInput } from "@/types/domain";

export async function listChatThreads() {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase.from("chat_threads").select("*").order("updated_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      updatedAt: String(row.updated_at),
      contextType: row.context_type as "asset" | "theme" | "general",
      contextLabel: String(row.context_label),
      relatedAssetId: row.related_asset_id ? String(row.related_asset_id) : undefined,
      preview: String(row.preview ?? "")
    }));
  }, async () => seedChatThreads);
}

export async function getThreadById(threadId: string) {
  const threads = await listChatThreads();
  return threads.find((thread) => thread.id === threadId);
}

export async function getThreadForAsset(assetId: string) {
  const threads = await listChatThreads();
  return threads.find((thread) => thread.relatedAssetId === assetId);
}

export async function getMessagesForThread(threadId: string) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at");

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: String(row.id),
      threadId: String(row.thread_id),
      createdAt: String(row.created_at),
      author: row.author as "Investor" | "Analyst",
      body: String(row.body)
    }));
  }, async () => seedChatMessages.filter((message) => message.threadId === threadId));
}

export async function createChatThread(input: CreateChatThreadInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const payload = {
      title: input.title,
      context_type: input.contextType,
      context_label: input.contextLabel,
      related_asset_id: input.relatedAssetId ?? null,
      preview: ""
    };

    const { data, error } = await supabase.from("chat_threads").insert(payload).select("*").single();
    if (error) throw error;

    return {
      id: String(data.id),
      title: String(data.title),
      updatedAt: String(data.updated_at),
      contextType: data.context_type as "asset" | "theme" | "general",
      contextLabel: String(data.context_label),
      relatedAssetId: data.related_asset_id ? String(data.related_asset_id) : undefined,
      preview: String(data.preview ?? "")
    };
  }, async () => ({
    id: createId("thread"),
    title: input.title,
    updatedAt: new Date().toISOString(),
    contextType: input.contextType,
    contextLabel: input.contextLabel,
    relatedAssetId: input.relatedAssetId,
    preview: ""
  }));
}

export async function createChatMessage(input: CreateChatMessageInput) {
  return runWithDataFallback(async () => {
    const supabase = createSupabaseAdminClient();
    if (!supabase) throw new Error("Supabase admin client unavailable");

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        thread_id: input.threadId,
        author: input.author,
        body: input.body
      })
      .select("*")
      .single();

    if (error) throw error;
    return {
      id: String(data.id),
      threadId: String(data.thread_id),
      createdAt: String(data.created_at),
      author: data.author as "Investor" | "Analyst",
      body: String(data.body)
    };
  }, async () => ({
    id: createId("message"),
    threadId: input.threadId,
    createdAt: new Date().toISOString(),
    author: input.author,
    body: input.body
  }));
}
