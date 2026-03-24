"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvestmentFramework } from "@/types/domain";

interface FrameworkFormProps {
  framework?: InvestmentFramework;
}

function serializeLines(value: string | undefined) {
  return value
    ?.split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean) ?? [];
}

export function FrameworkForm({ framework }: FrameworkFormProps) {
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

          const response = await fetch(framework ? `/api/frameworks/${framework.id}` : "/api/frameworks", {
            method: framework ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: formData.get("name"),
              description: formData.get("description"),
              instructions: formData.get("instructions"),
              questionSet: serializeLines(String(formData.get("questionSet") || "")),
              checklist: serializeLines(String(formData.get("checklist") || "")),
              keyLenses: serializeLines(String(formData.get("keyLenses") || "")),
              preferredMemoStructure: serializeLines(String(formData.get("preferredMemoStructure") || "")),
              redFlags: serializeLines(String(formData.get("redFlags") || "")),
              outputPreferences: serializeLines(String(formData.get("outputPreferences") || "")),
              isActive: true
            })
          });

          setStatus(response.ok ? "saved" : "failed");
        });
      }}
    >
      <Input name="name" defaultValue={framework?.name} placeholder="Framework name" required />
      <Textarea name="description" defaultValue={framework?.description} placeholder="Description" />
      <Textarea name="instructions" defaultValue={framework?.instructions} placeholder="Core instructions for the analyst" />
      <Textarea name="questionSet" defaultValue={framework?.questionSet.join("\n")} placeholder="One investment question per line" />
      <Textarea name="checklist" defaultValue={framework?.checklist.join("\n")} placeholder="One checklist item per line" />
      <Textarea name="keyLenses" defaultValue={framework?.keyLenses.join("\n")} placeholder="One lens per line" />
      <Textarea
        name="preferredMemoStructure"
        defaultValue={framework?.preferredMemoStructure.join("\n")}
        placeholder="One memo section per line"
      />
      <Textarea name="redFlags" defaultValue={framework?.redFlags.join("\n")} placeholder="One red flag per line" />
      <Textarea
        name="outputPreferences"
        defaultValue={framework?.outputPreferences.join("\n")}
        placeholder="One output preference per line"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {status === "idle" && "This framework should guide analyst drafting across linked files and assets."}
          {status === "saving" && "Saving framework..."}
          {status === "saved" && "Saved. The active framework is ready for asset drafting."}
          {status === "failed" && "Save failed. Check configuration and try again."}
        </p>
        <Button disabled={isPending}>{isPending ? "Saving..." : "Save Framework"}</Button>
      </div>
    </form>
  );
}
