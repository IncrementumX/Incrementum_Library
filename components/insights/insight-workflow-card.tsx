"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

interface InsightWorkflowCardProps {
  fileId: string;
}

export function InsightWorkflowCard({ fileId }: InsightWorkflowCardProps) {
  const [status, setStatus] = useState("Generate an insight after a file has enough grounded summary material.");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-[1.4rem] border border-border/80 bg-card/90 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Insight workflow</p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{status}</p>
      <Button
        className="mt-4"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const response = await fetch("/api/insights/from-file", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ fileId })
            });

            setStatus(response.ok ? "Insight draft created." : "Insight generation failed.");
          })
        }
      >
        {isPending ? "Generating..." : "Generate Insight"}
      </Button>
    </div>
  );
}
