"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LibraryFolder, UploadFileInput } from "@/types/domain";

interface UploadFormProps {
  folders: LibraryFolder[];
}

type UploadEntryState = "idle" | "uploading" | "uploaded" | "processing" | "summary-ready" | "failed";

interface UploadEntry {
  fileName: string;
  state: UploadEntryState;
  message: string;
}

export function UploadForm({ folders }: UploadFormProps) {
  const [status, setStatus] = useState<UploadFileInput["kind"] | null>(null);
  const [processingState, setProcessingState] = useState<UploadEntryState>("idle");
  const [message, setMessage] = useState("Upload one or more files and stage each one for grounded analyst processing.");
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const files = Array.from((event.currentTarget.elements.namedItem("files") as HTMLInputElement | null)?.files ?? []);

        startTransition(async () => {
          setStatus(null);
          setProcessingState("uploading");
          setEntries(files.map((file) => ({ fileName: file.name, state: "uploading", message: "Uploading..." })));
          setMessage(files.length > 1 ? "Uploading files..." : "Uploading file...");

          const payload = new FormData();
          payload.set("folderId", String(formData.get("folderId")));
          payload.set("title", String(formData.get("title")));
          payload.set("author", String(formData.get("author") || ""));
          payload.set("kind", String(formData.get("kind")));
          payload.set("publishedAt", String(formData.get("publishedAt") || ""));
          payload.set("tags", String(formData.get("tags") || ""));
          payload.set("notes", String(formData.get("notes") || ""));

          files.forEach((file) => {
            payload.append("files", file);
          });

          const response = await fetch("/api/files", {
            method: "POST",
            body: payload
          });

          const result = await response.json().catch(() => null);

          if (!response.ok) {
            setProcessingState("failed");
            setEntries(
              files.map((file) => ({
                fileName: file.name,
                state: "failed",
                message: typeof result?.error === "string" ? result.error : "Upload failed."
              }))
            );
            setMessage(
              typeof result?.error === "string"
                ? result.error
                : "Upload failed. Check the file and configuration, then try again."
            );
            return;
          }

          const uploadedFiles = Array.isArray(result?.files) ? result.files : result?.file ? [result.file] : [];
          const failures = Array.isArray(result?.failures) ? result.failures : [];

          setStatus(uploadedFiles[0]?.kind ?? null);
          setProcessingState(uploadedFiles[0]?.processingStatus ?? "summary-ready");
          setEntries(
            files.map((file) => {
              const uploaded = uploadedFiles.find((entry: { originalFileName?: string; title?: string }) => entry.originalFileName === file.name || entry.title === file.name.replace(/\.[^.]+$/, ""));
              const failure = failures.find((entry: { fileName: string }) => entry.fileName === file.name);

              return {
                fileName: file.name,
                state: failure ? "failed" : uploaded?.processingStatus ?? "summary-ready",
                message: failure ? failure.error : "Uploaded, persisted, and queued for summary."
              };
            })
          );
          setMessage(
            `Accepted ${result.acceptedCount ?? uploadedFiles.length} file${(result.acceptedCount ?? uploadedFiles.length) === 1 ? "" : "s"}. Rejected ${result.rejectedCount ?? failures.length}.`
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
      <Input name="title" placeholder="Document title for single-file upload (optional for batch)" />
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
      <Input name="files" type="file" multiple required />
      <Textarea name="notes" placeholder="Optional upload note for the analyst" />
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            <p>{message}</p>
            <p className="mt-1 uppercase tracking-[0.16em]">
              State: {processingState}
              {status ? ` · ${status}` : ""}
            </p>
          </div>
          <Button disabled={isPending}>{isPending ? "Uploading..." : "Upload Files"}</Button>
        </div>
        {entries.length ? (
          <div className="space-y-2 rounded-[1.2rem] border border-border/80 bg-card/80 p-4">
            {entries.map((entry) => (
              <div key={entry.fileName} className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-foreground">{entry.fileName}</span>
                <span className="text-muted-foreground">
                  {entry.state} · {entry.message}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </form>
  );
}
