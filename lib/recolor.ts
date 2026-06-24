// Live finish-switching for <model-viewer> GLBs — works on desktop and mobile.
//
// Two mechanisms, picked automatically per model:
//   1. KHR_materials_variants — if the GLB ships designed colourways (e.g. the
//      GlamVelvetSofa's Navy/Champagne/…), we switch the *variant*. Clean and
//      exactly as the designer intended.
//   2. baseColorFactor tint — otherwise we multiply the upholstery material's
//      base colour. glTF factors are LINEAR; our swatch hexes are sRGB.
//
// For tinting, single-material pieces colour fully; multi-material pieces colour
// only the upholstery — by name hint when given, else the material(s) closest
// to the "as-shown" colour. Reads are guarded: model-viewer throws on materials
// that haven't lazily loaded (e.g. inactive variants), so we skip those.

type PbrMR = {
  baseColorFactor: number[];
  setBaseColorFactor: (rgba: number[]) => void;
};
type MVMaterial = { name?: string; pbrMetallicRoughness: PbrMR };
export type MVElement = HTMLElement & {
  model?: { materials: MVMaterial[] };
  availableVariants?: string[];
  variantName?: string | null;
};

export function srgbHexToLinear(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const ch = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  const toLin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return [toLin(ch(0)), toLin(ch(2)), toLin(ch(4))];
}

const dist = (c: number[], a: number[]) =>
  (c[0] - a[0]) ** 2 + (c[1] - a[1]) ** 2 + (c[2] - a[2]) ** 2;

// model-viewer throws if you touch a material that isn't loaded yet.
function safeFactor(m: MVMaterial): number[] | null {
  try {
    return m.pbrMetallicRoughness.baseColorFactor;
  } catch {
    return null;
  }
}

export function listVariants(viewer: MVElement | null): string[] {
  try {
    return viewer?.availableVariants ?? [];
  } catch {
    return [];
  }
}

/**
 * Decide which material slots to tint. Call once on load.
 * `nameHints` (substrings, case-insensitive) target upholstery directly.
 */
export function pickUpholsteryIndices(
  viewer: MVElement | null,
  anchorHex: string,
  nameHints?: string[]
): number[] {
  const mats = viewer?.model?.materials;
  if (!mats || mats.length === 0) return [];

  if (nameHints && nameHints.length) {
    const hit = mats
      .map((m, i) => ({ i, n: (m.name ?? "").toLowerCase() }))
      .filter((x) => nameHints.some((h) => x.n.includes(h.toLowerCase())))
      .map((x) => x.i);
    if (hit.length) return hit;
  }

  if (mats.length === 1) return [0];

  // Only materials we can actually read are candidates.
  const usable = mats
    .map((m, i) => ({ i, f: safeFactor(m) }))
    .filter((x): x is { i: number; f: number[] } => x.f != null);
  if (usable.length === 0) return [0];
  if (usable.length === 1) return [usable[0].i];

  const anchor = srgbHexToLinear(anchorHex);
  const ds = usable.map((u) => ({ i: u.i, d: dist(u.f, anchor) }));
  const spread = Math.max(...ds.map((x) => x.d)) - Math.min(...ds.map((x) => x.d));
  if (spread < 0.002) return [usable[0].i];
  const min = Math.min(...ds.map((x) => x.d));
  return ds.filter((x) => x.d <= min + 0.04).map((x) => x.i);
}

/** Paint the given material slots with an sRGB hex. */
export function applyColor(
  viewer: MVElement | null,
  indices: number[],
  hex: string
): void {
  const mats = viewer?.model?.materials;
  if (!mats) return;
  const rgba = [...srgbHexToLinear(hex), 1];
  for (const i of indices) {
    try {
      mats[i]?.pbrMetallicRoughness.setBaseColorFactor(rgba);
    } catch {
      /* material not loaded — skip */
    }
  }
}

/**
 * Apply a finish by colourway. Prefers a matching KHR variant (clean, designed),
 * otherwise tints the given material indices. `name` should match the variant
 * name for variant models.
 */
export function applyFinish(
  viewer: MVElement | null,
  name: string,
  hex: string,
  indices: number[]
): void {
  if (!viewer) return;
  const variants = listVariants(viewer);
  const match = variants.find((v) => v.toLowerCase() === name.toLowerCase());
  if (match) {
    try {
      viewer.variantName = match;
      return;
    } catch {
      /* fall through to tint */
    }
  }
  applyColor(viewer, indices, hex);
}
