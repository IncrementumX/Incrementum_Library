import {
  AnalystPrompt,
  Asset,
  AssetDraftRecord,
  AssetUpdate,
  ChatMessage,
  ChatThread,
  Insight,
  InvestmentFramework,
  LibraryFile,
  LibraryFolder
} from "@/types/domain";

export const seedFolders: LibraryFolder[] = [
  {
    id: "folder-inbox",
    slug: "inbox",
    name: "Inbox",
    description: "Fresh materials waiting to be summarized, linked, and worked into asset research."
  },
  {
    id: "folder-core-assets",
    slug: "core-assets",
    name: "Core Assets",
    description: "Files already attached to active asset threads."
  }
];

export const seedFiles: LibraryFile[] = [
  {
    id: "file-gold-demand-outlook",
    slug: "world-gold-council-demand-outlook",
    folderId: "folder-core-assets",
    title: "World Gold Council Demand Outlook",
    author: "World Gold Council",
    kind: "Report",
    publishedAt: "2026-02-12",
    addedAt: "2026-03-02",
    tags: ["Gold", "Reserve demand"],
    linkedAssetIds: ["asset-gold"],
    summaryStatus: "processed",
    processingStatus: "summary-ready",
    summary:
      "Central-bank demand remains the most decision-useful section of the report. The document is strongest when used to test how durable gold sponsorship may be outside short-term western ETF flows.",
    keyTakeaways: [
      "Official-sector accumulation remains structurally elevated.",
      "ETF flows still shape short-term tape behavior, but they are not the core thesis anchor.",
      "The demand base looks more strategic than a simple fear-trade framing implies."
    ],
    excerpts: [
      "Central-bank demand remains above historical averages.",
      "Investment demand is increasingly sensitive to policy credibility and reserve diversification."
    ],
    analystInterpretation:
      "This file should ground the gold thread in durability of sponsorship. The useful conclusion is not generic bullishness, but that support may persist even when western positioning cools."
  },
  {
    id: "file-bitcoin-market-structure",
    slug: "bitcoin-market-structure-note",
    folderId: "folder-inbox",
    title: "Bitcoin Market Structure Note",
    author: "Internal Research",
    kind: "Memo",
    publishedAt: "2026-03-14",
    addedAt: "2026-03-15",
    tags: ["Bitcoin", "Positioning"],
    linkedAssetIds: [],
    summaryStatus: "needs-review",
    processingStatus: "processing",
    summary:
      "The note is still provisional, but it frames bitcoin through market structure and positioning rather than a broad macro narrative.",
    keyTakeaways: [
      "The thesis still needs a cleaner distinction between structural demand and cyclical positioning.",
      "The file is useful as a first working input, not as a final anchor document.",
      "More grounded source material is needed before locking the executive summary."
    ],
    excerpts: [
      "ETF access changed ownership pathways, but did not remove the need to track marginal buyers.",
      "Volatility regime matters more than static adoption rhetoric."
    ],
    analystInterpretation:
      "Keep this attached to a future bitcoin asset only after more durable source material arrives. Right now it is a draft input."
  }
];

export const seedAssetDrafts: AssetDraftRecord[] = [
  {
    id: "draft-gold-executive-summary",
    assetId: "asset-gold",
    field: "executive_summary",
    generatedContent:
      "Gold currently reads best as a durability thesis rather than a crisis trade. Reserve demand and policy distrust appear to be creating a firmer sponsorship base than short-term real-rate narratives capture.",
    editedContent:
      "Gold currently reads best as a durability thesis rather than a pure crisis trade. Reserve demand and policy distrust appear to be creating a firmer sponsorship base than short-term real-rate narratives capture."
  },
  {
    id: "draft-gold-what-matters",
    assetId: "asset-gold",
    field: "what_matters",
    generatedContent:
      "What matters most is whether strategic reserve demand remains persistent enough to create downside support even when western investor flows soften."
  },
  {
    id: "draft-gold-key-risks",
    assetId: "asset-gold",
    field: "key_risks",
    generatedContent:
      "Key risks are disinflation with restored policy credibility, a sustained reversal in official-sector demand, and a thesis that is already more consensus than current language assumes."
  },
  {
    id: "draft-gold-counterview",
    assetId: "asset-gold",
    field: "counterview",
    generatedContent:
      "The counterview is that gold remains mostly a macro hedge whose current support is cyclical and reversible, not a sign of structurally stronger sponsorship."
  }
];

