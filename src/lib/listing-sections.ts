import type { Copy, RequestKind } from "@/lib/types";
import { conditions, licenseStatuses, paymentMethods, seatCounts } from "@/lib/sell-options";

const L = (ar: string, en: string): Copy => ({ ar, en });

export type FieldKind =
  | "choice"
  | "text"
  | "number"
  | "textarea"
  | "photos"
  | "phone"
  | "price"
  | "title"
  | "multi";

export type FieldOption = { id: string; name: Copy };
export type OptionsSource = "governorates" | "wilayats" | "villages";
export type SectionGroup = "vehicles" | "parts" | "plates";

export type FieldDef = {
  id: string;
  label: Copy;
  lead?: Copy;
  kind: FieldKind;
  required?: boolean;
  options?: FieldOption[];
  optionsSource?: OptionsSource;
  placeholder?: Copy;
  minPhotos?: number;
  maxLength?: number;
  suffix?: Copy;
  hold?: boolean;
  /** Show AI helper on this step */
  ai?: "title" | "description";
};

export type ListingSection = {
  id: string;
  group: SectionGroup;
  name: Copy;
  blurb: Copy;
  icon: string;
  requestKind: RequestKind;
  mode: "cars-sale" | "wizard";
  fields: FieldDef[];
};

export const sectionGroups: { id: SectionGroup; name: Copy; lead: Copy }[] = [
  {
    id: "vehicles",
    name: L("مركبات ومعدات", "Vehicles & equipment"),
    lead: L("بيع، تأجير، تفكيك، أو معدات عمل.", "Sell, rent, dismantle, or work equipment."),
  },
  {
    id: "parts",
    name: L("قطع وتجهيزات", "Parts & fitments"),
    lead: L("قطع أصلية/بديلة، عجلات، زيوت، وإضافات.", "OEM/aftermarket parts, wheels, fluids, add-ons."),
  },
  {
    id: "plates",
    name: L("أرقام مميزة", "Distinctive plates"),
    lead: L("نقل رقم لوحة بشروط واضحة.", "Plate transfer with clear terms."),
  },
];

const years = Array.from({ length: 30 }, (_, i) => {
  const y = String(2026 - i);
  return { id: y, name: L(y, y) };
});

const mileageBands: FieldOption[] = [
  { id: "0-20", name: L("أقل من 20 ألف كم", "Under 20k km") },
  ...Array.from({ length: 29 }, (_, i) => {
    const start = (i + 1) * 20;
    const end = start + 20;
    return { id: `${start}-${end}`, name: L(`${start}–${end} ألف كم`, `${start}–${end}k km`) };
  }),
  { id: "600+", name: L("أكبر من 600 ألف كم", "Over 600k km") },
];

const colors: FieldOption[] = [
  { id: "white", name: L("أبيض", "White") },
  { id: "black", name: L("أسود", "Black") },
  { id: "silver", name: L("فضي", "Silver") },
  { id: "grey", name: L("رمادي", "Grey") },
  { id: "graphite", name: L("رمادي غامق", "Graphite") },
  { id: "red", name: L("أحمر", "Red") },
  { id: "burgundy", name: L("خمري", "Burgundy") },
  { id: "maroon", name: L("عنابي", "Maroon") },
  { id: "blue", name: L("أزرق", "Blue") },
  { id: "navy", name: L("كحلي", "Navy") },
  { id: "sky", name: L("أزرق سماوي", "Sky blue") },
  { id: "teal", name: L("تركواز", "Teal") },
  { id: "green", name: L("أخضر", "Green") },
  { id: "night-green", name: L("أخضر ليلي", "Night green") },
  { id: "olive", name: L("زيتي", "Olive") },
  { id: "brown", name: L("بني", "Brown") },
  { id: "bronze", name: L("برونزي", "Bronze") },
  { id: "gold", name: L("ذهبي", "Gold") },
  { id: "beige", name: L("بيج", "Beige") },
  { id: "sandy", name: L("رملي", "Sandy") },
  { id: "pearl", name: L("لؤلؤي", "Pearl") },
  { id: "orange", name: L("برتقالي", "Orange") },
  { id: "yellow", name: L("أصفر", "Yellow") },
  { id: "purple", name: L("بنفسجي", "Purple") },
  { id: "pink", name: L("وردي", "Pink") },
  { id: "other", name: L("لون مخصص / كود", "Custom / hex code") },
];

