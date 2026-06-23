import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Evora — Future Home (Film III) | Khalda, Amman",
  description:
    "Evora Future Home — version III, with a 60fps scroll-scrubbed hero film walking through Evora's living and bedroom collections. Premium home furnishing in Khalda, Amman.",
};

// Version C — hero film C: a 60fps scroll-scrubbed walk-through built from
// Evora's newest living-room and bedroom photography.
export default function HomeV3() {
  return <SiteShell heroVariant="c" />;
}
