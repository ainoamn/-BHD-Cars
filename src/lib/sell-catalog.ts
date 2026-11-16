import type { Copy } from "./types";
import { allMakes, type SellMake, type SellModel } from "./makes-full";

export const L = (ar: string, en: string): Copy => ({ ar, en });
export type { SellMake, SellModel };
export const sellMakes: SellMake[] = allMakes;

export const bodyTypes = [
  { id: "sedan", name: L("سيدان", "Sedan"), image: "/stickers/sedan.jpg" },
  { id: "suv", name: L("دفع رباعي", "SUV"), image: "/stickers/suv.jpg" },
  { id: "coupe", name: L("كوبيه", "Coupe"), image: "/stickers/coupe.jpg" },
  { id: "pickup", name: L("بيك أب", "Pickup"), image: "/stickers/pickup.jpg" },
  { id: "hatch", name: L("هاتشباك", "Hatchback"), image: "/stickers/hatch.jpg" },
];

export const exteriorColors = [
  { id: "black", name: L("أسود", "Black"), hex: "#1a1a1a" },
  { id: "white", name: L("أبيض", "White"), hex: "#f5f5f5" },
  { id: "silver", name: L("فضي", "Silver"), hex: "#c0c0c0" },
  { id: "grey", name: L("رمادي", "Grey"), hex: "#7a7a7a" },
  { id: "graphite", name: L("رمادي غامق", "Graphite"), hex: "#4b5563" },
  { id: "red", name: L("أحمر", "Red"), hex: "#b91c1c" },
  { id: "burgundy", name: L("خمري", "Burgundy"), hex: "#7f1d1d" },
  { id: "maroon", name: L("عنابي", "Maroon"), hex: "#6b1e2a" },
  { id: "blue", name: L("أزرق", "Blue"), hex: "#1d4ed8" },
  { id: "navy", name: L("كحلي", "Navy"), hex: "#174b70" },
  { id: "sky", name: L("أزرق سماوي", "Sky blue"), hex: "#38bdf8" },
  { id: "teal", name: L("تركواز", "Teal"), hex: "#08a39f" },
  { id: "green", name: L("أخضر", "Green"), hex: "#166534" },
  { id: "night-green", name: L("أخضر ليلي", "Night green"), hex: "#092d24" },
  { id: "olive", name: L("زيتي", "Olive"), hex: "#556b2f" },
  { id: "brown", name: L("بني", "Brown"), hex: "#7c4a2d" },
  { id: "bronze", name: L("برونزي", "Bronze"), hex: "#8c6239" },
  { id: "gold", name: L("ذهبي", "Gold"), hex: "#b58d55" },
  { id: "beige", name: L("بيج", "Beige"), hex: "#d6c3a3" },
  { id: "sandy", name: L("رملي", "Sandy"), hex: "#c2a878" },
  { id: "pearl", name: L("لؤلؤي", "Pearl"), hex: "#f0ebe3" },
  { id: "orange", name: L("برتقالي", "Orange"), hex: "#ea580c" },
  { id: "yellow", name: L("أصفر", "Yellow"), hex: "#eab308" },
  { id: "purple", name: L("بنفسجي", "Purple"), hex: "#6d28d9" },
  { id: "pink", name: L("وردي", "Pink"), hex: "#db2777" },
];

export const interiorColors = [
  { id: "black", name: L("أسود", "Black"), hex: "#1a1a1a" },
  { id: "grey", name: L("رمادي", "Grey"), hex: "#9ca3af" },
  { id: "charcoal", name: L("فحمي", "Charcoal"), hex: "#374151" },
  { id: "silver", name: L("فضي", "Silver"), hex: "#c0c0c0" },
  { id: "beige", name: L("بيج", "Beige"), hex: "#d6c3a3" },
  { id: "cream", name: L("كريمي", "Cream"), hex: "#f5f0e6" },
  { id: "brown", name: L("بني", "Brown"), hex: "#7c4a2d" },
  { id: "tan", name: L("بني فاتح", "Tan"), hex: "#c4a484" },
  { id: "red", name: L("أحمر", "Red"), hex: "#991b1b" },
  { id: "maroon", name: L("عنابي", "Maroon"), hex: "#7f1d1d" },
  { id: "blue", name: L("أزرق", "Blue"), hex: "#1d4ed8" },
  { id: "navy", name: L("كحلي", "Navy"), hex: "#174b70" },
  { id: "white", name: L("أبيض", "White"), hex: "#f5f5f5" },
  { id: "orange", name: L("برتقالي", "Orange"), hex: "#ea580c" },
  { id: "yellow", name: L("أصفر", "Yellow"), hex: "#eab308" },
  { id: "green", name: L("أخضر", "Green"), hex: "#166534" },
];

