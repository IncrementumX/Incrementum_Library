import { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  analystPanel?: ReactNode;
  className?: string;
}

export function AppShell({ children, analystPanel, className }: AppShellProps) {
  return (
    <div className="min-h-screen lg:flex">
      <SidebarNav />
      <div className="flex min-h-screen flex-1">
        <main className={cn("min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8 xl:px-10", className)}>{children}</main>
        {analystPanel ? (
          <aside className="hidden w-[320px] shrink-0 border-l border-border/70 bg-[rgba(252,249,244,0.84)] px-5 py-8 backdrop-blur-xl xl:block">
            {analystPanel}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
