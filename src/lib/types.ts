export type Locale = "ar" | "en";

export type Copy = { ar: string; en: string };

export type Currency = "OMR" | "AED" | "SAR" | "QAR" | "BHD" | "KWD" | "USD" | "EUR";

export type MarketId = "om" | "ae" | "sa" | "qa" | "bh" | "kw" | "world";

export type Condition = "ready" | "new" | "accident";

export type Seller = {
  slug: string;
  name: string;
  kind: "dealer" | "private";
  city: Copy;
  country: MarketId;
  since: string;
  verified: boolean;
  phone: string;
  about: Copy;
};

export type Car = {
  slug: string;
  title: Copy;
  make: string;
  model: string;
  year: number;
  priceOmr: number;
  marketOmr: number;
  mileage: number;
  fuel: Copy;
  gearbox: Copy;
  body: Copy;
  drive: Copy;
  color: Copy;
  city: Copy;
  country: MarketId;
  condition: Condition;
  seller: string;
  images: string[];
  highlights: Copy[];
  description: Copy;
  vin: string;
};

export type Auction = {
  slug: string;
  title: Copy;
  year: number;
  image: string;
  city: Copy;
  country: MarketId;
  openingOmr: number;
  incrementOmr: number;
  endsInHours: number;
  reserveMet: boolean;
  origin: Copy;
  note: Copy;
  specs: Copy;
  bids: { name: string; amountOmr: number; ago: Copy }[];
};

export type Rental = {
  slug: string;
  title: Copy;
  year: number;
  image: string;
  city: Copy;
  company: string;
  dayOmr: number;
  weekOmr: number;
  monthOmr: number;
  kmDay: number;
  depositOmr: number;
  includes: Copy[];
};

export type Part = {
  slug: string;
  title: Copy;
  priceOmr: number;
  condition: "new" | "used";
  fit: Copy;
  city: Copy;
  seller: string;
  image: string;
};

export type ScrapYard = {
  slug: string;
  name: Copy;
  city: Copy;
  pricePerTon: number;
  pickup: boolean;
  note: Copy;
};

export type Plate = {
  slug: string;
  number: string;
  code: string;
  priceOmr: number;
  city: Copy;
  country: MarketId;
};

export type Insurer = {
  id: string;
  name: Copy;
  focus: Copy;
  agencyRepair: boolean;
  roadside: boolean;
  excessOmr: number;
  factor: number;
};

export type Bank = {
  id: string;
  name: Copy;
  apr: number;
  maxYears: number;
  minDown: number;
  note: Copy;
};

export type Appraiser = {
  id: string;
  name: Copy;
  cities: Copy;
  feeOmr: number;
  hours: number;
  license: string;
};

export type Center = {
  id: string;
  name: Copy;
  city: Copy;
  tiers: { id: string; name: Copy; feeOmr: number; note: Copy }[];
};

export type Workshop = {
  id: string;
  name: Copy;
  city: Copy;
  services: Copy;
};

export type RequestKind =
  | "valuation"
  | "finance"
  | "insurance"
  | "inspection"
  | "import"
  | "rental"
  | "part"
  | "scrap"
  | "auction"
  | "sell"
  | "plate"
  | "report"
  | "service"
  | "inquiry";

export type ServiceRequest = {
  id: string;
  ref: string;
  kind: RequestKind;
  title: string;
  detail: string;
  status: "submitted" | "matching" | "quoted";
  createdAt: string;
};
