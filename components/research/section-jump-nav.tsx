import Link from "next/link";

const sections = [
  { id: "summary", label: "Summary" },
  { id: "pillars", label: "Pillars" },
  { id: "sources", label: "Sources" },
  { id: "updates", label: "Updates" },
  { id: "thread", label: "Thread" }
];

export function SectionJumpNav() {
  return (
    <nav className="sticky top-4 z-10 mb-8 overflow-x-auto rounded-full border border-border/80 bg-[rgba(252,249,244,0.88)] px-2 py-2 shadow-whisper backdrop-blur-sm">
      <div className="flex min-w-max items-center gap-1.5">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {section.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
