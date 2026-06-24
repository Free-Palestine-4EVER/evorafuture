// Ready-made demo floor plans. Each carries its known scale (mmPerPx) so loading
// one skips calibration entirely — straight to drawing furniture slots.
export interface Sample {
  id: string;
  name: string;
  src: string;
  imgW: number;
  imgH: number;
  mmPerPx: number;
}

export const SAMPLES: Sample[] = [
  { id: "studio",        name: "Studio · 5.0 × 4.0 m",        src: "/samples/studio.svg",        imgW: 500, imgH: 400, mmPerPx: 10 },
  { id: "one-bedroom",   name: "One-Bedroom · 8.0 × 6.0 m",   src: "/samples/one-bedroom.svg",   imgW: 800, imgH: 600, mmPerPx: 10 },
  { id: "living-dining", name: "Living + Dining · 7.0 × 4.5 m", src: "/samples/living-dining.svg", imgW: 700, imgH: 450, mmPerPx: 10 },
];
