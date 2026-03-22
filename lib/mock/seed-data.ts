import {
  AnalystPrompt,
  ChatMessage,
  ChatThread,
  Insight,
  LibraryFile,
  LibraryFolder,
  ResearchItem,
  ResearchUpdate
} from "@/types/domain";

export const seedFolders: LibraryFolder[] = [
  {
    id: "folder-inbox",
    slug: "inbox",
    name: "Inbox",
    description: "Fresh materials waiting to be reviewed, summarized, or linked into research."
  },
  {
    id: "folder-monetary-metals",
    slug: "monetary-metals",
    name: "Monetary Metals",
    description: "Working documents tied to gold, silver, and monetary framing."
  },
  {
    id: "folder-uranium",
    slug: "uranium",
    name: "Uranium",
    description: "Fuel-cycle, contracting, and sector-specific source material."
  }
];

export const seedFiles: LibraryFile[] = [
  {
    id: "file-gold-demand-outlook",
    slug: "world-gold-council-demand-outlook",
    folderId: "folder-monetary-metals",
    title: "World Gold Council Demand Outlook",
    author: "World Gold Council",
    kind: "Report",
    publishedAt: "2026-02-12",
    addedAt: "2026-03-02",
    tags: ["Gold", "Reserve demand"],
    linkedResearchIds: ["asset-gold"],
    summaryStatus: "processed",
    processingStatus: "summary-ready",
    summary:
      "Official-sector demand remains the highest-signal point in the document. The report is most useful for showing that support for gold is broadening beyond tactical western flows.",
    keyTakeaways: [
      "Central-bank accumulation remains structurally elevated.",
      "ETF flows still matter tactically, but they are not the whole story.",
      "The demand base looks more durable than a simple fear-trade framing suggests."
    ],
    excerpts: [
      "Central-bank demand remains above historical averages.",
      "Investment demand is increasingly sensitive to policy credibility and real-rate expectations."
    ],
    analystInterpretation:
      "This file matters because it strengthens the durability of the gold thesis. The useful conclusion is not that gold demand is universally strong, but that the marginal buyer base is more strategic than many market narratives assume."
  },
  {
    id: "file-uranium-contracting-note",
    slug: "uranium-contracting-note",
    folderId: "folder-uranium",
    title: "Utility Contracting Note",
    author: "Internal Research",
    kind: "Memo",
    publishedAt: "2026-03-06",
    addedAt: "2026-03-08",
    tags: ["Uranium", "Contracting"],
    linkedResearchIds: ["sector-uranium"],
    summaryStatus: "needs-review",
    processingStatus: "processing",
    summary:
      "A working note focused on uncovered utility requirements and the mismatch between muted spot headlines and a firmer contracting backdrop.",
    keyTakeaways: [
      "Contracting remains the better signal than spot volatility.",
      "Delayed procurement is still the cleanest bear-case variable.",
      "The note is useful, but it needs stronger disconfirming evidence."
    ],
    excerpts: [
      "Spot optics continue to understate progress in procurement behavior.",
      "The market still appears too casual about replacement supply."
    ],
    analystInterpretation:
      "Useful for refining the uranium thread, but not complete enough to drive a rewrite on its own. It should be treated as a working input rather than a finished source of record."
  },
  {
    id: "file-copper-supply-letter",
    slug: "copper-supply-letter",
    folderId: "folder-inbox",
    title: "Copper Supply Constraint Letter",
    author: "Helios Resource Research",
    kind: "Research Letter",
    publishedAt: "2026-01-29",
    addedAt: "2026-03-11",
    tags: ["Copper", "Supply"],
    linkedResearchIds: ["sector-copper"],
    summaryStatus: "processed",
    processingStatus: "summary-ready",
    summary:
      "The file is most useful as a supply-discipline document. It supports a longer-duration copper framing without forcing the thesis into a near-term macro call.",
    keyTakeaways: [
      "Supply elasticity remains weaker than broad consensus suggests.",
      "Long project timelines make scarcity a time-based thesis.",
      "Demand timing can wobble while the supply problem remains."
    ],
    excerpts: [
      "Greenfield supply is harder to underwrite with confidence.",
      "Higher prices alone may not close the medium-term supply gap."
    ],
    analystInterpretation:
      "A credible anchor file for the copper sector. It does not prove timing, but it does help support a persistence-based framing built around supply replacement difficulty."
  }
];

