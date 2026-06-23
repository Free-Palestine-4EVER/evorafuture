// Live recolouring for <model-viewer> GLBs — works on desktop and mobile.
//
// glTF baseColorFactor is LINEAR; our swatch hexes are sRGB, so we convert.
// Most pieces are a single material (tint the whole thing). Multi-material
// pieces — e.g. the bed (velvet + white linen + wood) — should only recolour
// the upholstery, so we lock onto the material(s) closest to the "as-shown"
// colour ONCE at load time and keep recolouring exactly those.

type PbrMR = {
  baseColorFactor: number[];
  setBaseColorFactor: (rgba: number[]) => void;
};
type MVMaterial = { pbrMetallicRoughness: PbrMR };
export type MVElement = HTMLElement & { model?: { materials: MVMaterial[] } };

export function srgbHexToLinear(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const ch = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  const toLin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return [toLin(ch(0)), toLin(ch(2)), toLin(ch(4))];
}

const dist = (c: number[], a: number[]) =>
  (c[0] - a[0]) ** 2 + (c[1] - a[1]) ** 2 + (c[2] - a[2]) ** 2;

/**
 * Decide which material slots represent the upholstery. Call once on load.
 * Returns [] if the model isn't ready yet.
 */
export function pickUpholsteryIndices(
  viewer: MVElement | null,
  anchorHex: string
): number[] {
  const mats = viewer?.model?.materials;
  if (!mats || mats.length === 0) return [];
  if (mats.length === 1) return [0];
  const factors = mats.map((m) => m.pbrMetallicRoughness.baseColorFactor);
  // Many GLBs carry colour in textures, leaving every baseColorFactor white —
  // then the per-material colours are indistinguishable. In that case recolour
  // only the primary material (the upholstery, e.g. the bed's velvet) so we
  // don't tint the wood frame and white linen along with it.
  const anchor = srgbHexToLinear(anchorHex);
  const ds = factors.map((f) => dist(f, anchor));
  const spread = Math.max(...ds) - Math.min(...ds);
  if (spread < 0.002) return [0];
  const min = Math.min(...ds);
  // Otherwise lock onto the closest material plus any within a small radius.
  return ds
    .map((d, i) => ({ d, i }))
    .filter((x) => x.d <= min + 0.04)
    .map((x) => x.i);
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
  for (const i of indices) mats[i]?.pbrMetallicRoughness.setBaseColorFactor(rgba);
}
