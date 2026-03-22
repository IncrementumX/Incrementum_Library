"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LibraryFolder, UploadFileInput } from "@/types/domain";

interface UploadFormProps {
  folders: LibraryFolder[];
}

export function UploadForm({ folders }: UploadFormProps) {
  const [status, setStatus] = useState<UploadFileInput["kind"] | null>(null);
  const [processingState, setProcessingState] = useState<
    "idle" | "uploading" | "uploaded" | "processing" | "summary-ready" | "failed"
  >("idle");
  const [message, setMessage] = useState("Upload a file and stage it for analyst processing.");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const file = formData.get("file");

        startTransition(async () => {
          setProcessingState("uploading");
          setMessage("Uploading file...");

          const payload = new FormData();
          payload.set("folderId", String(formData.get("folderId")));
          payload.set("title", String(formData.get("title")));
          payload.set("author", String(formData.get("author") || ""));
          payload.set("kind", String(formData.get("kind")));
          payload.set("publishedAt", String(formData.get("publishedAt") || ""));
          payload.set("tags", String(formData.get("tags") || ""));
          payload.set("notes", String(formData.get("notes") || ""));
          if (file instanceof File) {
            payload.set("file", file);
          }

          const response = await fetch("/api/files", {
            method: "POST",
            body: payload
          });

          if (!response.ok) {
            setProcessingState("failed");
            setMessage("Upload failed. Check the file and configuration, then try again.");
            return;
          }

          setProcessingState("processing");
          setMessage("File record created. Summary generation has been staged.");

          const result = await response.json();
          setStatus(result.file?.kind ?? null);
          setProcessingState(result.file?.processingStatus ?? "summary-ready");
          setMessage(
            result.mode === "mock"
              ? "Fallback mode is active. The workflow is functioning, but the upload is not persisted yet."
              : "File uploaded and persisted. Summary pipeline has started."
          );
        });
      }}
    >
      <select
        name="folderId"
        className="flex h-11 w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none"
        defaultValue={folders[0]?.id}
      >
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
      <Input name="title" placeholder="Document title" required />
      <Input name="author" placeholder="Author or source" />
      <div className="grid gap-4 md:grid-cols-2">
        <select
          name="kind"
          className="flex h-11 w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none"
          defaultValue="Report"
        >
          {["Report", "Presentation", "Transcript", "Research Letter", "Memo"].map((kind) => (
            <option key={kind} value={kind}>
              {kind}
            </option>
          ))}
        </select>
        <Input name="publishedAt" placeholder="Published date (YYYY-MM-DD)" />
      </div>
      <Input name="tags" placeholder="Tags, comma separated" />
      <Input name="file" type="file" required />
      <Textarea name="notes" placeholder="Optional upload note for the analyst" />
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          <p>{message}</p>
          <p className="mt-1 uppercase tracking-[0.16em]">
            State: {processingState}
            {status ? ` · ${status}` : ""}
          </p>
        </div>
        <Button disabled={isPending}>{isPending ? "Uploading..." : "Upload File"}</Button>
      </div>
    </form>
  );
}
