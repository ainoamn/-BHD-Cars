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
  { id: "red", name: L("أحمر", "Red"), hex: "#b91c1c" },
  { id: "white", name: L("أبيض", "White"), hex: "#f5f5f5" },
  { id: "brown", name: L("بني", "Brown"), hex: "#7c4a2d" },
  { id: "purple", name: L("بنفسجي", "Purple"), hex: "#6d28d9" },
  { id: "gold", name: L("ذهبي", "Gold"), hex: "#b58d55" },
  { id: "sandy", name: L("رملي", "Sandy"), hex: "#c2a878" },
  { id: "blue", name: L("أزرق", "Blue"), hex: "#1d4ed8" },
  { id: "grey", name: L("رمادي", "Grey"), hex: "#7a7a7a" },
  { id: "silver", name: L("فضي", "Silver"), hex: "#c0c0c0" },
  { id: "orange", name: L("برتقالي", "Orange"), hex: "#ea580c" },
  { id: "yellow", name: L("أصفر", "Yellow"), hex: "#eab308" },
  { id: "beige", name: L("بيج", "Beige"), hex: "#d6c3a3" },
  { id: "green", name: L("أخضر", "Green"), hex: "#166534" },
  { id: "maroon", name: L("عنابي", "Maroon"), hex: "#7f1d1d" },
];

export const interiorColors = [
  { id: "silver", name: L("فضي", "Silver"), hex: "#c0c0c0" },
  { id: "black", name: L("أسود", "Black"), hex: "#1a1a1a" },
  { id: "red", name: L("أحمر", "Red"), hex: "#991b1b" },
  { id: "white", name: L("أبيض", "White"), hex: "#f5f5f5" },
  { id: "grey", name: L("رمادي", "Grey"), hex: "#9ca3af" },
  { id: "blue", name: L("أزرق", "Blue"), hex: "#1d4ed8" },
  { id: "beige", name: L("بيج", "Beige"), hex: "#d6c3a3" },
  { id: "yellow", name: L("أصفر", "Yellow"), hex: "#eab308" },
  { id: "orange", name: L("برتقالي", "Orange"), hex: "#ea580c" },
  { id: "brown", name: L("بني", "Brown"), hex: "#7c4a2d" },
  { id: "maroon", name: L("عنابي", "Maroon"), hex: "#7f1d1d" },
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

export const mileageBands = [
  { id: "0-20", label: L("أقل من 20 ألف", "Under 20k"), value: 15000 },
  { id: "20-40", label: L("20–40 ألف", "20–40k"), value: 30000 },
  { id: "40-60", label: L("40–60 ألف", "40–60k"), value: 50000 },
  { id: "60-80", label: L("60–80 ألف", "60–80k"), value: 70000 },
  { id: "80-100", label: L("80–100 ألف", "80–100k"), value: 90000 },
  { id: "100+", label: L("أكثر من 100 ألف", "Over 100k"), value: 120000 },
];

export const years = Array.from({ length: 20 }, (_, i) => 2026 - i);

export function estimateMarketOmr(input: {
  makeId: string;
  year: number;
  mileage: number;
  body: string;
  origin: "gcc" | "import";
}) {
  const baseByMake: Record<string, number> = {
    toyota: 9000,
    nissan: 8500,
    lexus: 14000,
    mercedes: 16000,
    bmw: 14500,
    ford: 7000,
    "land-rover": 15000,
    porsche: 28000,
    hyundai: 6500,
    honda: 7000,
    chevrolet: 7500,
    byd: 9000,
  };
  const bodyBoost: Record<string, number> = { sedan: 0, suv: 1800, coupe: 1200, pickup: 900, hatch: -400 };
  const age = Math.max(0, 2026 - input.year);
  const ageHit = age * 480;
  const mileHit = Math.floor(input.mileage / 10000) * 280;
  const originHit = input.origin === "import" ? -700 : 400;
  const raw = (baseByMake[input.makeId] ?? 8000) + (bodyBoost[input.body] ?? 0) - ageHit - mileHit + originHit;
  return Math.max(1200, Math.round(raw / 50) * 50);
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
  origin: "gcc" | "import";
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
