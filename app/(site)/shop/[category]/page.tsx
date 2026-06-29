import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Shop from "@/components/Shop";
import Footer from "@/components/Footer";
import { TAXONOMY, getTaxNode } from "@/lib/shopTaxonomy";

// Pre-render the canonical taxonomy slugs; any other slug still resolves at
// request time (unknown slugs fall through to the enquire card, never a 404).
export function generateStaticParams() {
  return Object.keys(TAXONOMY).map((category) => ({ category }));
}

// In Next 16 the dynamic-route `params` is a Promise and MUST be awaited.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const node = getTaxNode(category);
  const label = node?.labelEN ?? "Shop";
  return {
    title: `${label} · Evora Future Home`,
    description: node?.noteEN ?? "Shop the Evora collection — designed, crafted and delivered under one roof in Amman.",
  };
}

export default async function ShopCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return (
    <main>
      <Nav pinnedSolid />
      <Shop seed={category} />
      <Footer />
    </main>
  );
}
