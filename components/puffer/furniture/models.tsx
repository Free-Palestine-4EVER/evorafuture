"use client";

// Procedural furniture models. Each model is built from primitives that fill the
// product's TRUE bounding box (w × d × h, in metres here). This keeps every piece
// dimension-accurate — the same rule that will hold when these are swapped for the
// client's real GLB models later. Footprint is centred on the origin; the piece
// sits on the floor (y from 0 to h). x = width, z = depth, y = height.

import { Product } from "@/lib/puffer/types";

interface MatProps {
  color: string;
  emissive: string;
  emissiveIntensity: number;
}

function Part({
  size, pos, mat, roughness = 0.7,
}: {
  size: [number, number, number];
  pos: [number, number, number];
  mat: MatProps;
  roughness?: number;
}) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={mat.color}
        emissive={mat.emissive}
        emissiveIntensity={mat.emissiveIntensity}
        roughness={roughness}
        metalness={0.05}
      />
    </mesh>
  );
}

// --- builders ----------------------------------------------------------------

function Sofa({ w, d, h, mat }: Dims & { mat: MatProps }) {
  const backT = Math.min(d * 0.2, 0.18);
  const armW = Math.min(w * 0.12, 0.16);
  const seatH = h * 0.42;
  const innerD = d - backT;
  const seatW = w - armW * 2;
  return (
    <group>
      {/* backrest */}
      <Part size={[w, h, backT]} pos={[0, h / 2, d / 2 - backT / 2]} mat={mat} />
      {/* seat base */}
      <Part size={[w, seatH, innerD]} pos={[0, seatH / 2, -backT / 2]} mat={mat} />
      {/* arms */}
      <Part size={[armW, h * 0.6, innerD]} pos={[-(w / 2 - armW / 2), h * 0.3, -backT / 2]} mat={mat} />
      <Part size={[armW, h * 0.6, innerD]} pos={[w / 2 - armW / 2, h * 0.3, -backT / 2]} mat={mat} />
      {/* seat cushions */}
      <Part size={[seatW, h * 0.16, innerD * 0.9]} pos={[0, seatH + h * 0.08, -backT / 2]} mat={mat} roughness={0.85} />
    </group>
  );
}

function Table({ w, d, h, mat }: Dims & { mat: MatProps }) {
  const topT = Math.min(h * 0.12, 0.06);
  const legT = Math.min(w, d) * 0.08;
  const inset = legT * 0.9;
  const legH = h - topT;
  const lx = w / 2 - inset, lz = d / 2 - inset;
  const leg = (x: number, z: number) => (
    <Part size={[legT, legH, legT]} pos={[x, legH / 2, z]} mat={mat} />
  );
  return (
    <group>
      <Part size={[w, topT, d]} pos={[0, h - topT / 2, 0]} mat={mat} roughness={0.5} />
      {leg(-lx, -lz)}{leg(lx, -lz)}{leg(-lx, lz)}{leg(lx, lz)}
    </group>
  );
}

function Chair({ w, d, h, mat }: Dims & { mat: MatProps }) {
  const seatH = h * 0.5;
  const seatT = h * 0.08;
  const legT = Math.min(w, d) * 0.1;
  const inset = legT;
  const lx = w / 2 - inset, lz = d / 2 - inset;
  const legH = seatH - seatT;
  const leg = (x: number, z: number) => <Part size={[legT, legH, legT]} pos={[x, legH / 2, z]} mat={mat} />;
  return (
    <group>
      {leg(-lx, -lz)}{leg(lx, -lz)}{leg(-lx, lz)}{leg(lx, lz)}
      <Part size={[w, seatT, d]} pos={[0, seatH - seatT / 2, 0]} mat={mat} />
      {/* backrest */}
      <Part size={[w, h - seatH, legT]} pos={[0, seatH + (h - seatH) / 2, d / 2 - legT / 2]} mat={mat} />
    </group>
  );
}

