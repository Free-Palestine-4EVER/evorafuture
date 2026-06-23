import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Evora — Future Home (Film II) | Khalda, Amman",
  description:
    "Evora Future Home — version II, with an alternate scroll-scrubbed hero film. Premium home furnishing in Khalda, Amman.",
};

// Version B — hero film B (scroll-scrubbed)
export default function HomeV2() {
  return <SiteShell heroVariant="b" />;
}