/** Accurate Gulf terms — not marketplace slang copy. */
const partSystems: FieldOption[] = [
  { id: "powertrain", name: L("المحرك وناقل الحركة", "Engine & transmission") },
  { id: "brakes", name: L("نظام التوقف والفرامل", "Braking system") },
  { id: "body", name: L("الهيكل والواجهات", "Body & panels") },
  { id: "electrical", name: L("الكهرباء والإشعال", "Electrical & ignition") },
  { id: "suspension", name: L("التعليق والتوجيه", "Suspension & steering") },
  { id: "cooling", name: L("التبريد والتكييف", "Cooling & A/C") },
  { id: "fuel", name: L("الوقود والحقن", "Fuel & injection") },
  { id: "lighting", name: L("الإضاءة والإشارات", "Lighting & signals") },
  { id: "safety", name: L("السلامة والوسائد", "Safety & airbags") },
  { id: "interior", name: L("التجهيز الداخلي", "Interior trim") },
  { id: "other", name: L("أخرى", "Other") },
];

function makeModelFields(makePlaceholder: Copy, modelPlaceholder: Copy, labels?: { make?: Copy; model?: Copy }): FieldDef[] {
  return [
    {
      id: "make",
      label: labels?.make ?? L("الشركة المصنّعة", "Make"),
      lead: L("اختر شعار الشركة — ثم تظهر الطرازات كأيقونات.", "Pick the brand logo — models then appear as icons."),
      kind: "text",
      required: true,
      placeholder: makePlaceholder,
    },
    {
      id: "model",
      label: labels?.model ?? L("الطراز", "Model"),
      lead: L("أيقونات الطراز حسب الشركة المختارة — لغة الواجهة فقط.", "Model icons for the selected make — UI language only."),
      kind: "text",
      required: true,
      placeholder: modelPlaceholder,
    },
  ];
}

function locationFields(): FieldDef[] {
  return [
    {
      id: "governorate",
      label: L("المحافظة", "Governorate"),
      lead: L("الموقع الحقيقي للمعاينة: محافظة → ولاية → منطقة.", "Actual viewing location: governorate → wilayat → area."),
      kind: "choice",
      required: true,
      optionsSource: "governorates",
    },
    {
      id: "wilayat",
      label: L("الولاية", "Wilayat"),
      kind: "choice",
      required: true,
      optionsSource: "wilayats",
    },
    {
      id: "village",
      label: L("المنطقة / الحي", "Area / neighbourhood"),
      kind: "choice",
      required: true,
      optionsSource: "villages",
    },
  ];
}

function listingTail(opts?: {
  priceLabel?: Copy;
  priceLead?: Copy;
  minPhotos?: number;
  photosLead?: Copy;
}): FieldDef[] {
  return [
    {
      id: "photos",
      label: L("صور العرض", "Listing photos"),
      lead:
        opts?.photosLead ??
        L("صورتان واضحتان على الأقل — الغلاف أول صورة.", "At least two clear photos — first image is the cover."),
      kind: "photos",
      required: true,
      minPhotos: opts?.minPhotos ?? 2,
    },
    ...locationFields(),
    {
      id: "price",
      label: opts?.priceLabel ?? L("السعر المطلوب", "Asking price"),
      lead: opts?.priceLead ?? L("السعر الكامل بالريال العماني — لا تضع عربونًا مكان السعر.", "Full price in OMR — do not enter a deposit as the price."),
      kind: "price",
      required: true,
      suffix: L("ر.ع", "OMR"),
    },
    {
      id: "payment",
      label: L("أسلوب السداد", "Payment style"),
      kind: "choice",
      required: true,
      options: paymentMethods,
    },
    {
      id: "phone",
      label: L("رقم التواصل", "Contact number"),
      lead: L("رقم عُماني يصل للمشتري لهذا العرض فقط.", "An Omani number for this listing."),
      kind: "phone",
      required: true,
    },
    {
      id: "title",
      label: L("عنوان العرض", "Listing headline"),
      lead: L(
        "آخر الخطوات: ولّد العنوان من بياناتك بلغة الواجهة فقط، ثم عدّله إن شئت.",
        "Final steps: generate the headline from your facts in the UI language only, then edit if you like.",
      ),
      kind: "title",
      required: true,
      maxLength: 100,
      placeholder: L("مثال: تويوتا لاندكروزر 2021 — فل كامل", "e.g. Toyota Land Cruiser 2021 — full option"),
      ai: "title",
    },
    {
      id: "note",
      label: L("تفاصيل العرض", "Listing details"),
      lead: L(
        "الخطوة الأخيرة: توليد نص حقيقي من المعلومات المدخلة — بلغة الواجهة الحالية فقط.",
        "Last step: real text from the facts you entered — in the current UI language only.",
      ),
      kind: "textarea",
      maxLength: 4000,
      placeholder: L("الحالة، الصيانة، سبب البيع، وما يُسلَّم مع العرض…", "Condition, service history, reason for sale, what is included…"),
      ai: "description",
    },
  ];
}

