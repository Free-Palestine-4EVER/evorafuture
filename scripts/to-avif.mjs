// One-off: create .avif siblings for the site's static photos (kitchen stages,
// configurator swatches, lookbook). Originals are kept as <picture> fallbacks.
// Run: node scripts/to-avif.mjs
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "evora");

// folders (recursively) whose jpg/jpeg/webp we mirror to avif
const TARGETS = ["kitchen", "configurator", "lookbook"];

const AVIF = { quality: 58, effort: 4, chromaSubsampling: "4:2:0" };

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    const s = await stat(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let srcTotal = 0, avifTotal = 0, made = 0, skipped = 0;
for (const folder of TARGETS) {
  const dir = path.join(ROOT, folder);
  if (!existsSync(dir)) continue;
  for await (const file of walk(dir)) {
    if (!/\.(jpe?g|webp)$/i.test(file)) continue;
    const out = file.replace(/\.(jpe?g|webp)$/i, ".avif");
    const srcBytes = (await stat(file)).size;
    if (existsSync(out)) { skipped++; continue; }
    await sharp(file).avif(AVIF).toFile(out);
    const outBytes = (await stat(out)).size;
    srcTotal += srcBytes; avifTotal += outBytes; made++;
    console.log(
      `${path.relative(ROOT, file).padEnd(46)} ${(srcBytes/1024).toFixed(0).padStart(5)}KB -> ${(outBytes/1024).toFixed(0).padStart(5)}KB avif  (${Math.round((1-outBytes/srcBytes)*100)}% smaller)`
    );
  }
}
console.log(`\nmade ${made} avif (skipped ${skipped} existing).`);
if (made) console.log(`total ${(srcTotal/1024/1024).toFixed(2)}MB -> ${(avifTotal/1024/1024).toFixed(2)}MB avif  (${Math.round((1-avifTotal/srcTotal)*100)}% smaller across converted set)`);
