import { notFound } from "next/navigation";

import { ResearchDetailView } from "@/components/research/research-detail-view";
import { getAssetBySlug } from "@/lib/repositories";

export default async function AssetResearchDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAssetBySlug(slug);

  if (!item) {
    notFound();
  }

  return <ResearchDetailView item={item} />;
}
