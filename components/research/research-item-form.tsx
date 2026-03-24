"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Asset } from "@/types/domain";

interface ResearchItemFormProps {
  mode: "create" | "edit";
  item?: Asset;
}

export function ResearchItemForm({ mode, item }: ResearchItemFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          setStatus("saving");

          const response = await fetch(mode === "create" ? "/api/research" : `/api/research/${item?.id}`, {
            method: mode === "create" ? "POST" : "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: formData.get("title"),
              symbol: formData.get("symbol"),
              assetType: formData.get("assetType"),
              thesis: formData.get("thesis"),
              executiveSummary: formData.get("executiveSummary"),
              whatMatters: formData.get("whatMatters"),
              keyRisks: formData.get("keyRisks"),
              counterview: formData.get("counterview"),
              notes: formData.get("notes")
            })
          });

          setStatus(response.ok ? "saved" : "failed");
        });
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" defaultValue={item?.title} placeholder="Asset name" required />
        <Input name="symbol" defaultValue={item?.symbol} placeholder="Ticker or symbol (optional)" />
      </div>
      <Input name="assetType" defaultValue={item?.assetType} placeholder="Asset type (equity, commodity, crypto, macro...)" />
      <Textarea name="thesis" defaultValue={item?.thesis} placeholder="Thesis" />
      <Textarea
        name="executiveSummary"
        defaultValue={item?.drafts.executive_summary.edited ?? item?.drafts.executive_summary.generated ?? item?.executiveSummary}
        placeholder="Executive Summary draft"
      />
      <Textarea
        name="whatMatters"
        defaultValue={item?.drafts.what_matters.edited ?? item?.drafts.what_matters.generated ?? item?.whatMatters}
        placeholder="What matters"
      />
      <Textarea
        name="keyRisks"
        defaultValue={item?.drafts.key_risks.edited ?? item?.drafts.key_risks.generated ?? item?.keyRisks}
        placeholder="Key risks"
      />
      <Textarea
        name="counterview"
        defaultValue={item?.drafts.counterview.edited ?? item?.drafts.counterview.generated ?? item?.counterview}
        placeholder="Counterview"
      />
      <Textarea name="notes" defaultValue={item?.notes} placeholder="Notes" />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {status === "idle" && `${mode === "create" ? "Create" : "Update"} an asset thread with editable analyst drafts.`}
          {status === "saving" && "Saving asset..."}
          {status === "saved" && "Saved. Draft fields remain editable by you."}
          {status === "failed" && "Save failed. Check configuration and try again."}
        </p>
        <Button disabled={isPending}>{isPending ? "Saving..." : mode === "create" ? "Create Asset" : "Save Changes"}</Button>
      </div>
    </form>
  );
}
