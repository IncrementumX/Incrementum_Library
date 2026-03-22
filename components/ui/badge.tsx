import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-muted-foreground",
        accent: "border-transparent bg-accent text-accent-foreground",
        success: "border-transparent bg-[hsl(var(--success)/0.14)] text-[hsl(var(--success))]",
        warning: "border-transparent bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]",
        danger: "border-transparent bg-[hsl(var(--danger)/0.12)] text-[hsl(var(--danger))]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
