// Turn an uploaded 2D plan file into a raster the app can use. Supports common
// image formats (PNG/JPG/WEBP/GIF/BMP/SVG) and PDF (architects' usual format) —
// the first PDF page is rendered to a canvas via pdf.js.
//
// CAD vector files (DWG/DXF) are a different, vector pipeline — not handled here yet.

// NOTE: pdf.js touches browser-only globals (DOMMatrix) at module load, which
// crashes during SSR. So we import it dynamically, only when a PDF is actually
// dropped in (always client-side).

export interface LoadedPlan {
  dataUrl: string;
  width: number;
  height: number;
  /** real-world scale, set when the source carries true dimensions (e.g. DXF) */
  mmPerPx?: number;
}

const ext = (file: File) => file.name.toLowerCase().split(".").pop() || "";

export function isPdf(file: File): boolean {
  return file.type === "application/pdf" || ext(file) === "pdf";
}
export function isDxf(file: File): boolean {
  return ext(file) === "dxf";
}
export function isDwg(file: File): boolean {
  return ext(file) === "dwg";
}

function renderImage(file: File): Promise<LoadedPlan> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const url = reader.result as string;
      const img = new Image();
      img.onload = () => resolve({ dataUrl: url, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = url;
    };
    reader.readAsDataURL(file);
  });
}

async function renderPdf(file: File): Promise<LoadedPlan> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"; // static file in /public
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const target = 1600; // render the page so its longest side is ~1600px
  const scale = Math.min(3, target / Math.max(base.width, base.height));
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return { dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
}

// AutoCAD INSUNITS code → millimetres per drawing-unit
const INSUNITS_MM: Record<number, number> = { 1: 25.4, 2: 304.8, 4: 1, 5: 10, 6: 1000 };

async function renderDxf(file: File): Promise<LoadedPlan> {
  const text = await file.text();
  const { Helper } = await import("dxf");
  const helper = new Helper(text);

  const { bbox } = helper.toPolylines();
  if (!bbox?.valid) throw new Error("empty or unreadable DXF");
  const wU = bbox.max.x - bbox.min.x;
  const hU = bbox.max.y - bbox.min.y;
  const maxU = Math.max(wU, hU) || 1000;

  // rasterise the DXF's SVG into a clean dark-on-white plan image
  const target = 1600;
  const scale = Math.min(3, target / maxU);
  const outW = Math.max(1, Math.round(wU * scale));
  const outH = Math.max(1, Math.round(hU * scale));
  const strokeU = maxU / 320;

  let svg = helper.toSVG()
    .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeU}"`)
    .replace(/stroke="[^"]*"/g, 'stroke="#1f2937"')
    .replace('width="100%"', `width="${outW}"`)
    .replace('height="100%"', `height="${outH}"`);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const im = new Image();
    im.onload = () => { URL.revokeObjectURL(url); resolve(im); };
    im.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    im.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = outW; canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, outW, outH);
  ctx.drawImage(img, 0, 0, outW, outH);

  // true scale: DXF units → mm. Use INSUNITS if present, else infer from size
  // (a building is thousands of mm, hundreds of cm, or single-digit metres).
  const insunits = Number(helper.parsed?.header?.["$INSUNITS"]);
  const unitMm = INSUNITS_MM[insunits] ?? (maxU > 1000 ? 1 : maxU > 100 ? 10 : 1000);
  const mmPerPx = (maxU * unitMm) / Math.max(outW, outH);

  return { dataUrl: canvas.toDataURL("image/png"), width: outW, height: outH, mmPerPx };
}

export function loadPlanFile(file: File): Promise<LoadedPlan> {
  if (isDwg(file)) {
    return Promise.reject(
      new Error(
        "DWG is AutoCAD's proprietary format and can't be read directly in the browser. " +
        "In AutoCAD use Save As → DXF (or export a PDF) and upload that instead.",
      ),
    );
  }
  if (isDxf(file)) return renderDxf(file);
  if (isPdf(file)) return renderPdf(file);
  return renderImage(file);
}
