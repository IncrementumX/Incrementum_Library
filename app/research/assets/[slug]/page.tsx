import { notFound } from "next/navigation";

import { ResearchDetailView } from "@/components/research/research-detail-view";
import { getResearchItemBySlug } from "@/lib/repositories";

export default async function AssetResearchDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getResearchItemBySlug(slug, "asset");

  if (!item) {
    notFound();
  }

  return <ResearchDetailView item={item} />;
}