export const listingSections: ListingSection[] = [
  {
    id: "cars-sale",
    group: "vehicles",
    name: L("سيارات للبيع", "Cars for sale"),
    blurb: L("سيارة جاهزة أو بحادث معلن — مساران منفصلان للثقة.", "Ready car or declared accident — separate paths for trust."),
    icon: "🚗",
    requestKind: "sell",
    mode: "cars-sale",
    fields: [],
  },
  {
    id: "cars-rent",
    group: "vehicles",
    name: L("تأجير مركبات", "Vehicle hire"),
    blurb: L("تأجير يومي/شهري بسياسة مسافة وعربون واضحين.", "Daily/monthly hire with clear mileage policy and deposit."),
    icon: "🔑",
    requestKind: "rental",
    mode: "wizard",
    fields: [
      {
        id: "vehicleKind",
        label: L("فئة المركبة", "Vehicle class"),
        kind: "choice",
        required: true,
        options: [
          { id: "sedan", name: L("سيدان", "Sedan") },
          { id: "suv", name: L("دفع رباعي / كروس", "SUV / crossover") },
          { id: "van", name: L("فان عائلي", "Family van") },
          { id: "pickup", name: L("بيك أب", "Pickup") },
          { id: "luxury", name: L("فاخرة", "Luxury") },
          { id: "bus", name: L("حافلة صغيرة", "Mini bus") },
        ],
      },
      ...makeModelFields(L("مثال: تويوتا", "e.g. Toyota"), L("مثال: كامري", "e.g. Camry")),
      { id: "year", label: L("سنة الصنع", "Model year"), kind: "choice", required: true, options: years },
      {
        id: "gearbox",
        label: L("علبة السرعات", "Gearbox"),
        kind: "choice",
        required: true,
        options: [
          { id: "auto", name: L("أوتوماتيك", "Automatic") },
          { id: "manual", name: L("يدوي", "Manual") },
        ],
      },
      { id: "seats", label: L("عدد المقاعد", "Seats"), kind: "choice", required: true, options: seatCounts },
      {
        id: "period",
        label: L("وحدة التأجير", "Hire unit"),
        kind: "choice",
        required: true,
        options: [
          { id: "daily", name: L("باليوم", "Per day") },
          { id: "weekly", name: L("بالأسبوع", "Per week") },
          { id: "monthly", name: L("بالشهر", "Per month") },
          { id: "flexible", name: L("حسب الاتفاق", "By agreement") },
        ],
      },
      {
        id: "mileagePolicy",
        label: L("حد المسافة", "Distance limit"),
        kind: "choice",
        required: true,
        options: [
          { id: "limited", name: L("مسافة محدودة", "Limited km") },
          { id: "unlimited", name: L("مسافة مفتوحة", "Unlimited km") },
        ],
      },
      {
        id: "deposit",
        label: L("مبلغ التأمين المسترد", "Refundable deposit"),
        kind: "number",
        required: true,
        placeholder: L("مثال: 100", "e.g. 100"),
        suffix: L("ر.ع", "OMR"),
      },
      {
        id: "delivery",
        label: L("التسليم عند العميل", "Doorstep delivery"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("متاح", "Available") },
          { id: "no", name: L("من الموقع فقط", "Pickup only") },
        ],
      },
      ...listingTail({
        priceLabel: L("أجرة الفترة", "Hire rate"),
        priceLead: L("أدخل أجرة وحدة التأجير التي اخترتها.", "Enter the rate for the hire unit you chose."),
      }),
    ],
  },
  {
    id: "scrap",
    group: "vehicles",
    name: L("مركبات للتفكيك", "Vehicles for dismantling"),
    blurb: L("هيكل أو أجزاء غير صالحة للسير بملكية موثّقة.", "Shell or parts not roadworthy — with documented ownership."),
    icon: "🛠️",
    requestKind: "scrap",
    mode: "wizard",
    fields: [
      {
        id: "scrapType",
        label: L("شكل العرض", "Offer form"),
        kind: "choice",
        required: true,
        options: [
          { id: "whole", name: L("مركبة كاملة", "Complete vehicle") },
          { id: "shell", name: L("هيكل فقط", "Shell only") },
          { id: "parts", name: L("أجزاء مفصولة", "Separated parts") },
          { id: "engine", name: L("محرك أو ناقل", "Engine or gearbox") },
        ],
      },
      ...makeModelFields(L("مثال: نيسان", "e.g. Nissan"), L("مثال: باترول", "e.g. Patrol")),
      { id: "year", label: L("سنة الصنع", "Model year"), kind: "choice", required: true, options: years },
      {
        id: "damageLevel",
        label: L("شدة الضرر", "Damage severity"),
        kind: "choice",
        required: true,
        options: [
          { id: "light", name: L("خفيف", "Light") },
          { id: "medium", name: L("متوسط", "Medium") },
          { id: "heavy", name: L("ثقيل", "Heavy") },
          { id: "burnt", name: L("حريق", "Fire") },
          { id: "flood", name: L("غرق / مياه", "Flood") },
        ],
      },
      {
        id: "titleStatus",
        label: L("وثائق الملكية", "Ownership papers"),
        kind: "choice",
        required: true,
        options: [
          { id: "clear", name: L("مستندات مكتملة", "Complete papers") },
          { id: "papers", name: L("نواقص بسيطة", "Minor gaps") },
          { id: "none", name: L("بدون مستندات", "No papers") },
        ],
      },
      {
        id: "exportable",
        label: L("إمكانية الشحن خارج السلطنة", "Export readiness"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("ممكن", "Possible") },
          { id: "no", name: L("غير ممكن", "Not possible") },
          { id: "unknown", name: L("يحتاج مراجعة", "Needs check") },
        ],
      },
      ...listingTail({
        photosLead: L("صوّر نقاط الضرر والهيكل من زوايا متعددة.", "Photograph damage points and the shell from several angles."),
      }),
    ],
  },
  {
    id: "motorcycle",
    group: "vehicles",
    name: L("دراجات نارية وملحقاتها", "Motorcycles & gear"),
    blurb: L("دراجة، سكوتر، رباعية، أو خوذة/ملابس حماية.", "Bike, scooter, ATV, or protective gear."),
    icon: "🏍️",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "itemType",
        label: L("نوع البند", "Item type"),
        kind: "choice",
        required: true,
        options: [
          { id: "bike", name: L("دراجة نارية", "Motorcycle") },
          { id: "scooter", name: L("سكوتر", "Scooter") },
          { id: "atv", name: L("رباعية / صحراوية", "ATV / side-by-side") },
          { id: "helmet", name: L("خوذة أو ملابس حماية", "Helmet / protective apparel") },
          { id: "parts", name: L("قطع دراجة", "Bike parts") },
        ],
      },
      ...makeModelFields(L("مثال: ياماها", "e.g. Yamaha"), L("مثال: R3", "e.g. R3")),
      { id: "year", label: L("سنة الصنع", "Model year"), kind: "choice", required: true, options: years },
      {
        id: "cc",
        label: L("سعة المحرك", "Engine capacity"),
        kind: "choice",
        required: true,
        options: [
          { id: "50-125", name: L("50–125 سم³", "50–125 cc") },
          { id: "150-250", name: L("150–250 سم³", "150–250 cc") },
          { id: "300-500", name: L("300–500 سم³", "300–500 cc") },
          { id: "600-900", name: L("600–900 سم³", "600–900 cc") },
          { id: "1000+", name: L("1000 سم³ فأكثر", "1000+ cc") },
          { id: "na", name: L("غير منطبق", "Not applicable") },
        ],
      },
      { id: "mileage", label: L("المسافة المقطوعة", "Odometer"), kind: "choice", required: true, options: mileageBands },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      { id: "color", label: L("اللون", "Colour"), kind: "choice", required: true, options: colors },
      { id: "license", label: L("حالة الترخيص", "Registration status"), kind: "choice", required: true, options: licenseStatuses },
      ...listingTail(),
    ],
  },
  {
    id: "heavy",
    group: "vehicles",
    name: L("معدات ثقيلة", "Heavy equipment"),
    blurb: L("حفارات ورافعات ومولّدات — بساعات التشغيل.", "Excavators, cranes, generators — with operating hours."),
    icon: "🚜",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "equipType",
        label: L("فئة المعدة", "Equipment class"),
        kind: "choice",
        required: true,
        options: [
          { id: "excavator", name: L("حفّار", "Excavator") },
          { id: "loader", name: L("شيول / لودر", "Wheel loader") },
          { id: "bulldozer", name: L("جرّاف", "Bulldozer") },
          { id: "crane", name: L("رافعة", "Crane") },
          { id: "forklift", name: L("رافعة شوكية", "Forklift") },
          { id: "roller", name: L("مدحاة", "Compactor") },
          { id: "generator", name: L("مولّد كهرباء", "Generator") },
          { id: "agri", name: L("معدة زراعية", "Agricultural") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      ...makeModelFields(L("مثال: كاتربيلر", "e.g. Caterpillar"), L("مثال: 320D", "e.g. 320D")),
      { id: "year", label: L("سنة الصنع", "Model year"), kind: "choice", required: true, options: years },
      {
        id: "hours",
        label: L("ساعات التشغيل", "Operating hours"),
        kind: "choice",
        required: true,
        options: [
          { id: "0-1k", name: L("أقل من 1000 ساعة", "Under 1,000 h") },
          { id: "1-3k", name: L("1–3 آلاف ساعة", "1–3k h") },
          { id: "3-6k", name: L("3–6 آلاف ساعة", "3–6k h") },
          { id: "6-10k", name: L("6–10 آلاف ساعة", "6–10k h") },
          { id: "10k+", name: L("أكثر من 10 آلاف", "10k+ h") },
        ],
      },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "attachments",
        label: L("الملحقات المرافقة", "Included attachments"),
        kind: "multi",
        options: [
          { id: "bucket", name: L("دلو", "Bucket") },
          { id: "hammer", name: L("مطرقة هدم", "Breaker") },
          { id: "forks", name: L("شوك", "Forks") },
          { id: "blade", name: L("شفرة", "Blade") },
          { id: "none", name: L("بدون ملحقات", "None") },
        ],
      },
      ...listingTail(),
    ],
  },
  {
    id: "trucks",
    group: "vehicles",
    name: L("شاحنات وحافلات ومقطورات", "Trucks, buses & trailers"),
    blurb: L("حمولة ومحاور وحالة استخدام لأسطول العمل.", "Payload, axles, and condition for fleet buyers."),
    icon: "🚛",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "truckType",
        label: L("فئة المركبة", "Vehicle class"),
        kind: "choice",
        required: true,
        options: [
          { id: "truck", name: L("شاحنة", "Truck") },
          { id: "bus", name: L("حافلة", "Bus") },
          { id: "trailer", name: L("مقطورة", "Trailer") },
          { id: "tanker", name: L("صهريج", "Tanker") },
          { id: "reefer", name: L("مبرّدة", "Reefer") },
          { id: "box", name: L("صندوق مغلق", "Box body") },
        ],
      },
      ...makeModelFields(L("مثال: مرسيدس", "e.g. Mercedes"), L("مثال: أكتروس", "e.g. Actros")),
      { id: "year", label: L("سنة الصنع", "Model year"), kind: "choice", required: true, options: years },
      {
        id: "axles",
        label: L("عدد المحاور", "Axle count"),
        kind: "choice",
        required: true,
        options: [
          { id: "2", name: L("محوران", "2 axles") },
          { id: "3", name: L("3 محاور", "3 axles") },
          { id: "4+", name: L("4 فأكثر", "4+") },
        ],
      },
      {
        id: "payload",
        label: L("الطاقة التشغيلية", "Working capacity"),
        kind: "choice",
        required: true,
        options: [
          { id: "1-3t", name: L("1–3 طن", "1–3 t") },
          { id: "3-7t", name: L("3–7 طن", "3–7 t") },
          { id: "7-15t", name: L("7–15 طن", "7–15 t") },
          { id: "15t+", name: L("أكثر من 15 طن", "15t+") },
          { id: "passengers", name: L("نقل ركاب", "Passengers") },
        ],
      },
      { id: "mileage", label: L("المسافة المقطوعة", "Odometer"), kind: "choice", required: true, options: mileageBands },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "gearbox",
        label: L("علبة السرعات", "Gearbox"),
        kind: "choice",
        required: true,
        options: [
          { id: "auto", name: L("أوتوماتيك", "Automatic") },
          { id: "manual", name: L("يدوي", "Manual") },
        ],
      },
      ...listingTail(),
    ],
  },
  {
    id: "boats",
    group: "vehicles",
    name: L("قوارب ومركبات بحرية", "Boats & watercraft"),
    blurb: L("قارب أو جت سكي — بطول وساعات محرك.", "Boat or jet ski — with length and engine hours."),
    icon: "🚤",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "vesselType",
        label: L("نوع المركبة البحرية", "Watercraft type"),
        kind: "choice",
        required: true,
        options: [
          { id: "boat", name: L("قارب", "Boat") },
          { id: "jetski", name: L("جت سكي", "Jet ski") },
          { id: "yacht", name: L("يخت", "Yacht") },
          { id: "dinghy", name: L("قارب صغير", "Dinghy") },
        ],
      },
      ...makeModelFields(L("مثال: ياماها", "e.g. Yamaha"), L("مثال: VX", "e.g. VX")),
      { id: "year", label: L("سنة الصنع", "Model year"), kind: "choice", required: true, options: years },
      {
        id: "length",
        label: L("الطول التقريبي", "Approx. length"),
        kind: "choice",
        required: true,
        options: [
          { id: "u3", name: L("أقل من 3 م", "Under 3 m") },
          { id: "3-6", name: L("3–6 م", "3–6 m") },
          { id: "6-10", name: L("6–10 م", "6–10 m") },
          { id: "10+", name: L("أكثر من 10 م", "Over 10 m") },
          { id: "na", name: L("غير منطبق", "Not applicable") },
        ],
      },
      {
        id: "engineHours",
        label: L("ساعات المحرك", "Engine hours"),
        kind: "choice",
        required: true,
        options: [
          { id: "0-50", name: L("أقل من 50", "Under 50") },
          { id: "50-200", name: L("50–200", "50–200") },
          { id: "200-500", name: L("200–500", "200–500") },
          { id: "500+", name: L("أكثر من 500", "500+") },
        ],
      },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "trailer",
        label: L("مقطورة نقل", "Transport trailer"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("مرفقة", "Included") },
          { id: "no", name: L("غير مرفقة", "Not included") },
        ],
      },
      ...listingTail(),
    ],
  },
  {
    id: "plates",
    group: "plates",
    name: L("أرقام لوحات مميزة", "Distinctive plate numbers"),
    blurb: L("رمز وأرقام وقابلية النقل — دون غموض.", "Code, digits, and transfer terms — no ambiguity."),
    icon: "🔢",
    requestKind: "plate",
    mode: "wizard",
    fields: [
      {
        id: "plateCode",
        label: L("حروف / رمز اللوحة", "Plate letters / code"),
        kind: "text",
        required: true,
        placeholder: L("مثال حسب نظام اللوحة", "Per local plate system"),
      },
      {
        id: "plateDigits",
        label: L("الأرقام", "Digits"),
        kind: "text",
        required: true,
        placeholder: L("مثال: 1111", "e.g. 1111"),
      },
      {
        id: "digitCount",
        label: L("عدد الخانات", "Digit places"),
        kind: "choice",
        required: true,
        options: [
          { id: "1", name: L("خانة واحدة", "1 digit") },
          { id: "2", name: L("خانتان", "2 digits") },
          { id: "3", name: L("3 خانات", "3 digits") },
          { id: "4", name: L("4 خانات", "4 digits") },
          { id: "5+", name: L("5 فأكثر", "5+") },
        ],
      },
      {
        id: "plateStyle",
        label: L("تصنيف اللوحة", "Plate class"),
        kind: "choice",
        required: true,
        options: [
          { id: "private", name: L("خصوصي", "Private") },
          { id: "commercial", name: L("تجاري", "Commercial") },
          { id: "classic", name: L("تراثي / كلاسيك", "Classic") },
          { id: "other", name: L("تصنيف آخر", "Other") },
        ],
      },
      {
        id: "transferable",
        label: L("نقل الملكية", "Ownership transfer"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("قابل للنقل فورًا", "Transferable now") },
          { id: "owner-only", name: L("يشترط موافقة المالك", "Owner approval required") },
          { id: "no", name: L("غير قابل للنقل", "Not transferable") },
        ],
      },
      ...listingTail({
        minPhotos: 1,
        photosLead: L("صورة واضحة للوحة تكفي للبدء.", "One clear plate photo is enough to start."),
        priceLead: L("سعر التنازل عن الرقم.", "Price for the number transfer."),
      }),
    ],
  },
  {
    id: "tires",
    group: "parts",
    name: L("إطارات وعجلات", "Tires & wheels"),
    blurb: L("مقاس وكمية وحالة — مع توافق المركبة.", "Size, quantity, condition — plus vehicle fitment."),
    icon: "⭕",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "product",
        label: L("ماذا تعرض؟", "What are you offering?"),
        kind: "choice",
        required: true,
        options: [
          { id: "tires", name: L("إطارات فقط", "Tires only") },
          { id: "rims", name: L("عجلات / جنوط فقط", "Wheels / rims only") },
          { id: "set", name: L("طقم إطار + عجلة", "Tire + wheel set") },
        ],
      },
      {
        id: "diameter",
        label: L("قطر العجلة", "Wheel diameter"),
        kind: "choice",
        required: true,
        options: ["14", "15", "16", "17", "18", "19", "20", "21", "22", "24"].map((n) => ({
          id: n,
          name: L(`${n} بوصة`, `${n} in`),
        })),
      },
      {
        id: "size",
        label: L("رمز المقاس", "Size code"),
        kind: "text",
        required: true,
        placeholder: L("مثال: 265/65R17", "e.g. 265/65R17"),
      },
      {
        id: "brand",
        label: L("العلامة التجارية", "Brand"),
        kind: "text",
        required: true,
        placeholder: L("مثال: ميشلان", "e.g. Michelin"),
      },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "quantity",
        label: L("الكمية", "Quantity"),
        kind: "choice",
        required: true,
        options: ["1", "2", "3", "4", "5+"].map((n) => ({ id: n, name: L(n, n) })),
      },
      {
        id: "fitment",
        label: L("يناسب المركبات", "Fits vehicles"),
        kind: "text",
        placeholder: L("مثال: لاندكروزر / باترول", "e.g. Land Cruiser / Patrol"),
      },
      ...listingTail(),
    ],
  },
  {
    id: "parts",
    group: "parts",
    name: L("قطع غيار المركبات", "Vehicle spare parts"),
    blurb: L("صنّف القطعة بنظامها ثم التوافق — أسرع من القوائم الطويلة.", "Classify by system then fitment — faster than endless menus."),
    icon: "⚙️",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "partCategory",
        label: L("نظام القطعة", "Part system"),
        lead: L("اختر النظام الأقرب بدل قوائم متشعّبة لا تنتهي.", "Pick the closest system instead of endless nested lists."),
        kind: "choice",
        required: true,
        options: partSystems,
      },
      {
        id: "partName",
        label: L("اسم القطعة", "Part name"),
        kind: "text",
        required: true,
        placeholder: L("مثال: قرص فرامل أمامي", "e.g. Front brake disc"),
      },
      {
        id: "oem",
        label: L("رقم القطعة / OEM", "Part / OEM number"),
        kind: "text",
        placeholder: L("إن وُجد — يسرّع البحث للمشتري", "If available — helps buyers find it"),
      },
      {
        id: "originPart",
        label: L("مصدر القطعة", "Part origin"),
        kind: "choice",
        required: true,
        options: [
          { id: "oem", name: L("أصلية وكالة", "OEM / genuine") },
          { id: "oem-used", name: L("أصلية مستعملة", "Used genuine") },
          { id: "aftermarket", name: L("بديلة معتمدة", "Quality aftermarket") },
          { id: "unknown", name: L("غير محدد", "Unspecified") },
        ],
      },
      ...makeModelFields(L("مثال: تويوتا", "e.g. Toyota"), L("مثال: كورولا", "e.g. Corolla"), {
        make: L("يناسب الشركة", "Fits make"),
        model: L("يناسب الطراز", "Fits model"),
      }),
      { id: "yearFrom", label: L("من سنة", "From year"), kind: "choice", required: true, options: years },
      { id: "yearTo", label: L("إلى سنة", "To year"), kind: "choice", required: true, options: years },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "quantity",
        label: L("الكمية المتوفرة", "Available qty"),
        kind: "number",
        required: true,
        placeholder: L("1", "1"),
      },
      ...listingTail(),
    ],
  },
  {
    id: "consumables",
    group: "parts",
    name: L("زيوت ومواد تشغيل", "Oils & service fluids"),
    blurb: L("زيوت محرك/ناقل، فلاتر، وسوائل خدمة — بمواصفة واضحة.", "Engine/gear oils, filters, service fluids — with clear specs."),
    icon: "🛢️",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "fluidType",
        label: L("نوع المادة", "Product type"),
        kind: "choice",
        required: true,
        options: [
          { id: "engine-oil", name: L("زيت محرك", "Engine oil") },
          { id: "gear-oil", name: L("زيت ناقل / دفرنس", "Gear / diff oil") },
          { id: "brake-fluid", name: L("سائل فرامل", "Brake fluid") },
          { id: "coolant", name: L("سائل تبريد", "Coolant") },
          { id: "filter", name: L("فلتر", "Filter") },
          { id: "battery", name: L("بطارية", "Battery") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      {
        id: "spec",
        label: L("المواصفة / اللزوجة", "Spec / viscosity"),
        kind: "text",
        required: true,
        placeholder: L("مثال: 5W-30 · API SP", "e.g. 5W-30 · API SP"),
      },
      {
        id: "brand",
        label: L("العلامة", "Brand"),
        kind: "text",
        required: true,
        placeholder: L("مثال: شل", "e.g. Shell"),
      },
      { id: "condition", label: L("حالة المنتج", "Product state"), kind: "choice", required: true, options: conditions },
      {
        id: "volume",
        label: L("الحجم / العبوة", "Pack size"),
        kind: "text",
        required: true,
        placeholder: L("مثال: 4 لتر", "e.g. 4 L"),
      },
      {
        id: "fitment",
        label: L("يناسب", "Suitable for"),
        kind: "text",
        placeholder: L("بنزين / ديزل / طراز محدد", "Petrol / diesel / specific model"),
      },
      ...listingTail(),
    ],
  },
  {
    id: "accessories",
    group: "parts",
    name: L("إضافات وتجهيزات", "Add-ons & fitments"),
    blurb: L("شاشات، إضاءة، حماية، وحمّالات — مع خيار التركيب.", "Screens, lighting, protection, racks — with install option."),
    icon: "✨",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "accType",
        label: L("فئة الإضافة", "Add-on class"),
        kind: "choice",
        required: true,
        options: [
          { id: "audio", name: L("صوتيات وشاشات", "Audio & screens") },
          { id: "lights", name: L("إضاءة إضافية", "Extra lighting") },
          { id: "covers", name: L("أغطية وتلبيس", "Covers & trim") },
          { id: "roof", name: L("حمّالات سقف", "Roof racks") },
          { id: "interior", name: L("تجهيز داخلي", "Interior") },
          { id: "exterior", name: L("تجهيز خارجي", "Exterior") },
          { id: "security", name: L("حماية وأمان", "Security") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      {
        id: "name",
        label: L("اسم المنتج", "Product name"),
        kind: "text",
        required: true,
        placeholder: L("مثال: شاشة أندرويد 10 بوصة", "e.g. 10\" Android screen"),
      },
      {
        id: "brand",
        label: L("العلامة", "Brand"),
        kind: "text",
        placeholder: L("إن وُجدت", "If known"),
      },
      { id: "condition", label: L("حالة الاستخدام", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "fitment",
        label: L("التوافق", "Fitment"),
        kind: "text",
        placeholder: L("عام أو طراز محدد", "Universal or specific model"),
      },
      {
        id: "install",
        label: L("خدمة التركيب", "Installation"),
        kind: "choice",
        required: true,
        options: [
          { id: "included", name: L("مشمولة في السعر", "Included in price") },
          { id: "optional", name: L("متاحة بأجرة منفصلة", "Available separately") },
          { id: "none", name: L("بدون تركيب", "No install") },
        ],
      },
      ...listingTail(),
    ],
  },
];

export function findListingSection(id: string) {
  return listingSections.find((item) => item.id === id) ?? null;
}

export function sectionsByGroup(group: SectionGroup) {
  return listingSections.filter((item) => item.group === group);
}
