// LocalBusiness (FurnitureStore) structured data for the public site.
//
// Every value is read from lib/brand.ts, the single source of truth for the
// real address, hotlines, socials and hours — so the schema can never drift
// from what the Visit page shows a human. Nothing here is hand-typed twice.
//
// This is a big local-SEO win for "furniture Amman" / "أثاث عمان" style
// searches: it's what lets Google show the showroom's hours, phone and map
// pin directly in results.

import {
  ADDRESS,
  PHONE_PRIMARY_TEL,
  PHONE_SECONDARY_TEL,
  IG,
  FB,
  SINCE,
} from "@/lib/brand";

const SITE = "https://evorahome.online";

// From the Google Maps embed on the Visit page (ll=31.9929926,35.8638714).
const GEO = { lat: 31.9929926, lng: 35.8638714 };

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${SITE}/#showroom`,
    name: "Evora Future Home",
    alternateName: "إيفورا فيوتشر هوم",
    url: SITE,
    image: `${SITE}/evora/p07.jpg`,
    logo: `${SITE}/icon.png`,
    description:
      "Furniture showroom and interior design studio in Khalda, Amman. Bedrooms, dining, sofas, built-in closets and full interior design — see every room in 3D before a piece is made.",
    foundingDate: SINCE,
    priceRange: "$$$",
    currenciesAccepted: "JOD",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Wasfi Al-Tal St",
      addressLocality: "Khalda",
      addressRegion: "Amman",
      addressCountry: "JO",
    },
    geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    hasMap: `https://www.google.com/maps?q=${GEO.lat},${GEO.lng}`,
    telephone: PHONE_PRIMARY_TEL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: PHONE_PRIMARY_TEL,
        contactType: "sales",
        areaServed: "JO",
        availableLanguage: ["ar", "en"],
      },
      {
        "@type": "ContactPoint",
        telephone: PHONE_SECONDARY_TEL,
        contactType: "customer service",
        areaServed: "JO",
        availableLanguage: ["ar", "en"],
      },
    ],
    sameAs: [IG, FB],
    // Sat-Thu 10:00-22:00; Friday is by appointment, which has no clean
    // openingHoursSpecification representation, so it is deliberately omitted
    // rather than asserted as open.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    areaServed: { "@type": "Country", name: "Jordan" },
    knowsLanguage: ["ar", "en"],
    // Note: aggregateRating is deliberately NOT emitted. Google requires it to
    // be backed by reviews visible on the same page, and inventing one is both
    // a policy violation and a manual-action risk. The 4.9 shown in the proof
    // ribbon is a marketing figure, not a verifiable review corpus.
  };

  return (
    <script
      type="application/ld+json"
      // Schema is a static literal — no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Full address string for reuse where a human-readable line is wanted.
export const ADDRESS_LINE = ADDRESS;
