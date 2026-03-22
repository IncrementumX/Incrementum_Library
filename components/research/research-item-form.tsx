"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResearchEntityInputType, ResearchItem } from "@/types/domain";

interface ResearchItemFormProps {
  mode: "create" | "edit";
  defaultType?: ResearchEntityInputType;
  item?: ResearchItem;
}

export function ResearchItemForm({ mode, defaultType = "asset", item }: ResearchItemFormProps) {
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
              type: formData.get("type"),
              executiveSummary: formData.get("executiveSummary"),
              coreView: formData.get("coreView"),
              keyPillars: String(formData.get("keyPillars") || "")
                .split("\n")
                .map((value) => value.trim())
                .filter(Boolean)
            })
          });

          setStatus(response.ok ? "saved" : "failed");
        });
      }}
    >
      <select
        name="type"
        defaultValue={item ? (item.categoryLabel.toLowerCase() === "company" ? "company" : item.type) : defaultType}
        className="flex h-11 w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none"
      >
        <option value="asset">Asset</option>
        <option value="sector">Sector</option>
        <option value="company">Company</option>
      </select>
      <Input name="title" defaultValue={item?.title} placeholder="Title" required />
      <Textarea
        name="executiveSummary"
        defaultValue={item?.executiveSummary}
        placeholder="Executive Summary"
      />
      <Textarea name="coreView" defaultValue={item?.coreView} placeholder="Core View" />
      <Textarea
        name="keyPillars"
        defaultValue={item?.keyPillars.join("\n")}
        placeholder="One key pillar per line"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {status === "idle" && `${mode === "create" ? "Create" : "Update"} a research item in the current workspace.`}
          {status === "saving" && "Saving research item..."}
          {status === "saved" && "Saved. In fallback mode this remains a non-persistent preview."}
          {status === "failed" && "Save failed. Check configuration and try again."}
        </p>
        <Button disabled={isPending}>{isPending ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}</Button>
      </div>
    </form>
  );
}
