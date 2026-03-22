import Link from "next/link";
import { Plus, Upload } from "lucide-react";

import { AnalystPanel } from "@/components/analyst/analyst-panel";
import { FileRow } from "@/components/library/file-row";
import { FolderCard } from "@/components/library/folder-card";
import { AppShell } from "@/components/layout/app-shell";
import { RuntimeModeBadge } from "@/components/system/runtime-mode-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAnalystPrompts, listFilesByFolder, listFolders } from "@/lib/repositories";

export default async function LibraryPage() {
  const [prompts, folders] = await Promise.all([listAnalystPrompts(), listFolders()]);
  const folderData = await Promise.all(
    folders.map(async (folder) => ({
      folder,
      files: await listFilesByFolder(folder.id)
    }))
  );

  return (
    <AppShell
      analystPanel={
        <AnalystPanel
          prompts={prompts}
          title="Library Analyst"
          description="Files live here first. Summaries, interpretation, and future links into research should all begin from your uploaded materials."
        />
      }
    >
      <div className="space-y-8">
        <section className="flex flex-col gap-5 rounded-[1.8rem] border border-border/80 bg-card/90 px-6 py-7 shadow-whisper md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Library</p>
              <RuntimeModeBadge />
            </div>
            <h2 className="mt-4 font-serif text-4xl text-foreground">Folders and files</h2>
            <p className="mt-4 max-w-reading text-base leading-8 text-muted-foreground">
              Treat Library as the document control layer for the analyst. Add folders, add files, and let the analyst work from what you actually provide.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/library/folders/new">
                <Plus className="mr-2 h-4 w-4" />
                New Folder
              </Link>
            </Button>
            <Button asChild>
              <Link href="/library/upload">
                <Upload className="mr-2 h-4 w-4" />
                Add File
              </Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {folderData.map(({ folder, files }) => (
            <FolderCard key={folder.id} folder={folder} fileCount={files.length} />
          ))}
        </section>

        <section className="space-y-6">
          {folderData.map(({ folder, files }) => (
            <Card key={folder.id} id={folder.slug}>
              <CardHeader>
                <CardTitle className="text-3xl">{folder.name}</CardTitle>
                <p className="text-sm leading-7 text-muted-foreground">{folder.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {files.length ? (
                  files.map((file) => <FileRow key={file.id} file={file} />)
                ) : (
                  <div className="rounded-[1.2rem] bg-accent/60 px-4 py-4 text-sm leading-7 text-muted-foreground">
                    No files here yet. Use this folder when you add your next material.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
