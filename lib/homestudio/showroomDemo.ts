// The curated demo room the Showroom reveals. Same shape the editor's store
// serialises (walls + furniture rects in plan-image pixels), so it stays 100%
// compatible with the real pipeline — these are real catalog products (k-* ids)
// sized to fit their slots, so nothing flags oversize.
//
// Room: Living + Dining, 7.0 × 4.5 m, 10 mm per pixel (matches the bundled
// living-dining sample plan we use as the blueprint backdrop).

import { Rect, Wall } from "./types";

const wall = (id: string, x1: number, y1: number, x2: number, y2: number, height: Wall["height"] = "full"): Wall =>
  ({ id, x1, y1, x2, y2, height, source: "manual" });

const slot = (id: string, productId: string, x: number, y: number, w: number, h: number, rotationDeg = 0): Rect =>
  ({ id, productId, x, y, w, h, rotationDeg });

export const DEMO = {
  name: "Living + Dining",
  planSrc: "/samples/living-dining.svg",
  imgW: 700,
  imgH: 450,
  mmPerPx: 10,
  floorMatId: "oak", // procedural oak (textures.ts)
  wallColor: "#e9e2d6", // soft off-white walls

  // Perimeter (full height) + a half-height fin partition between living & dining.
  walls: [
    wall("w-top", 20, 20, 680, 20),
    wall("w-right", 680, 20, 680, 430),
    wall("w-bottom", 680, 430, 20, 430),
    wall("w-left", 20, 430, 20, 20),
    wall("w-fin", 380, 20, 380, 150, "half"),
  ] as Wall[],

  // Furniture — rug first so it reads as "under" the seating group. Slots are
  // sized to each product's true mm footprint (÷10 px) with a little margin.
  rects: [
    // Living (left of the fin)
    slot("r-rug", "k-rugRectangle", 90, 150, 205, 150),
    slot("r-sofa", "k-loungeSofa", 95, 50, 190, 92),
    slot("r-coffee", "k-tableCoffee", 130, 178, 118, 66),
    slot("r-lounge", "k-loungeChair", 95, 300, 88, 92),
    slot("r-tvcab", "k-cabinetTelevision", 105, 372, 168, 52),
    slot("r-plant", "k-pottedPlant", 312, 58, 46, 46),
    slot("r-lamp", "k-lampRoundFloor", 312, 300, 46, 46),
    // Dining (right of the fin)
    slot("r-dtable", "k-table", 452, 158, 168, 96),
    slot("r-dchair-1", "k-chair", 452, 92, 54, 58),
    slot("r-dchair-2", "k-chair", 566, 92, 54, 58, 180),
    slot("r-dchair-3", "k-chair", 452, 256, 54, 58),
    slot("r-dchair-4", "k-chair", 566, 256, 54, 58, 180),
    slot("r-books", "k-bookcaseOpen", 470, 30, 88, 36),
  ] as Rect[],
};