export const citiesOm = [
  L("مسقط", "Muscat"),
  L("السيب", "Seeb"),
  L("المعبيلة", "Al Mawaleh"),
  L("الخوض", "Al Khoud"),
  L("بوشر", "Bausher"),
  L("صحار", "Sohar"),
  L("نزوى", "Nizwa"),
  L("صلالة", "Salalah"),
  L("صور", "Sur"),
  L("البريمي", "Al Buraimi"),
];

/** 20k steps up to 600k, then “over 600”. */
export const mileageBands = [
  { id: "0-20", label: L("أقل من 20 ألف", "Under 20k"), value: 15_000 },
  ...Array.from({ length: 29 }, (_, i) => {
    const start = (i + 1) * 20;
    const end = start + 20;
    return {
      id: `${start}-${end}`,
      label: L(`${start}–${end} ألف`, `${start}–${end}k`),
      value: start * 1000 + 10_000,
    };
  }),
  { id: "600+", label: L("أكبر من 600 ألف", "Over 600k"), value: 650_000 },
];

export const years = Array.from({ length: 20 }, (_, i) => 2026 - i);

export type MarketValuationInput = {
  makeId: string;
  modelId?: string;
  year: number;
  mileage: number;
  body: string;
  origin: string;
  condition?: string;
  fuel?: string;
  gearbox?: string;
  trim?: string;
  cylinders?: string;
  drive?: string;
  smartKeys?: number;
  regularKeys?: number;
  interiorFeatureCount?: number;
  exteriorFeatureCount?: number;
  techFeatureCount?: number;
};

export type MarketValuation = {
  mid: number;
  low: number;
  high: number;
  ageYears: number;
  spreadPct: number;
};

function roundOmr(n: number) {
  return Math.max(400, Math.round(n / 50) * 50);
}

/** Smart mid-market estimate from age, model family, and listed specs. */
export function valuateReadyListing(input: MarketValuationInput): MarketValuation {
  const baseByMake: Record<string, number> = {
    toyota: 9200,
    nissan: 8600,
    lexus: 14500,
    mercedes: 16500,
    bmw: 14800,
    ford: 7200,
    "land-rover": 15500,
    porsche: 28500,
    hyundai: 6600,
    honda: 7200,
    chevrolet: 7600,
    byd: 9200,
    kia: 6400,
    mazda: 7000,
    mitsubishi: 6800,
    jeep: 12000,
    audi: 14000,
    volkswagen: 7500,
    geely: 6200,
    chery: 5800,
  };
  const bodyBoost: Record<string, number> = {
    sedan: 0,
    suv: 1900,
    coupe: 1300,
    pickup: 1000,
    hatch: -350,
  };
  const conditionHit: Record<string, number> = {
    new: 2200,
    excellent: 900,
    good: 200,
    fair: -700,
    poor: -1600,
  };
  const fuelBoost: Record<string, number> = {
    petrol: 0,
    hybrid: 900,
    diesel: 350,
    ev: 1400,
    plug: 1100,
  };
  const ageYears = Math.max(0, 2026 - input.year);
  const ageHit = ageYears * 460 + Math.max(0, ageYears - 8) * 120;
  const mileHit = Math.floor(input.mileage / 10000) * 260 + Math.floor(input.mileage / 100000) * 400;
  const gccLike = input.origin === "gcc" || input.origin === "agency";
  const originHit = gccLike ? 450 : input.origin === "import" ? -500 : -750;

  const modelBoost = (() => {
    const id = (input.modelId || "").toLowerCase();
    if (!id) return 0;
    if (/(land|cruiser|patrol|lx|gx|range|cayenne|x5|x7|g-class|prado)/.test(id)) return 2800;
    if (/(camry|accord|altima|sonata|k5|civic)/.test(id)) return 400;
    if (/(yaris|sunny|accent|rio|spark)/.test(id)) return -500;
    return 0;
  })();

  const trimBoost = (() => {
    const t = (input.trim || "").toLowerCase();
    if (!t) return 0;
    if (/(limited|platinum|prestige|luxury|signature|s-line|amg|m sport)/.test(t)) return 900;
    if (/(se|le|ex|glx|comfort)/.test(t)) return 150;
    return 0;
  })();

  const gearboxBoost = input.gearbox === "auto" ? 250 : input.gearbox === "manual" ? -200 : 0;
  const driveBoost = input.drive === "awd" || input.drive === "4wd" ? 550 : 0;
  const cyl = Number(input.cylinders) || 0;
  const cylBoost = cyl >= 8 ? 900 : cyl >= 6 ? 450 : 0;
  const keysBoost = Math.min(400, (input.smartKeys ?? 0) * 120 + Math.max(0, (input.regularKeys ?? 0) - 1) * 40);
  const featureBoost = Math.min(
    1600,
    (input.interiorFeatureCount ?? 0) * 35 +
      (input.exteriorFeatureCount ?? 0) * 40 +
      (input.techFeatureCount ?? 0) * 55,
  );

  const raw =
    (baseByMake[input.makeId] ?? 7800) +
    (bodyBoost[input.body] ?? 0) +
    (conditionHit[input.condition || ""] ?? 0) +
    (fuelBoost[input.fuel || ""] ?? 0) +
    modelBoost +
    trimBoost +
    gearboxBoost +
    driveBoost +
    cylBoost +
    keysBoost +
    featureBoost +
    originHit -
    ageHit -
    mileHit;

  const mid = roundOmr(raw);
  // Older / higher-mileage cars show a wider market band.
  const spreadPct = Math.min(0.18, 0.08 + ageYears * 0.004 + Math.floor(input.mileage / 80000) * 0.015);
  const low = roundOmr(mid * (1 - spreadPct));
  const high = roundOmr(mid * (1 + spreadPct));
  return { mid, low, high, ageYears, spreadPct };
}

