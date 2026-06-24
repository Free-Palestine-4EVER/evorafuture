// The `dxf` package ships no type declarations; we only use a small slice of it.
declare module "dxf" {
  export class Helper {
    constructor(contents: string);
    parsed?: { header?: Record<string, number | undefined> };
    toSVG(): string;
    toPolylines(): {
      bbox: { min: { x: number; y: number }; max: { x: number; y: number }; valid: boolean };
    };
  }
}
