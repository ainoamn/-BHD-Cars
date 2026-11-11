import type { Copy } from "./types";

export const L = (ar: string, en: string): Copy => ({ ar, en });

export type SellModel = {
  id: string;
  name: Copy;
  body: string;
  image: string;
  trims: string[];
};

export type SellMake = {
  id: string;
  name: Copy;
  mark: string;
  logo: string;
  models: SellModel[];
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const sellMakes: SellMake[] = [
  {
    id: "toyota",
    name: L("تويوتا", "Toyota"),
    mark: "T",
    logo: "/makes/toyota.svg",
    models: [
      { id: "camry", name: L("كامري", "Camry"), body: "sedan", image: u("photo-1621007947382-bb3c3994e3fb"), trims: ["LE", "SE", "XLE", "Grande"] },
      { id: "land-cruiser", name: L("لاند كروزر", "Land Cruiser"), body: "suv", image: u("photo-1609521263047-f8f205293f24"), trims: ["GXR", "VX", "VXR"] },
      { id: "hilux", name: L("هايلكس", "Hilux"), body: "pickup", image: u("photo-1559416523-140ddc3d238c"), trims: ["GL", "GLX", "Adventure"] },
      { id: "rav4", name: L("راف فور", "RAV4"), body: "suv", image: u("photo-1606664515524-ed2f786a0bd6"), trims: ["LE", "XLE", "Limited"] },
    ],
  },
  {
    id: "nissan",
    name: L("نيسان", "Nissan"),
    mark: "N",
    logo: "/makes/nissan.svg",
    models: [
      { id: "patrol", name: L("باترول", "Patrol"), body: "suv", image: u("photo-1533473359331-0135ef1b58bf"), trims: ["SE", "LE", "Platinum", "NISMO"] },
      { id: "altima", name: L("التيما", "Altima"), body: "sedan", image: u("photo-1619767886558-efdc259cde1a"), trims: ["S", "SV", "SL"] },
      { id: "xterra", name: L("إكستيرا", "X-Terra"), body: "suv", image: u("photo-1511919884226-fd3cad34687c"), trims: ["S", "SE", "Titanium"] },
    ],
  },
  {
    id: "lexus",
    name: L("لكزس", "Lexus"),
    mark: "L",
    logo: "/makes/lexus.svg",
    models: [
      { id: "es", name: L("إي إس", "ES"), body: "sedan", image: u("photo-1549317661-bd32c8ce0db2"), trims: ["250", "300h", "350"] },
      { id: "lx", name: L("إل إكس", "LX"), body: "suv", image: u("photo-1606664515524-ed2f786a0bd6"), trims: ["570", "600"] },
      { id: "rx", name: L("آر إكس", "RX"), body: "suv", image: u("photo-1617814076367-b759c7d7e738"), trims: ["350", "450h"] },
    ],
  },
  {
    id: "mercedes",
    name: L("مرسيدس-بنز", "Mercedes-Benz"),
    mark: "★",
    logo: "/makes/mercedes-star.svg",
    models: [
      { id: "c-class", name: L("الفئة C", "C-Class"), body: "sedan", image: u("photo-1618843479313-40f8afb4b4d8"), trims: ["C200", "C300", "AMG"] },
      { id: "e-class", name: L("الفئة E", "E-Class"), body: "sedan", image: u("photo-1617531653332-bd46c24f2068"), trims: ["E200", "E300", "AMG"] },
      { id: "g-class", name: L("الفئة G", "G-Class"), body: "suv", image: u("photo-1525609004556-c46c7d6cf023"), trims: ["G500", "G63"] },
    ],
  },
  {
    id: "bmw",
    name: L("بي إم دبليو", "BMW"),
    mark: "B",
    logo: "/makes/bmw.svg",
    models: [
      { id: "3-series", name: L("الفئة الثالثة", "3 Series"), body: "sedan", image: u("photo-1555215695-3004980ad54e"), trims: ["320i", "330i", "M340i"] },
      { id: "5-series", name: L("الفئة الخامسة", "5 Series"), body: "sedan", image: u("photo-1550355291-bbee04a92027"), trims: ["520i", "530i", "M5"] },
      { id: "x5", name: L("إكس 5", "X5"), body: "suv", image: u("photo-1556189250-72ba954cfc2b"), trims: ["xDrive40i", "M50i"] },
    ],
  },
  {
    id: "ford",
    name: L("فورد", "Ford"),
    mark: "F",
    logo: "/makes/ford.svg",
    models: [
      { id: "mustang", name: L("موستانج", "Mustang"), body: "coupe", image: u("photo-1584345604476-8ec5e12e42db"), trims: ["EcoBoost", "GT", "GT Premium", "V6"] },
      { id: "explorer", name: L("إكسبلورر", "Explorer"), body: "suv", image: u("photo-1606016159991-dfe4f2746ad5"), trims: ["XLT", "Limited", "ST"] },
      { id: "f150", name: L("إف-150", "F-150"), body: "pickup", image: u("photo-1559416523-140ddc3d238c"), trims: ["XLT", "Lariat", "Raptor"] },
      { id: "taurus", name: L("تورس", "Taurus"), body: "sedan", image: u("photo-1494976388531-d1058494cdd8"), trims: ["SE", "SEL", "Limited"] },
    ],
  },
  {
    id: "land-rover",
    name: L("لاند روفر", "Land Rover"),
    mark: "LR",
    logo: "/makes/land-rover.svg",
    models: [
      { id: "defender", name: L("ديفندر", "Defender"), body: "suv", image: u("photo-1606664515524-ed2f786a0bd6"), trims: ["90", "110", "X"] },
      { id: "range-rover", name: L("رينج روفر", "Range Rover"), body: "suv", image: u("photo-1606220945770-b5b6c2c55bf1"), trims: ["HSE", "Autobiography", "SV"] },
    ],
  },
  {
    id: "porsche",
    name: L("بورشه", "Porsche"),
    mark: "P",
    logo: "/makes/porsche.svg",
    models: [
      { id: "911", name: L("911", "911"), body: "coupe", image: u("photo-1503376780353-7e6692767b70"), trims: ["Carrera", "Carrera S", "Turbo"] },
      { id: "cayenne", name: L("كايين", "Cayenne"), body: "suv", image: u("photo-1614200179396-2bdb77ebf81b"), trims: ["Base", "S", "Turbo"] },
    ],
  },
  {
    id: "hyundai",
    name: L("هيونداي", "Hyundai"),
    mark: "H",
    logo: "/makes/hyundai.svg",
    models: [
      { id: "tucson", name: L("توسان", "Tucson"), body: "suv", image: u("photo-1617814076367-b759c7d7e738"), trims: ["Smart", "Comfort", "Premium"] },
      { id: "sonata", name: L("سوناتا", "Sonata"), body: "sedan", image: u("photo-1619767886558-efdc259cde1a"), trims: ["GL", "GLS", "N Line"] },
    ],
  },
  {
    id: "honda",
    name: L("هوندا", "Honda"),
    mark: "Ho",
    logo: "/makes/honda.svg",
    models: [
      { id: "accord", name: L("أكورد", "Accord"), body: "sedan", image: u("photo-1606611013016-969c19ba27d1"), trims: ["EX", "EX-L", "Touring"] },
      { id: "crv", name: L("سي آر في", "CR-V"), body: "suv", image: u("photo-1609521263047-f8f205293f24"), trims: ["EX", "EX-L", "Touring"] },
    ],
  },
  {
    id: "chevrolet",
    name: L("شيفروليه", "Chevrolet"),
    mark: "C",
    logo: "/makes/chevrolet.svg",
    models: [
      { id: "tahoe", name: L("تاهو", "Tahoe"), body: "suv", image: u("photo-1519641471654-76ce0107ad1b"), trims: ["LS", "LT", "Premier"] },
      { id: "malibu", name: L("ماليبو", "Malibu"), body: "sedan", image: u("photo-1494976388531-d1058494cdd8"), trims: ["LS", "LT", "Premier"] },
    ],
  },
  {
    id: "byd",
    name: L("بي واي دي", "BYD"),
    mark: "BYD",
    logo: "/makes/byd.svg",
    models: [
      { id: "seal", name: L("سيل", "Seal"), body: "sedan", image: u("photo-1593941707882-a5bba14938c7"), trims: ["Dynamic", "Premium", "Performance"] },
      { id: "song-plus", name: L("سونج بلس", "Song Plus"), body: "suv", image: u("photo-1614200179396-2bdb77ebf81b"), trims: ["Champion", "Flagship"] },
    ],
  },
];

export const bodyTypes = [
  { id: "sedan", name: L("سيدان", "Sedan"), image: u("photo-1549317661-bd32c8ce0db2") },
  { id: "suv", name: L("دفع رباعي", "SUV"), image: u("photo-1519641471654-76ce0107ad1b") },
  { id: "coupe", name: L("كوبيه", "Coupe"), image: u("photo-1584345604476-8ec5e12e42db") },
  { id: "pickup", name: L("بيك أب", "Pickup"), image: u("photo-1559416523-140ddc3d238c") },
  { id: "hatch", name: L("هاتشباك", "Hatchback"), image: u("photo-1552519507-da3b142c6e3d") },
];

export const exteriorColors = [
  { id: "white", name: L("أبيض", "White"), hex: "#f5f5f5" },
  { id: "silver", name: L("فضي", "Silver"), hex: "#c0c0c0" },
  { id: "grey", name: L("رمادي", "Grey"), hex: "#7a7a7a" },
  { id: "black", name: L("أسود", "Black"), hex: "#1a1a1a" },
  { id: "red", name: L("أحمر", "Red"), hex: "#b91c1c" },
  { id: "blue", name: L("أزرق", "Blue"), hex: "#1d4ed8" },
  { id: "green", name: L("أخضر", "Green"), hex: "#166534" },
  { id: "gold", name: L("ذهبي", "Gold"), hex: "#b58d55" },
  { id: "beige", name: L("بيج", "Beige"), hex: "#d6c3a3" },
];

export const interiorColors = [
  { id: "beige", name: L("بيج", "Beige"), hex: "#d6c3a3" },
  { id: "black", name: L("أسود", "Black"), hex: "#1a1a1a" },
  { id: "red", name: L("أحمر", "Red"), hex: "#991b1b" },
  { id: "grey", name: L("رمادي", "Grey"), hex: "#9ca3af" },
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
