import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Defaults to .next (shared dev server untouched). Set EVORA_DIST to build an
  // isolated production copy — used for the offline/PWA build on a separate port.
  distDir: process.env.EVORA_DIST || ".next",
  turbopack: {
    root: path.join(__dirname),
  },
  // Studio route was renamed /pufferweb → /evora3dstudio; keep old links working.
  async redirects() {
    return [
      { source: "/pufferweb", destination: "/evora3dstudio", permanent: true },
    ];
  },
};

export default nextConfig;
