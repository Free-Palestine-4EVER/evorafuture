import { products } from "./products";

// Where each piece stands on the showroom floor.
export interface Placement {
  id: string;
  x: number;
  z: number;
  rotY: number;
  pedestal?: number;
}

export const ROOM = {
  w: 26, // floor width  (x)
  d: 18, // floor depth  (z)
  wallH: 4.4,
};

// Vantage points the visitor can travel to (eye height ~1.6 m inside the room).
export interface Vantage {
  id: string;
  label: string;
  cam: [number, number, number];
  target: [number, number, number];
}

export const vantages: Vantage[] = [
  { id: "overview", label: "Overview", cam: [16, 10, 20], target: [0, 0.7, 0] },
  { id: "entrance", label: "Walk in", cam: [0, 1.65, 8.5], target: [0, 0.8, -2] },
  { id: "left", label: "Left wing", cam: [-6.5, 1.65, 3.5], target: [-7, 0.8, -4] },
  { id: "right", label: "Right wing", cam: [6.5, 1.65, 3.5], target: [7, 0.8, -4] },
  { id: "back", label: "Back row", cam: [0, 1.65, -1.5], target: [0, 0.8, -7] },
];

// Auto-arrange ALL products in a tidy showroom grid (everything on the floor).
const COLS = 6;
const SX = 4.0; // column spacing
const SZ = 3.4; // row spacing
const rows = Math.ceil(products.length / COLS);

export const showroomLayout: Placement[] = products.map((p, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  // centre the grid; last (short) row is nudged to stay centred
  const itemsInRow = Math.min(COLS, products.length - row * COLS);
  const x = (col - (itemsInRow - 1) / 2) * SX;
  const z = (row - (rows - 1) / 2) * SZ;
  // gentle per-piece rotation so it reads as styled, not a warehouse
  const rotY = (((i * 37) % 7) - 3) * 0.09;
  return { id: p.id, x, z, rotY };
});