export const seedResearchItems: ResearchItem[] = [
  {
    id: "asset-gold",
    slug: "gold",
    title: "Gold",
    type: "asset",
    categoryLabel: "Asset",
    status: "active",
    executiveSummary:
      "Gold currently reads best as a durability thesis rather than a crisis trade. The strongest working view is that reserve demand and policy distrust are creating a firmer base of sponsorship than short-term ETF or real-rate narratives capture.",
    keyPillars: [
      "Reserve demand is more strategic than tactical.",
      "Policy credibility matters even outside acute stress.",
      "The downside case depends more on timing than on thesis breakage."
    ],
    coreView:
      "This thread should stay focused on durability of support and what remains underpriced if official-sector demand persists.",
    linkedFileIds: ["file-gold-demand-outlook"],
    updateIds: ["update-gold-reserve-demand"],
    primaryThreadId: "thread-gold-working"
  },
  {
    id: "asset-silver",
    slug: "silver",
    title: "Silver",
    type: "asset",
    categoryLabel: "Asset",
    status: "seeded",
    executiveSummary:
      "Working thesis not yet drafted. Add files, notes, and questions to let the analyst build this thread with you.",
    keyPillars: ["No pillars defined yet."],
    coreView:
      "This research item is seeded but still waiting on materials and a first-pass thesis.",
    linkedFileIds: [],
    updateIds: []
  },
  {
    id: "sector-uranium",
    slug: "uranium",
    title: "Uranium",
    type: "sector",
    categoryLabel: "Sector",
    status: "active",
    executiveSummary:
      "The uranium thread remains strongest when treated as a contracting and supply-discipline story. The key question is not whether the spot market looks dramatic today, but whether utility procurement and replacement supply are moving fast enough.",
    keyPillars: [
      "Contracting matters more than spot noise.",
      "Replacement supply still looks slower than casual narratives imply.",
      "The bear case is delay, not disappearance, of the thesis."
    ],
    coreView:
      "Keep this as an iteration-first sector thread with strong disconfirming work on delayed procurement.",
    linkedFileIds: ["file-uranium-contracting-note"],
    updateIds: ["update-uranium-contracting"],
    primaryThreadId: "thread-uranium-working"
  },
  {
    id: "sector-copper",
    slug: "copper",
    title: "Copper",
    type: "sector",
    categoryLabel: "Sector",
    status: "seeded",
    executiveSummary:
      "Copper is seeded as a long-duration scarcity thread, but the research still needs more source depth before the thesis should be treated as fully drafted.",
    keyPillars: [
      "Supply replacement appears difficult.",
      "Time is part of the thesis.",
      "The demand path still needs tighter framing."
    ],
    coreView:
      "This is a good candidate for continued buildout once more source material is added.",
    linkedFileIds: ["file-copper-supply-letter"],
    updateIds: []
  }
];

