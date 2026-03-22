export type FileKind = "Report" | "Presentation" | "Transcript" | "Research Letter" | "Memo";

export type SummaryStatus = "processed" | "needs-review" | "queued";

export type FileProcessingStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "processing"
  | "summary-ready"
  | "failed";

export type ResearchItemType = "sector" | "asset";

export type ResearchEntityInputType = "sector" | "asset" | "company";

export type ThesisImpact = "strengthens" | "weakens" | "mixed";

export type ChatContextType = "asset" | "sector" | "theme" | "general";

export interface LibraryFolder {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibraryFile {
  id: string;
  slug: string;
  folderId: string;
  title: string;
  author: string;
  kind: FileKind;
  publishedAt: string;
  addedAt: string;
  tags: string[];
  linkedResearchIds: string[];
  summaryStatus: SummaryStatus;
  processingStatus: FileProcessingStatus;
  summary: string;
  keyTakeaways: string[];
  excerpts: string[];
  analystInterpretation: string;
  storageBucket?: string;
  storagePath?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
}

export interface ResearchUpdate {
  id: string;
  researchItemId: string;
  title: string;
  happenedAt: string;
  whatChanged: string;
  whyItMatters: string;
  thesisImpact: ThesisImpact;
  analystView: string;
}

export interface ResearchItem {
  id: string;
  slug: string;
  title: string;
  type: ResearchItemType;
  categoryLabel: string;
  status: "active" | "seeded";
  executiveSummary: string;
  keyPillars: string[];
  coreView: string;
  linkedFileIds: string[];
  updateIds: string[];
  primaryThreadId?: string;
}

export interface Insight {
  id: string;
  title: string;
  publishedAt: string;
  summary: string;
  whatMatters: string;
  relatedFileId?: string;
  relatedResearchId?: string;
  relatedThreadId?: string;
  reviewStatus?: "draft" | "ready" | "reviewed";
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  contextType: ChatContextType;
  contextLabel: string;
  relatedResearchId?: string;
  preview: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  createdAt: string;
  author: "Investor" | "Analyst";
  body: string;
}

export interface AnalystPrompt {
  id: string;
  title: string;
  body: string;
  actionLabel: string;
}

export interface CreateFolderInput {
  name: string;
  description?: string;
}

export interface CreateResearchItemInput {
  title: string;
  type: ResearchEntityInputType;
  executiveSummary?: string;
  coreView?: string;
}

export interface UpdateResearchItemInput {
  title?: string;
  executiveSummary?: string;
  coreView?: string;
  keyPillars?: string[];
}

export interface FileLinkInput {
  fileId: string;
  researchItemId: string;
}

export interface CreateChatThreadInput {
  title: string;
  contextType: ChatContextType;
  contextLabel: string;
  relatedResearchId?: string;
}

export interface CreateChatMessageInput {
  threadId: string;
  body: string;
  author: "Investor" | "Analyst";
}

export interface CreateInsightInput {
  title: string;
  summary: string;
  whatMatters: string;
  relatedFileId?: string;
  relatedResearchId?: string;
  relatedThreadId?: string;
}

export interface UploadFileInput {
  folderId: string;
  title: string;
  author?: string;
  kind: FileKind;
  publishedAt?: string;
  tags?: string[];
  fileName: string;
  fileSizeBytes?: number;
  mimeType?: string;
}

export interface FileSummaryResult {
  summary: string;
  keyTakeaways: string[];
  analystInterpretation: string;
  mode: "generated" | "fallback";
}
