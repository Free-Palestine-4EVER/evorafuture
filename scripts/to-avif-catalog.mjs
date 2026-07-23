// One-off: convert the furniture-catalog thumbnail PNGs to AVIF (much smaller —
// these are decoded-in-bulk by CatalogBrowser, which was crashing on mobile).
// Originals are generated stand-in thumbnails (not hand-authored art), so this
// replaces them outright rather than keeping a <picture> fallback.
// Run: node scripts/to-avif-catalog.mjs
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync } from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "public", "models", "catalog");
const DIRS = [ROOT, path.join(ROOT, "thumbs"), path.join(ROOT, "q", "thumbs")];

let converted = 0, srcBytes = 0, outBytes = 0;

for (const dir of DIRS) {
  let entries;
  try { entries = readdirSync(dir); } catch { continue; }
  for (const f of entries) {
    if (!f.toLowerCase().endsWith(".png")) continue;
    const src = path.join(dir, f);
    const dst = src.replace(/\.png$/i, ".avif");
    const before = statSync(src).size;
    await sharp(src).avif({ quality: 60, effort: 6 }).toFile(dst);
    const after = statSync(dst).size;
    srcBytes += before; outBytes += after;
    converted++;
    unlinkSync(src);
  }
}

console.log(`converted ${converted} PNGs to AVIF`);
if (converted) console.log(`${(srcBytes/1024).toFixed(0)}KB -> ${(outBytes/1024).toFixed(0)}KB  (${Math.round((1-outBytes/srcBytes)*100)}% smaller)`);
