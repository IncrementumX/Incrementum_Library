"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NewFolderForm() {
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

          const response = await fetch("/api/folders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: formData.get("name"),
              description: formData.get("description")
            })
          });

          setStatus(response.ok ? "saved" : "failed");
        });
      }}
    >
      <Input name="name" placeholder="Folder name" required />
      <Textarea name="description" placeholder="What belongs in this folder?" />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {status === "idle" && "Create a folder for materials you plan to review or connect into research."}
          {status === "saving" && "Creating folder..."}
          {status === "saved" && "Folder request completed. In fallback mode this is a non-persistent preview."}
          {status === "failed" && "Folder creation failed. Check configuration and try again."}
        </p>
        <Button disabled={isPending}>{isPending ? "Saving..." : "Create Folder"}</Button>
      </div>
    </form>
  );
}
