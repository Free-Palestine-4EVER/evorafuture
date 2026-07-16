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
  //
  // lib/portal/localdb.ts reads its JSON file via a non-literal path
  // (`process.env.EVORA_DB_FILE || path.join(...)`), which @vercel/nft can't
  // statically resolve — its fallback is to conservatively trace the WHOLE
  // project into this function's bundle (public/models + public/evora alone
  // are 600MB+), which is what was tipping every deploy over Vercel's limit.
  // Explicitly excluding the non-runtime asset/media/vendor dirs fixes that.
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
      "public/**",
      "3d-assets/**",
      "backups/**",
      ".evora-uploads/**",
      ".next-prod/**",
      ".git/**",
    ],
  },
  // The DWG/CAD WASM lib (@mlightcad/libredwg-web) references node built-ins
  // (node:module) that must not be bundled into the browser build. Turbopack
  // handles this; the webpack builder (used on the low-RAM self-host box) needs
  // these stubbed to empty in the client bundle.
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        module: false, fs: false, path: false, crypto: false, os: false,
      };
      // `fallback` only catches bare specifiers (e.g. "module"), not "node:"
      // URI-scheme imports (e.g. "node:module") — webpack 5 resolves those
      // through a separate scheme handler that fallback can't intercept.
      // IgnorePlugin drops the import entirely (stubbed to an empty module).
      config.plugins = config.plugins || [];
      config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^node:/ }));
    }
    return config;
  },
  // Long immutable caching for the heavy static media (scroll-scrub frame
  // sequences, 3D models, posters). Without this Vercel serves public/ files
  // with `max-age=0, must-revalidate`, so every repeat visit re-negotiates
  // 1100+ frame files — brutal from far-away countries. These assets never
  // change in place: a re-encode MUST bump the directory/file name (e.g.
  // hero-frames-c2/) or returning visitors keep stale cached copies.
  async headers() {
    const immutable = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/evora/:path*", headers: immutable },
      { source: "/evora-legacy/:path*", headers: immutable },
      { source: "/models/:path*", headers: immutable },
      { source: "/posters/:path*", headers: immutable },
      { source: "/textures/:path*", headers: immutable },
    ];
  },
  // Studio route was renamed /pufferweb → /evora3dstudio; keep old links working.
  async redirects() {
    // The Puffer-derived 3D studio TOOL is not part of the public website.
    // On Vercel (VERCEL=1 at build time) its routes bounce to the homepage —
    // the deployed site is the website only. Local dev keeps the tool.
    if (process.env.VERCEL) {
      return [
        { source: "/evora3dstudio", destination: "/", permanent: false },
        { source: "/evora3dstudio/:path*", destination: "/", permanent: false },
        { source: "/pufferweb", destination: "/", permanent: false },
      ];
    }
    return [
      { source: "/pufferweb", destination: "/evora3dstudio", permanent: true },
    ];
  },
};

export default nextConfig;
