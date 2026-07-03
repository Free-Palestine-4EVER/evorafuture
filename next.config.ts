import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Defaults to .next (shared dev server untouched). Set EVORA_DIST to build an
  // isolated production copy — used for the offline/PWA build on a separate port.
  distDir: process.env.EVORA_DIST || ".next",
  turbopack: {
    root: path.join(__dirname),
  },
  // The /api/portal function only touches the local DB + file storage. Keep the
  // heavy client-only / script-only libraries (3D, media, Firebase client, canvas,
  // pdf) OUT of its server trace so it stays well under Vercel's 250MB function
  // limit. These are never imported by any API route at runtime.
  outputFileTracingExcludes: {
    "/api/**": [
      "node_modules/three/**",
      "node_modules/three-stdlib/**",
      "node_modules/@google/model-viewer/**",
      "node_modules/stats-gl/**",
      "node_modules/hls.js/**",
      "node_modules/@firebase/**",
      "node_modules/firebase/**",
      "node_modules/@napi-rs/**",
      "node_modules/pdfjs-dist/**",
      "node_modules/@react-three/**",
    ],
  },
  // Studio route was renamed /pufferweb → /evora3dstudio; keep old links working.
  async redirects() {
    return [
      { source: "/pufferweb", destination: "/evora3dstudio", permanent: true },
    ];
  },
};

export default nextConfig;
