import type { MetadataRoute } from "next";

// There was no robots.txt at all. Beyond the basics, this keeps the portal and
// the internal/demo routes out of the index — /v2 and /v3 are near-identical
// copies of the homepage, which is exactly the duplicate-content situation that
// splits ranking signals between three URLs.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/admindashboard",
          "/portal",
          "/login",
          "/join",
          "/evora3dstudio",
          "/v2",
          "/v3",
          "/clientexample",
          "/configurator",
          "/start",
        ],
      },
    ],
    sitemap: "https://evorahome.online/sitemap.xml",
    host: "https://evorahome.online",
  };
}
