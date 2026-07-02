import { Product } from "./types";

// Starter furniture catalog backed by the Kenney "Furniture Kit" (CC0 — free,
// no attribution, ours to ship). GLBs live in /public/models/catalog/.
//
// Geometry is sacred: each row carries TRUE real-world dimensions in millimetres
// (authored from standard furniture sizing, not derived from the toy model). The
// 3D view auto-fits the GLB to these dims (Product.fitToDims), so what you see is
// the real size regardless of how the free model was exported. A furniture maker
// later swaps these stand-ins for their own products at their own true sizes.

// [ glbName, displayName, category, width_mm, depth_mm, height_mm ]
type Row = [string, string, string, number, number, number];

const CAT_COLOR: Record<string, string> = {
  Seating: "#b45309",
  Tables: "#92400e",
  Bedroom: "#475569",
  Storage: "#5b4636",
  Kitchen: "#0f766e",
  Bathroom: "#0369a1",
  Appliances: "#6b7280",
  Lighting: "#ca8a04",
  Electronics: "#3f3f46",
  Decor: "#15803d",
};

const ROWS: Row[] = [
  // ── Seating ──────────────────────────────────────────────────────────
  ["loungeSofa", "Sofa", "Seating", 1800, 850, 720],
  ["loungeSofaLong", "Long Sofa", "Seating", 2400, 900, 720],
  ["loungeSofaCorner", "Corner Sofa", "Seating", 2400, 1600, 720],
  ["loungeSofaOttoman", "Sofa with Ottoman", "Seating", 2000, 900, 720],
  ["loungeDesignSofa", "Design Sofa", "Seating", 2000, 850, 700],
  ["loungeDesignSofaCorner", "Design Corner Sofa", "Seating", 2400, 1600, 700],
  ["loungeChair", "Lounge Chair", "Seating", 800, 850, 750],
  ["loungeChairRelax", "Recliner", "Seating", 850, 900, 800],
  ["loungeDesignChair", "Design Chair", "Seating", 750, 750, 750],
  ["chair", "Chair", "Seating", 460, 500, 900],
  ["chairCushion", "Cushioned Chair", "Seating", 480, 520, 900],
  ["chairRounded", "Rounded Chair", "Seating", 500, 520, 800],
  ["chairModernCushion", "Modern Chair", "Seating", 500, 520, 800],
  ["chairModernFrameCushion", "Modern Frame Chair", "Seating", 520, 540, 800],
  ["chairDesk", "Office Chair", "Seating", 600, 600, 950],
  ["stoolBar", "Bar Stool", "Seating", 400, 400, 760],
  ["stoolBarSquare", "Square Bar Stool", "Seating", 400, 400, 760],
  ["bench", "Bench", "Seating", 1200, 400, 450],
  ["benchCushion", "Cushioned Bench", "Seating", 1200, 420, 450],
  ["benchCushionLow", "Low Bench", "Seating", 1200, 420, 400],

  // ── Tables ───────────────────────────────────────────────────────────
  ["table", "Dining Table", "Tables", 1600, 900, 750],
  ["tableRound", "Round Table", "Tables", 1100, 1100, 750],
  ["tableGlass", "Glass Table", "Tables", 1600, 900, 750],
  ["tableCloth", "Draped Table", "Tables", 1600, 900, 750],
  ["tableCross", "Cross-Leg Table", "Tables", 1500, 900, 750],
  ["tableCrossCloth", "Cross-Leg Draped Table", "Tables", 1500, 900, 750],
  ["tableCoffee", "Coffee Table", "Tables", 1100, 600, 420],
  ["tableCoffeeSquare", "Square Coffee Table", "Tables", 700, 700, 420],
  ["tableCoffeeGlass", "Glass Coffee Table", "Tables", 1100, 600, 400],
  ["tableCoffeeGlassSquare", "Square Glass Coffee Table", "Tables", 700, 700, 400],
  ["sideTable", "Side Table", "Tables", 450, 450, 550],
  ["sideTableDrawers", "Side Table w/ Drawers", "Tables", 450, 450, 550],
  ["desk", "Desk", "Tables", 1400, 700, 750],
  ["deskCorner", "Corner Desk", "Tables", 1600, 1400, 750],

  // ── Bedroom ──────────────────────────────────────────────────────────
  ["bedSingle", "Single Bed", "Bedroom", 1000, 2000, 600],
  ["bedDouble", "Double Bed", "Bedroom", 1600, 2100, 600],
  ["bedBunk", "Bunk Bed", "Bedroom", 1050, 2050, 1650],
  ["cabinetBed", "Bedside Cabinet", "Bedroom", 500, 400, 550],
  ["cabinetBedDrawer", "Bedside Drawer", "Bedroom", 500, 400, 550],
  ["cabinetBedDrawerTable", "Bedside Table", "Bedroom", 500, 400, 550],

  // ── Storage ──────────────────────────────────────────────────────────
  ["bookcaseClosed", "Closed Bookcase", "Storage", 800, 300, 1100],
  ["bookcaseClosedDoors", "Bookcase w/ Doors", "Storage", 800, 300, 1100],
  ["bookcaseClosedWide", "Wide Bookcase", "Storage", 1600, 300, 1100],
  ["bookcaseOpen", "Open Bookcase", "Storage", 800, 300, 1100],
  ["bookcaseOpenLow", "Low Bookcase", "Storage", 800, 300, 600],
  ["cabinetTelevision", "TV Cabinet", "Storage", 1600, 450, 500],
  ["cabinetTelevisionDoors", "TV Cabinet w/ Doors", "Storage", 1600, 450, 500],
  ["coatRack", "Wall Coat Rack", "Storage", 500, 120, 250],
  ["coatRackStanding", "Standing Coat Rack", "Storage", 500, 500, 1750],

  // ── Kitchen ──────────────────────────────────────────────────────────
  ["kitchenBar", "Kitchen Island", "Kitchen", 1600, 650, 900],
  ["kitchenBarEnd", "Island End", "Kitchen", 650, 650, 900],
  ["kitchenCabinet", "Base Cabinet", "Kitchen", 600, 600, 900],
  ["kitchenCabinetDrawer", "Base Drawer Cabinet", "Kitchen", 600, 600, 900],
  ["kitchenCabinetCornerInner", "Inner Corner Cabinet", "Kitchen", 900, 900, 900],
  ["kitchenCabinetCornerRound", "Round Corner Cabinet", "Kitchen", 900, 900, 900],
  ["kitchenCabinetUpper", "Wall Cabinet", "Kitchen", 600, 350, 700],
  ["kitchenCabinetUpperLow", "Low Wall Cabinet", "Kitchen", 600, 350, 400],
  ["kitchenCabinetUpperDouble", "Double Wall Cabinet", "Kitchen", 800, 350, 700],
  ["kitchenCabinetUpperCorner", "Corner Wall Cabinet", "Kitchen", 600, 600, 700],
  ["kitchenSink", "Kitchen Sink Unit", "Kitchen", 800, 600, 900],
  ["kitchenStove", "Stove", "Kitchen", 600, 600, 900],
  ["kitchenStoveElectric", "Electric Stove", "Kitchen", 600, 600, 900],
  ["hoodLarge", "Range Hood (Large)", "Kitchen", 900, 500, 600],
  ["hoodModern", "Modern Range Hood", "Kitchen", 900, 500, 600],
  ["kitchenMicrowave", "Microwave", "Kitchen", 500, 350, 300],
  ["kitchenCoffeeMachine", "Coffee Machine", "Kitchen", 300, 350, 400],
  ["kitchenBlender", "Blender", "Kitchen", 200, 200, 400],
  ["toaster", "Toaster", "Kitchen", 300, 170, 200],

  // ── Bathroom ─────────────────────────────────────────────────────────
  ["toilet", "Toilet", "Bathroom", 400, 650, 800],
  ["toiletSquare", "Square Toilet", "Bathroom", 400, 650, 800],
  ["bathroomSink", "Bathroom Sink", "Bathroom", 550, 450, 850],
  ["bathroomSinkSquare", "Square Bathroom Sink", "Bathroom", 550, 450, 850],
  ["bathroomCabinet", "Bathroom Cabinet", "Bathroom", 600, 350, 700],
  ["bathroomCabinetDrawer", "Bathroom Drawer Cabinet", "Bathroom", 600, 350, 700],
  ["bathroomMirror", "Bathroom Mirror", "Bathroom", 600, 50, 800],
  ["bathtub", "Bathtub", "Bathroom", 1700, 750, 600],
  ["shower", "Shower", "Bathroom", 900, 900, 2000],
  ["showerRound", "Round Shower", "Bathroom", 900, 900, 2000],

  // ── Appliances ───────────────────────────────────────────────────────
  ["kitchenFridge", "Fridge", "Appliances", 700, 700, 1800],
  ["kitchenFridgeLarge", "Large Fridge", "Appliances", 900, 750, 1800],
  ["kitchenFridgeSmall", "Small Fridge", "Appliances", 550, 600, 850],
  ["kitchenFridgeBuiltIn", "Built-in Fridge", "Appliances", 600, 600, 1800],
  ["washer", "Washing Machine", "Appliances", 600, 600, 850],
  ["dryer", "Dryer", "Appliances", 600, 600, 850],
  ["washerDryerStacked", "Stacked Washer/Dryer", "Appliances", 600, 600, 1700],

  // ── Lighting ─────────────────────────────────────────────────────────
  ["lampRoundFloor", "Round Floor Lamp", "Lighting", 400, 400, 1500],
  ["lampSquareFloor", "Square Floor Lamp", "Lighting", 400, 400, 1500],
  ["lampRoundTable", "Round Table Lamp", "Lighting", 300, 300, 500],
  ["lampSquareTable", "Square Table Lamp", "Lighting", 300, 300, 500],
  ["lampSquareCeiling", "Ceiling Lamp", "Lighting", 400, 400, 200],
  ["lampWall", "Wall Lamp", "Lighting", 200, 150, 300],
  ["ceilingFan", "Ceiling Fan", "Lighting", 1200, 1200, 400],

  // ── Electronics ──────────────────────────────────────────────────────
  ["televisionModern", "Modern TV", "Electronics", 1200, 100, 700],
  ["televisionVintage", "Vintage TV", "Electronics", 700, 500, 550],
  ["televisionAntenna", "Antenna TV", "Electronics", 700, 500, 550],
  ["computerScreen", "Monitor", "Electronics", 600, 200, 450],
  ["laptop", "Laptop", "Electronics", 350, 250, 250],
  ["speaker", "Floor Speaker", "Electronics", 300, 300, 900],
  ["speakerSmall", "Small Speaker", "Electronics", 200, 200, 300],
  ["radio", "Radio", "Electronics", 300, 150, 200],

  // ── Decor ────────────────────────────────────────────────────────────
  ["pottedPlant", "Potted Plant", "Decor", 400, 400, 900],
  ["plantSmall1", "Small Plant", "Decor", 250, 250, 400],
  ["plantSmall2", "Small Plant (2)", "Decor", 250, 250, 400],
  ["plantSmall3", "Small Plant (3)", "Decor", 250, 250, 400],
  ["rugRectangle", "Rectangular Rug", "Decor", 2000, 1400, 10],
  ["rugRound", "Round Rug", "Decor", 1600, 1600, 10],
  ["rugRounded", "Rounded Rug", "Decor", 2000, 1400, 10],
  ["rugSquare", "Square Rug", "Decor", 1600, 1600, 10],
  ["rugDoormat", "Doormat", "Decor", 700, 450, 10],
  ["books", "Books", "Decor", 300, 200, 250],
  ["bear", "Teddy Bear", "Decor", 400, 300, 500],
  ["trashcan", "Trash Can", "Decor", 300, 300, 500],
];

export const KENNEY_CATALOG: Product[] = ROWS.map(
  ([glb, name, category, w, d, h]) => ({
    id: `k-${glb}`,
    name,
    category,
    dimensions_mm: { w, d, h },
    color: CAT_COLOR[category] ?? "#6b7280",
    glbUrl: `/models/catalog/${glb}.glb`,
    thumbnailUrl: `/models/catalog/thumbs/${glb}.png`,
    fitToDims: true,
  }),
);

// Category display order for the browser (tabs / sections).
export const CATEGORY_ORDER = [
  "Seating",
  "Tables",
  "Bedroom",
  "Storage",
  "Kitchen",
  "Bathroom",
  "Appliances",
  "Lighting",
  "Electronics",
  "Decor",
] as const;
