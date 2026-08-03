/**
 * Normalise the "Shop by Room" photos (components/Rooms.tsx) to ONE ratio.
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * The six room photos are three genuinely different shapes on disk:
 *   room-living / room-dining / room-bedrooms  1344x768   (1.750 landscape)
 *   p11 / p10                                  1696x2528  (0.671 portrait)
 *   ig-lounge                                  1320x2552  (0.517 portrait)
 * No single frame ratio can serve 1.75:1 and 0.52:1 — `cover` guts the
 * portraits, `contain` pillarboxes them into huge black voids, and switching
 * the frame's ratio per room (what we did before) makes the section jump
 * shape as you scroll. So we fix the ASSETS instead of the CSS: every room
 * photo is baked to the SAME 7:4 canvas here, and the component then uses one
 * fixed 7 / 4 frame with a plain object-fit: cover.
 *
 * TARGET = 7:4 (1596x912). 7:4 is the native ratio of the three real room
 * renders, so they pass through with zero crop and only a 1.19x upscale. 4:3
 * was the alternative and was rejected: it would have cropped 24% off their
 * width (the fireplace and the marble wall in Living literally fall off) and
 * upscaled them 1.56x.
 *
 * STRATEGY PER SOURCE (chosen automatically from the source ratio):
 *   landscape (>= 1.2)  -> resize fit:'cover'; the crop is nil at 1.75.
 *   portrait  (<  1.2)  -> "blurred fill": the same photo, cover-cropped to
 *                          the canvas, blurred and darkened, as a background;
 *                          the COMPLETE, uncropped photo composited centred on
 *                          top at full canvas height. Nothing is lost, the
 *                          frame is fully filled, and the darkened band keeps
 *                          the white caption/badge overlays legible.
 *
 * Emits .avif + .webp per room into public/evora/rooms/.
 * Idempotent and re-runnable: it only reads from public/evora/*.jpg and
 * overwrites its own output. Run with:
 *   export PATH="$HOME/.local/node/bin:$PATH"
 *   node scripts/normalise-room-images.mjs
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "public/evora");
const OUT_DIR = path.join(ROOT, "public/evora/rooms");

/** 7:4 exactly, ~1600px on the long edge (the stage renders at ~800 CSS px). */
const W = 1596;
const H = 912;

/** Source ratios at or above this are treated as landscape -> plain cover. */
const LANDSCAPE_MIN = 1.2;

/** slug must match the `img` base names used in components/Rooms.tsx */
const ROOMS = [
  { slug: "living", src: "room-living.jpg" },
  { slug: "dining", src: "room-dining.jpg" },
  { slug: "bedroom", src: "room-bedrooms.jpg" },
  { slug: "guest", src: "ig-lounge.jpg" },
  { slug: "tables", src: "p11.jpg" },
  { slug: "chandeliers", src: "p10.jpg" },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { slug, src } of ROOMS) {
  const file = path.join(SRC_DIR, src);
  const { width, height } = await sharp(file).metadata();
  const ratio = width / height;

  let pipeline;
  let mode;

  if (ratio >= LANDSCAPE_MIN) {
    mode = "cover";
    pipeline = sharp(file).resize(W, H, { fit: "cover", position: "centre" });
  } else {
    mode = "blur-fill";
    const bg = await sharp(file)
      .resize(W, H, { fit: "cover", position: "centre" })
      .blur(40)
      .modulate({ brightness: 0.62, saturation: 0.86 })
      .toBuffer();
    // fit:'inside' against the full canvas => bounded by HEIGHT for any
    // portrait source, so the whole photo survives edge to edge vertically.
    const fg = await sharp(file).resize(W, H, { fit: "inside" }).toBuffer();
    pipeline = sharp(bg).composite([{ input: fg, gravity: "centre" }]);
  }

  const base = path.join(OUT_DIR, slug);
  const avif = await pipeline.clone().avif({ quality: 60, effort: 6 }).toFile(`${base}.avif`);
  const webp = await pipeline.clone().webp({ quality: 78 }).toFile(`${base}.webp`);

  console.log(
    `${slug.padEnd(12)} ${src.padEnd(18)} ${String(width)}x${height} (${ratio.toFixed(3)}) ` +
      `-> ${W}x${H} ${mode.padEnd(9)} avif ${(avif.size / 1024).toFixed(1)}KB  webp ${(webp.size / 1024).toFixed(1)}KB`,
  );
}
