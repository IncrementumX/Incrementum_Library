export type FileKind = "Report" | "Presentation" | "Transcript" | "Research Letter" | "Memo";

export type SummaryStatus = "processed" | "needs-review" | "queued";

export type FileProcessingStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "processing"
  | "summary-ready"
  | "failed";

export type AssetStatus = "active" | "seeded";
export type AssetDraftField = "executive_summary" | "what_matters" | "key_risks" | "counterview";

export type ThesisImpact = "strengthens" | "weakens" | "mixed";

export type ChatContextType = "asset" | "theme" | "general";

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
  linkedAssetIds: string[];
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

export interface AssetUpdate {
  id: string;
  assetId: string;
  title: string;
  happenedAt: string;
  whatChanged: string;
  whyItMatters: string;
  thesisImpact: ThesisImpact;
  analystView: string;
}

export interface EditableDraftContent {
  generated: string;
  edited?: string;
  resolved: string;
}

export interface Asset {
  id: string;
  slug: string;
  title: string;
  symbol?: string;
  assetType?: string;
  status: AssetStatus;
  thesis: string;
  executiveSummary: string;
  whatMatters: string;
  keyRisks: string;
  counterview: string;
  notes: string;
  linkedFileIds: string[];
  updateIds: string[];
  primaryThreadId?: string;
  drafts: Record<AssetDraftField, EditableDraftContent>;
}

export interface Insight {
  id: string;
  title: string;
  publishedAt: string;
  summary: string;
  whatMatters: string;
  relatedFileId?: string;
  relatedAssetId?: string;
  relatedThreadId?: string;
  reviewStatus?: "draft" | "ready" | "reviewed";
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  contextType: ChatContextType;
  contextLabel: string;
  relatedAssetId?: string;
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

export interface CreateAssetInput {
  title: string;
  symbol?: string;
  assetType?: string;
  thesis?: string;
  executiveSummary?: string;
  whatMatters?: string;
  keyRisks?: string;
  counterview?: string;
  notes?: string;
}

export interface UpdateAssetInput {
  title?: string;
  symbol?: string;
  assetType?: string;
  thesis?: string;
  executiveSummary?: string;
  whatMatters?: string;
  keyRisks?: string;
  counterview?: string;
  notes?: string;
}

export interface FileAssetLinkInput {
  fileId: string;
  assetId: string;
}

export interface CreateChatThreadInput {
  title: string;
  contextType: ChatContextType;
  contextLabel: string;
  relatedAssetId?: string;
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
  relatedAssetId?: string;
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
  excerpts?: string[];
  analystInterpretation: string;
  mode: "generated" | "fallback";
}

export interface AssetDraftRecord {
  id: string;
  assetId: string;
  field: AssetDraftField;
  generatedContent: string;
  editedContent?: string;
  updatedAt?: string;
}

export interface InvestmentFramework {
  id: string;
  name: string;
  description: string;
  instructions: string;
  questionSet: string[];
  checklist: string[];
  keyLenses: string[];
  preferredMemoStructure: string[];
  redFlags: string[];
  outputPreferences: string[];
  isActive: boolean;
  version: number;
  createdAt?: string;
  updatedAt?: string;
}