function Bed({ w, d, h, mat }: Dims & { mat: MatProps }) {
  const frameH = h * 0.45;
  const mattressH = h * 0.4;
  const headH = h * 1.6;
  const headT = Math.min(d * 0.06, 0.08);
  return (
    <group>
      {/* frame */}
      <Part size={[w, frameH, d]} pos={[0, frameH / 2, 0]} mat={mat} />
      {/* mattress */}
      <Part size={[w * 0.96, mattressH, d * 0.96]} pos={[0, frameH + mattressH / 2, 0]} mat={mat} roughness={0.9} />
      {/* headboard at -z end */}
      <Part size={[w, headH, headT]} pos={[0, headH / 2, -d / 2 + headT / 2]} mat={mat} />
      {/* pillows */}
      <Part size={[w * 0.42, h * 0.18, d * 0.18]} pos={[-w * 0.24, frameH + mattressH + h * 0.05, -d * 0.32]} mat={mat} roughness={0.95} />
      <Part size={[w * 0.42, h * 0.18, d * 0.18]} pos={[w * 0.24, frameH + mattressH + h * 0.05, -d * 0.32]} mat={mat} roughness={0.95} />
    </group>
  );
}

function Cabinet({ w, d, h, mat, shelves = 0 }: Dims & { mat: MatProps; shelves?: number }) {
  const wallT = Math.min(w, d) * 0.05;
  const parts: React.ReactNode[] = [];
  // body shell
  parts.push(<Part key="back" size={[w, h, wallT]} pos={[0, h / 2, d / 2 - wallT / 2]} mat={mat} />);
  parts.push(<Part key="bottom" size={[w, wallT, d]} pos={[0, wallT / 2, 0]} mat={mat} />);
  parts.push(<Part key="top" size={[w, wallT, d]} pos={[0, h - wallT / 2, 0]} mat={mat} />);
  parts.push(<Part key="left" size={[wallT, h, d]} pos={[-w / 2 + wallT / 2, h / 2, 0]} mat={mat} />);
  parts.push(<Part key="right" size={[wallT, h, d]} pos={[w / 2 - wallT / 2, h / 2, 0]} mat={mat} />);
  if (shelves > 0) {
    // open shelving (bookshelf): horizontal boards, no doors
    for (let i = 1; i <= shelves; i++) {
      const y = (h / (shelves + 1)) * i;
      parts.push(<Part key={`sh${i}`} size={[w - wallT * 2, wallT, d - wallT]} pos={[0, y, 0]} mat={mat} />);
    }
  } else {
    // doors with handles
    const gap = 0.004;
    const doorW = w / 2 - gap;
    const doorT = wallT * 0.8;
    parts.push(<Part key="dL" size={[doorW, h - wallT * 2, doorT]} pos={[-w / 4, h / 2, -d / 2 + doorT / 2]} mat={mat} roughness={0.5} />);
    parts.push(<Part key="dR" size={[doorW, h - wallT * 2, doorT]} pos={[w / 4, h / 2, -d / 2 + doorT / 2]} mat={mat} roughness={0.5} />);
    const hMat: MatProps = { ...mat, color: "#cbd5e1" };
    parts.push(<Part key="hL" size={[0.02, h * 0.12, 0.02]} pos={[-gap - 0.02, h / 2, -d / 2 - 0.01]} mat={hMat} />);
    parts.push(<Part key="hR" size={[0.02, h * 0.12, 0.02]} pos={[gap + 0.02, h / 2, -d / 2 - 0.01]} mat={hMat} />);
  }
  return <group>{parts}</group>;
}

interface Dims { w: number; d: number; h: number; }

// --- dispatcher --------------------------------------------------------------

export function ProductModel({
  product, oversize, selected,
}: {
  product: Product;
  oversize: boolean;
  selected: boolean;
}) {
  const w = product.dimensions_mm.w / 1000;
  const d = product.dimensions_mm.d / 1000;
  const h = product.dimensions_mm.h / 1000;
  const mat: MatProps = {
    color: oversize ? "#ef4444" : product.color,
    emissive: selected ? "#0ea5e9" : "#000000",
    emissiveIntensity: selected ? 0.4 : 0,
  };
  const dims = { w, d, h, mat };

  switch (product.id) {
    case "sofa-3seat":
    case "sofa-2seat":
    case "armchair":
      return <Sofa {...dims} />;
    case "coffee-table":
    case "dining-table":
      return <Table {...dims} />;
    case "dining-chair":
      return <Chair {...dims} />;
    case "bed-queen":
      return <Bed {...dims} />;
    case "wardrobe":
      return <Cabinet {...dims} />;
    case "bookshelf":
      return <Cabinet {...dims} shelves={4} />;
    case "tv-unit":
      return <Cabinet {...dims} />;
    default:
      return (
        <mesh position={[0, h / 2, 0]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={mat.color} emissive={mat.emissive} emissiveIntensity={mat.emissiveIntensity} roughness={0.7} />
        </mesh>
      );
  }
}