export const seedAssets: Asset[] = [
  {
    id: "asset-gold",
    slug: "gold",
    title: "Gold",
    symbol: "XAU",
    assetType: "commodity",
    status: "active",
    thesis:
      "Gold should be evaluated as a durability-of-sponsorship thesis. The core question is whether reserve diversification and distrust in policy credibility are establishing a firmer long-duration floor under the asset.",
    executiveSummary:
      "Gold currently reads best as a durability thesis rather than a pure crisis trade. Reserve demand and policy distrust appear to be creating a firmer sponsorship base than short-term real-rate narratives capture.",
    whatMatters:
      "What matters most is whether strategic reserve demand remains persistent enough to create downside support even when western investor flows soften.",
    keyRisks:
      "Key risks are disinflation with restored policy credibility, a sustained reversal in official-sector demand, and a thesis that is already more consensus than current language assumes.",
    counterview:
      "The counterview is that gold remains mostly a macro hedge whose current support is cyclical and reversible, not a sign of structurally stronger sponsorship.",
    notes:
      "Keep this thread anchored to reserve demand, policy credibility, and durability of support. Avoid lazy inflation-hedge language unless a file actually supports it.",
    linkedFileIds: ["file-gold-demand-outlook"],
    updateIds: ["update-gold-reserve-demand"],
    primaryThreadId: "thread-gold-working",
    drafts: {
      executive_summary: {
        generated:
          "Gold currently reads best as a durability thesis rather than a crisis trade. Reserve demand and policy distrust appear to be creating a firmer sponsorship base than short-term real-rate narratives capture.",
        edited:
          "Gold currently reads best as a durability thesis rather than a pure crisis trade. Reserve demand and policy distrust appear to be creating a firmer sponsorship base than short-term real-rate narratives capture.",
        resolved:
          "Gold currently reads best as a durability thesis rather than a pure crisis trade. Reserve demand and policy distrust appear to be creating a firmer sponsorship base than short-term real-rate narratives capture."
      },
      what_matters: {
        generated:
          "What matters most is whether strategic reserve demand remains persistent enough to create downside support even when western investor flows soften.",
        resolved:
          "What matters most is whether strategic reserve demand remains persistent enough to create downside support even when western investor flows soften."
      },
      key_risks: {
        generated:
          "Key risks are disinflation with restored policy credibility, a sustained reversal in official-sector demand, and a thesis that is already more consensus than current language assumes.",
        resolved:
          "Key risks are disinflation with restored policy credibility, a sustained reversal in official-sector demand, and a thesis that is already more consensus than current language assumes."
      },
      counterview: {
        generated:
          "The counterview is that gold remains mostly a macro hedge whose current support is cyclical and reversible, not a sign of structurally stronger sponsorship.",
        resolved:
          "The counterview is that gold remains mostly a macro hedge whose current support is cyclical and reversible, not a sign of structurally stronger sponsorship."
      }
    }
  },
  {
    id: "asset-bitcoin",
    slug: "bitcoin",
    title: "Bitcoin",
    symbol: "BTC",
    assetType: "crypto",
    status: "seeded",
    thesis: "Waiting for user-seeded files and a first-pass thesis draft.",
    executiveSummary: "Working thread not yet drafted. Link files and start the analyst conversation before hardening the view.",
    whatMatters: "A clean separation between durable demand, positioning, and market structure.",
    keyRisks: "Narrative overreach, weak source grounding, and overfitting a macro explanation to cyclical price action.",
    counterview: "Bitcoin may remain mostly a reflexive positioning asset rather than a clean durable thesis.",
    notes: "Seeded for future work. Do not overproduce content without more files.",
    linkedFileIds: [],
    updateIds: [],
    drafts: {
      executive_summary: {
        generated: "Working thread not yet drafted. Link files and start the analyst conversation before hardening the view.",
        resolved: "Working thread not yet drafted. Link files and start the analyst conversation before hardening the view."
      },
      what_matters: {
        generated: "A clean separation between durable demand, positioning, and market structure.",
        resolved: "A clean separation between durable demand, positioning, and market structure."
      },
      key_risks: {
        generated: "Narrative overreach, weak source grounding, and overfitting a macro explanation to cyclical price action.",
        resolved: "Narrative overreach, weak source grounding, and overfitting a macro explanation to cyclical price action."
      },
      counterview: {
        generated: "Bitcoin may remain mostly a reflexive positioning asset rather than a clean durable thesis.",
        resolved: "Bitcoin may remain mostly a reflexive positioning asset rather than a clean durable thesis."
      }
    }
  }
];

