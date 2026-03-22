"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { LibraryFile } from "@/types/domain";

interface ResearchLinkManagerProps {
  researchItemId: string;
  linkedFileTitles: string[];
  availableFiles: LibraryFile[];
}

export function ResearchLinkManager({
  researchItemId,
  linkedFileTitles,
  availableFiles
}: ResearchLinkManagerProps) {
  const [status, setStatus] = useState("Select a file to attach to this research thread.");
  const [selectedFileId, setSelectedFileId] = useState(availableFiles[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4 rounded-[1.4rem] border border-border/80 bg-card/90 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Attach file from research</p>
      <select
        value={selectedFileId}
        onChange={(event) => setSelectedFileId(event.target.value)}
        className="flex h-11 w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none"
      >
        {availableFiles.map((file) => (
          <option key={file.id} value={file.id}>
            {file.title}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {linkedFileTitles.length ? linkedFileTitles.map((title) => <span key={title}>{title}</span>) : <span>No files linked yet.</span>}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{status}</p>
        <Button
          type="button"
          variant="outline"
          disabled={!selectedFileId || isPending}
          onClick={() =>
            startTransition(async () => {
              const response = await fetch(`/api/research/${researchItemId}/link-file`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ fileId: selectedFileId })
              });

              setStatus(response.ok ? "Link request completed." : "Link request failed.");
            })
          }
        >
          Link Source
        </Button>
      </div>
    </div>
  );
}