export function estimateMarketOmr(input: {
  makeId: string;
  year: number;
  mileage: number;
  body: string;
  origin: string;
}) {
  return valuateReadyListing(input).mid;
}

export const damageZones = [
  { id: "front", name: L("مقدمة", "Front") },
  { id: "rear", name: L("خلفية", "Rear") },
  { id: "left", name: L("جانب أيسر", "Left side") },
  { id: "right", name: L("جانب أيمن", "Right side") },
  { id: "roof", name: L("سقف", "Roof") },
  { id: "undercarriage", name: L("أسفل الهيكل", "Undercarriage") },
  { id: "airbags", name: L("وسائد هوائية", "Airbags") },
  { id: "engine", name: L("محرك / علبة", "Engine / gearbox") },
  { id: "interior", name: L("مقصورة", "Cabin") },
  { id: "flood", name: L("غرق / ماء", "Flood / water") },
  { id: "fire", name: L("حريق", "Fire") },
  { id: "electrical", name: L("كهرباء", "Electrical") },
] as const;

export const damageSeverities = [
  { id: "cosmetic", name: L("تجميلي", "Cosmetic"), hit: 0.12 },
  { id: "light", name: L("خفيف", "Light"), hit: 0.22 },
  { id: "medium", name: L("متوسط", "Medium"), hit: 0.38 },
  { id: "heavy", name: L("ثقيل", "Heavy"), hit: 0.55 },
  { id: "total", name: L("خسارة كلية معلنة", "Declared total loss"), hit: 0.7 },
] as const;

export const repairStates = [
  { id: "as-is", name: L("كما هي — بدون إصلاح", "As-is — unrepaired"), note: L("أفضل للمشتري الذي يصلح بنفسه", "Best for a buyer who will repair") },
  { id: "partial", name: L("إصلاح جزئي", "Partially repaired"), note: L("اذكر ما أُصلح وما بقي", "Say what was fixed and what remains") },
  { id: "full", name: L("إصلاح كامل معلن", "Fully repaired, declared"), note: L("يحتاج صوراً قبل وبعد إن وُجدت", "Needs before/after photos if you have them") },
] as const;

export const titleStatuses = [
  { id: "clean", name: L("ملكية نظيفة", "Clean title") },
  { id: "salvage", name: L("ملكية حادث / سكراب", "Salvage title") },
  { id: "insurance", name: L("شطب تأمين", "Insurance write-off") },
  { id: "unknown", name: L("غير مؤكد بعد", "Not confirmed yet") },
] as const;

export function estimateAccidentOmr(input: {
  makeId: string;
  year: number;
  mileage: number;
  body: string;
  origin: string;
  severity: string;
  zones: string[];
  repair: string;
  runs: boolean;
}) {
  const clean = estimateMarketOmr(input);
  const severity = damageSeverities.find((item) => item.id === input.severity)?.hit ?? 0.35;
  const zoneExtra = Math.min(0.25, input.zones.length * 0.03);
  const floodFire = input.zones.includes("flood") || input.zones.includes("fire") ? 0.12 : 0;
  const repairBoost = input.repair === "full" ? 0.08 : input.repair === "partial" ? 0.03 : 0;
  const runHit = input.runs ? 0 : 0.1;
  const factor = Math.min(0.85, severity + zoneExtra + floodFire + runHit - repairBoost);
  return Math.max(400, Math.round((clean * (1 - factor)) / 50) * 50);
}

export function transparencyScore(input: {
  zones: string[];
  severity: string;
  repair: string;
  title: string;
  damagePhotos: number;
  beforePhotos: number;
  vin: boolean;
  note: boolean;
}) {
  let score = 20;
  if (input.zones.length) score += 15;
  if (input.severity) score += 10;
  if (input.repair) score += 10;
  if (input.title && input.title !== "unknown") score += 10;
  if (input.damagePhotos >= 3) score += 15;
  else if (input.damagePhotos >= 1) score += 8;
  if (input.beforePhotos >= 1) score += 10;
  if (input.vin) score += 5;
  if (input.note) score += 5;
  return Math.min(100, score);
}