export const seedAssetUpdates: AssetUpdate[] = [
  {
    id: "update-gold-reserve-demand",
    assetId: "asset-gold",
    title: "Reserve demand still looks strategic rather than reactive",
    happenedAt: "2026-03-01",
    whatChanged:
      "Recent reserve-manager commentary reinforced that gold buying is being framed as long-horizon allocation rather than only as a response to acute stress.",
    whyItMatters:
      "This matters because the thesis depends on durability of sponsorship. Strategic accumulation makes the demand floor look firmer.",
    thesisImpact: "strengthens",
    analystView:
      "The executive summary should keep leaning into durability of support instead of describing gold only as a hedge."
  }
];

export const seedInsights: Insight[] = [
  {
    id: "insight-gold-demand-floor",
    title: "Gold demand looks more durable than western positioning implies",
    publishedAt: "2026-03-03",
    summary:
      "The strongest takeaway from the current gold material is not simply that demand is positive, but that reserve demand is acting more strategically and less episodically.",
    whatMatters:
      "If that framing is right, gold can remain supported even when short-term investor flows become less cooperative. That improves the quality of the thesis base.",
    relatedFileId: "file-gold-demand-outlook",
    relatedAssetId: "asset-gold",
    reviewStatus: "ready"
  }
];

export const seedFrameworks: InvestmentFramework[] = [
  {
    id: "framework-core",
    name: "Core Investment Framework",
    description: "The active framework the analyst should use when drafting asset work.",
    instructions:
      "Stay grounded in uploaded material, surface disconfirming evidence early, and prefer durable drivers over narrative flourish.",
    questionSet: [
      "What is the core thesis in one sentence?",
      "What evidence in the linked files actually supports it?",
      "What would make this thesis weaker or wrong?"
    ],
    checklist: [
      "Ground the draft in linked files.",
      "Separate thesis, what matters, and counterview.",
      "Flag any missing source support clearly."
    ],
    keyLenses: ["Durability", "Positioning", "Catalyst sensitivity", "Disconfirming evidence"],
    preferredMemoStructure: ["Executive summary", "Thesis", "What matters", "Key risks", "Counterview"],
    redFlags: [
      "Narrative that outruns file evidence",
      "No identified disconfirming evidence",
      "Overconfident language without source support"
    ],
    outputPreferences: ["Be concise", "Use direct language", "Highlight what changed"],
    isActive: true,
    version: 1
  }
];

export const seedChatThreads: ChatThread[] = [
  {
    id: "thread-gold-working",
    title: "Gold working thread",
    updatedAt: "2026-03-09",
    contextType: "asset",
    contextLabel: "Gold",
    relatedAssetId: "asset-gold",
    preview: "Refining what remains underappreciated if reserve demand stays strategic."
  },
  {
    id: "thread-framework",
    title: "Framework review",
    updatedAt: "2026-03-10",
    contextType: "theme",
    contextLabel: "Framework",
    preview: "Testing whether the framework is forcing enough disconfirming work into each asset thread."
  }
];

export const seedChatMessages: ChatMessage[] = [
  {
    id: "message-gold-1",
    threadId: "thread-gold-working",
    createdAt: "2026-03-03",
    author: "Investor",
    body: "What still looks underappreciated in gold if reserve demand is already widely discussed?"
  },
  {
    id: "message-gold-2",
    threadId: "thread-gold-working",
    createdAt: "2026-03-04",
    author: "Analyst",
    body: "The durability of sponsorship may still be underpriced. The market can recognize official buying without fully pricing what it means for downside support over time."
  },
  {
    id: "message-framework-1",
    threadId: "thread-framework",
    createdAt: "2026-03-10",
    author: "Analyst",
    body: "The framework is most useful when it forces each asset draft to separate evidence, risks, and counterview instead of blending them into one confident paragraph."
  }
];

export const seedAnalystPrompts: AnalystPrompt[] = [
  {
    id: "analyst-1",
    title: "Draft from linked files",
    body: "Use the linked files and active framework to tighten the asset executive summary.",
    actionLabel: "Open draft"
  },
  {
    id: "analyst-2",
    title: "Pressure-test the counterview",
    body: "Surface the strongest disconfirming evidence before the thesis hardens.",
    actionLabel: "Review counterview"
  }
];
