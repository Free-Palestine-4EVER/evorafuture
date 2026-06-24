// Surface materials for the floor and walls. A material is either the blueprint
// (floor only), a flat colour, a built-in procedural texture, or a user-uploaded
// photo of a real wall/floor. Textures tile at real-world scale so a wood plank or
// tile looks the right size in the room.

import * as THREE from "three";

export type SurfaceMat =
  | { kind: "plan" }
  | { kind: "color"; color: string }
  | { kind: "wood" | "tile" | "marble" | "concrete" }
  | { kind: "image"; src: string };

// real-world size (metres) that one tile of the texture represents
export const TILE_METRES: Record<string, number> = {
  wood: 1.2, tile: 0.45, marble: 2.0, concrete: 1.5, image: 1.5,
};

function canvas(size = 256): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d")!];
}

function noise(ctx: CanvasRenderingContext2D, n: number, alpha: number, color: string) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    ctx.globalAlpha = Math.random() * alpha;
    const x = Math.random() * 256, y = Math.random() * 256, r = Math.random() * 2 + 0.5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawProcedural(kind: string): HTMLCanvasElement {
  const [c, ctx] = canvas();
  if (kind === "wood") {
    ctx.fillStyle = "#a9763f"; ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 42) { // planks
      ctx.fillStyle = "rgba(60,35,15,0.5)"; ctx.fillRect(0, y, 256, 2);
      ctx.fillStyle = "rgba(255,220,170,0.15)"; ctx.fillRect(0, y + 3, 256, 1);
    }
    for (let i = 0; i < 40; i++) { // grain streaks
      ctx.strokeStyle = `rgba(${90 + Math.random() * 40},${55 + Math.random() * 30},25,0.25)`;
      ctx.beginPath(); const y = Math.random() * 256; ctx.moveTo(0, y);
      ctx.bezierCurveTo(85, y + (Math.random() - 0.5) * 10, 170, y + (Math.random() - 0.5) * 10, 256, y);
      ctx.stroke();
    }
  } else if (kind === "tile") {
    ctx.fillStyle = "#dadbdd"; ctx.fillRect(0, 0, 256, 256);
    noise(ctx, 1500, 0.05, "#ffffff");
    ctx.strokeStyle = "#a7a9ad"; ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 256, 256); ctx.strokeRect(128, 0, 0, 256);
    ctx.beginPath(); ctx.moveTo(128, 0); ctx.lineTo(128, 256); ctx.moveTo(0, 128); ctx.lineTo(256, 128); ctx.stroke();
  } else if (kind === "marble") {
    ctx.fillStyle = "#eef0f2"; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = `rgba(120,125,135,${0.1 + Math.random() * 0.25})`; ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.beginPath(); ctx.moveTo(Math.random() * 256, 0);
      ctx.bezierCurveTo(Math.random() * 256, 85, Math.random() * 256, 170, Math.random() * 256, 256); ctx.stroke();
    }
  } else { // concrete
    ctx.fillStyle = "#c4c5c2"; ctx.fillRect(0, 0, 256, 256);
    noise(ctx, 4000, 0.12, "#8f9089"); noise(ctx, 2000, 0.1, "#e6e7e3");
  }
  return c;
}

function configure(t: THREE.Texture): THREE.Texture {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function proceduralTexture(kind: string): THREE.Texture {
  return configure(new THREE.CanvasTexture(drawProcedural(kind)));
}

export function imageTexture(src: string): THREE.Texture {
  return configure(new THREE.TextureLoader().load(src));
}
