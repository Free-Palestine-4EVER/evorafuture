import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Defaults to .next (shared dev server untouched). Set EVORA_DIST to build an
  // isolated production copy — used for the offline/PWA build on a separate port.
  distDir: process.env.EVORA_DIST || ".next",
  turbopack: {
    root: path.join(__dirname),
  },
  // Host Puffer (the staff tool) under /pufferweb on the same domain. Locally it
  // proxies to the Puffer dev server; on Vercel set PUFFER_URL to Puffer's
  // deployment URL.
  async rewrites() {
    const puffer = process.env.PUFFER_URL || "http://localhost:3001";
    return [
      { source: "/pufferweb", destination: `${puffer}/pufferweb` },
      { source: "/pufferweb/:path*", destination: `${puffer}/pufferweb/:path*` },
    ];
  },
};

export default nextConfig;
