"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Asset } from "@/types/domain";

interface FileLinkManagerProps {
  fileId: string;
  linkedAssetLabels: string[];
  assets: Asset[];
}

export function FileLinkManager({ fileId, linkedAssetLabels, assets }: FileLinkManagerProps) {
  const [status, setStatus] = useState("Select an asset to link this file into the working thesis thread.");
  const [selectedId, setSelectedId] = useState(assets[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4 rounded-[1.4rem] border border-border/80 bg-card/90 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Link into asset</p>
      <select
        value={selectedId}
        onChange={(event) => setSelectedId(event.target.value)}
        className="flex h-11 w-full rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground outline-none"
      >
        {assets.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {linkedAssetLabels.length ? linkedAssetLabels.map((label) => <span key={label}>{label}</span>) : <span>Not linked yet.</span>}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{status}</p>
        <Button
          variant="outline"
          disabled={!selectedId || isPending || !fileId}
          onClick={() =>
            startTransition(async () => {
              if (!fileId) {
                setStatus("Choose a file first.");
                return;
              }

              const response = await fetch(`/api/files/${fileId}/link`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ assetId: selectedId })
              });

              setStatus(response.ok ? "Link request completed." : "Link request failed.");
            })
          }
          type="button"
        >
          Link File
        </Button>
      </div>
    </div>
  );
}
