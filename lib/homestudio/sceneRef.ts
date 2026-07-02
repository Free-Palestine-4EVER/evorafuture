// A handle to the live Three.js scene so the exporter can pull the REAL geometry
// (detailed furniture + loaded product GLBs) instead of rebuilding bounding boxes.
import type { Object3D } from "three";

export const sceneRef: { current: Object3D | null } = { current: null };
