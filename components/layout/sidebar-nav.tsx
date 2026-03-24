"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, FileStack, Home, Lightbulb, Search, Settings, SquarePen } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: FileStack },
  { href: "/research", label: "Research", icon: BookOpenText },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/notebook", label: "Notebook", icon: SquarePen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-border/70 bg-[rgba(251,247,240,0.74)] px-5 py-8 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <div className="px-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Incrementum</p>
          <h1 className="mt-2 font-serif text-2xl leading-none text-foreground">Incrementum Library</h1>
        </div>

        <nav className="mt-10 space-y-1.5">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors",
                  active ? "bg-card text-foreground shadow-whisper" : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.4rem] border border-border/80 bg-card/85 p-4 shadow-whisper">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Workspace</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Add materials, define assets, and keep the analyst working inside your threads.
          </p>
        </div>
      </div>
    </aside>
  );
}