export const seedResearchUpdates: ResearchUpdate[] = [
  {
    id: "update-gold-reserve-demand",
    researchItemId: "asset-gold",
    title: "Reserve demand still looks strategic rather than reactive",
    happenedAt: "2026-03-01",
    whatChanged:
      "Recent reserve-manager commentary reinforced that gold buying is being framed as long-horizon allocation rather than only as a response to acute stress.",
    whyItMatters:
      "This matters because the gold thesis depends on durability of sponsorship. Strategic accumulation makes the demand floor look firmer.",
    thesisImpact: "strengthens",
    analystView:
      "The executive summary should lean more clearly into durability of support, not simply macro anxiety."
  },
  {
    id: "update-uranium-contracting",
    researchItemId: "sector-uranium",
    title: "Contracting backdrop appears firmer than the tape suggests",
    happenedAt: "2026-03-08",
    whatChanged:
      "Utility procurement discussions appear broader even though spot headlines remain too noisy to communicate that shift cleanly.",
    whyItMatters:
      "The sector thesis depends on procurement urgency and replacement supply, not on whether the spot market looks exciting this week.",
    thesisImpact: "strengthens",
    analystView:
      "Useful confirmation, but not enough to become complacent. The delayed-procurement bear case still needs to stay active in the thread."
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
    relatedResearchId: "asset-gold",
    reviewStatus: "ready"
  },
  {
    id: "insight-uranium-bear-case",
    title: "The uranium bear case is delay, not immediate thesis failure",
    publishedAt: "2026-03-09",
    summary:
      "Current uranium work suggests the real pressure point is whether utilities delay procurement longer than expected, not whether the structural case disappears.",
    whatMatters:
      "That distinction changes how the thread should be updated. We should focus on timing sensitivity and procurement behavior rather than treating every soft tape as a thesis break.",
    relatedFileId: "file-uranium-contracting-note",
    relatedResearchId: "sector-uranium",
    relatedThreadId: "thread-uranium-working",
    reviewStatus: "draft"
  }
];

export const seedChatThreads: ChatThread[] = [
  {
    id: "thread-gold-working",
    title: "Gold working thread",
    updatedAt: "2026-03-09",
    contextType: "asset",
    contextLabel: "Gold",
    relatedResearchId: "asset-gold",
    preview: "Refining what remains underappreciated if reserve demand stays strategic."
  },
  {
    id: "thread-uranium-working",
    title: "Uranium contracting thread",
    updatedAt: "2026-03-08",
    contextType: "sector",
    contextLabel: "Uranium",
    relatedResearchId: "sector-uranium",
    preview: "Pressure-testing the delayed-procurement bear case."
  },
  {
    id: "thread-framework",
    title: "Scarcity framework",
    updatedAt: "2026-03-10",
    contextType: "theme",
    contextLabel: "Cross-asset",
    preview: "Testing whether strategic scarcity is a useful frame across metals and uranium."
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
    id: "message-gold-3",
    threadId: "thread-gold-working",
    createdAt: "2026-03-09",
    author: "Analyst",
    body: "I would revise the summary to emphasize reserve diversification and durability rather than describing gold only as a hedge."
  },
  {
    id: "message-uranium-1",
    threadId: "thread-uranium-working",
    createdAt: "2026-03-05",
    author: "Investor",
    body: "Develop the strongest version of the delayed-contracting bear case. I do not want the page to read like advocacy."
  },
  {
    id: "message-uranium-2",
    threadId: "thread-uranium-working",
    createdAt: "2026-03-06",
    author: "Analyst",
    body: "The cleanest bear case is that uncovered requirements remain real, but procurement still moves slowly because buyers retain confidence in inventory flexibility and secondary supply."
  },
  {
    id: "message-framework-1",
    threadId: "thread-framework",
    createdAt: "2026-03-10",
    author: "Analyst",
    body: "There may be a shared frame across gold, uranium, and copper around strategic scarcity and institutional response, but it needs more source support before it becomes a top-level worldview."
  }
];

export const seedAnalystPrompts: AnalystPrompt[] = [
  {
    id: "analyst-1",
    title: "Draft a tighter summary",
    body: "Turn the latest file notes into a cleaner executive summary or insight.",
    actionLabel: "Open draft"
  },
  {
    id: "analyst-2",
    title: "Pressure-test a thesis",
    body: "Surface the strongest disconfirming evidence before the thread hardens into a fixed view.",
    actionLabel: "Review counterview"
  }
];
