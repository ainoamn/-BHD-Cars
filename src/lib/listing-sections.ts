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
  /** Skip auto-advance even for choice fields (e.g. multi-count UIs). */
  hold?: boolean;
};

export type ListingSection = {
  id: string;
  name: Copy;
  blurb: Copy;
  icon: string;
  requestKind: RequestKind;
  /** Ready-made cars use the dedicated SellWizard. */
  mode: "cars-sale" | "wizard";
  fields: FieldDef[];
};

const years = Array.from({ length: 30 }, (_, i) => {
  const y = String(2026 - i);
  return { id: y, name: L(y, y) };
});

const mileageBands: FieldOption[] = [
  { id: "0-20", name: L("أقل من 20 ألف", "Under 20k") },
  { id: "20-50", name: L("20–50 ألف", "20–50k") },
  { id: "50-100", name: L("50–100 ألف", "50–100k") },
  { id: "100-150", name: L("100–150 ألف", "100–150k") },
  { id: "150+", name: L("أكثر من 150 ألف", "150k+") },
];

const colors: FieldOption[] = [
  { id: "white", name: L("أبيض", "White") },
  { id: "black", name: L("أسود", "Black") },
  { id: "silver", name: L("فضي", "Silver") },
  { id: "grey", name: L("رمادي", "Grey") },
  { id: "red", name: L("أحمر", "Red") },
  { id: "blue", name: L("أزرق", "Blue") },
  { id: "green", name: L("أخضر", "Green") },
  { id: "other", name: L("آخر", "Other") },
];

function locationFields(): FieldDef[] {
  return [
    {
      id: "governorate",
      label: L("المحافظة", "Governorate"),
      lead: L("ابدأ بالمحافظة ثم الولاية ثم القرية.", "Start with governorate, then wilayat, then village."),
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
      label: L("القرية / المنطقة", "Village / area"),
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
      label: L("الصور", "Photos"),
      lead:
        opts?.photosLead ??
        L("صورتان على الأقل — صور أوضح تعني ثقة أعلى.", "At least two photos — clearer photos build trust."),
      kind: "photos",
      required: true,
      minPhotos: opts?.minPhotos ?? 2,
    },
    ...locationFields(),
    {
      id: "title",
      label: L("اسم الإعلان", "Ad title"),
      lead: L("عنوان واضح يساعد المشترين على الفهم بسرعة.", "A clear title helps buyers understand quickly."),
      kind: "title",
      required: true,
      maxLength: 100,
      placeholder: L("اكتب عنوان الإعلان", "Write the ad title"),
    },
    {
      id: "note",
      label: L("الوصف", "Description"),
      lead: L("اختياري — أضف تفاصيل مهمة للمشتري.", "Optional — add details buyers need."),
      kind: "textarea",
      maxLength: 4000,
      placeholder: L("اكتب وصف الإعلان", "Write the listing description"),
    },
    {
      id: "price",
      label: opts?.priceLabel ?? L("السعر", "Price"),
      lead: opts?.priceLead ?? L("أدخل السعر الكامل بالريال العماني.", "Enter the full price in Omani Rial."),
      kind: "price",
      required: true,
      suffix: L("ر.ع", "OMR"),
    },
    {
      id: "payment",
      label: L("طريقة الدفع", "Payment method"),
      kind: "choice",
      required: true,
      options: paymentMethods,
    },
    {
      id: "phone",
      label: L("رقم الهاتف", "Phone"),
      lead: L("رقم عمان للتواصل بشأن الإعلان.", "Omani number for listing contact."),
      kind: "phone",
      required: true,
    },
  ];
}

export const listingSections: ListingSection[] = [
  {
    id: "cars-sale",
    name: L("سيارات للبيع", "Cars for sale"),
    blurb: L("إعلان سيارة جاهزة أو بحادث معلن.", "List a ready car or a declared accident car."),
    icon: "🚗",
    requestKind: "sell",
    mode: "cars-sale",
    fields: [],
  },
  {
    id: "cars-rent",
    name: L("مركبات للإيجار", "Vehicles for rent"),
    blurb: L("تأجير يومي أو شهري بسياسة ممشى واضحة.", "Daily or monthly hire with a clear mileage policy."),
    icon: "🔑",
    requestKind: "rental",
    mode: "wizard",
    fields: [
      {
        id: "vehicleKind",
        label: L("نوع المركبة", "Vehicle type"),
        kind: "choice",
        required: true,
        options: [
          { id: "sedan", name: L("سيدان", "Sedan") },
          { id: "suv", name: L("دفع رباعي", "SUV") },
          { id: "van", name: L("فان", "Van") },
          { id: "pickup", name: L("بيك أب", "Pickup") },
          { id: "luxury", name: L("فاخرة", "Luxury") },
          { id: "bus", name: L("باص", "Bus") },
        ],
      },
      {
        id: "make",
        label: L("الشركة", "Make"),
        kind: "text",
        required: true,
        placeholder: L("مثال: تويوتا", "e.g. Toyota"),
      },
      {
        id: "model",
        label: L("الموديل", "Model"),
        kind: "text",
        required: true,
        placeholder: L("مثال: كامري", "e.g. Camry"),
      },
      { id: "year", label: L("سنة الصنع", "Year"), kind: "choice", required: true, options: years },
      {
        id: "gearbox",
        label: L("ناقل الحركة", "Transmission"),
        kind: "choice",
        required: true,
        options: [
          { id: "auto", name: L("أوتوماتيك", "Automatic") },
          { id: "manual", name: L("عادي", "Manual") },
        ],
      },
      { id: "seats", label: L("عدد المقاعد", "Seats"), kind: "choice", required: true, options: seatCounts },
      {
        id: "period",
        label: L("مدة الإيجار", "Rental period"),
        kind: "choice",
        required: true,
        options: [
          { id: "daily", name: L("يومي", "Daily") },
          { id: "weekly", name: L("أسبوعي", "Weekly") },
          { id: "monthly", name: L("شهري", "Monthly") },
          { id: "flexible", name: L("مرن", "Flexible") },
        ],
      },
      {
        id: "mileagePolicy",
        label: L("سياسة الممشى", "Mileage policy"),
        kind: "choice",
        required: true,
        options: [
          { id: "limited", name: L("محدود", "Limited") },
          { id: "unlimited", name: L("غير محدود", "Unlimited") },
        ],
      },
      {
        id: "deposit",
        label: L("التأمين / العربون", "Deposit"),
        kind: "number",
        required: true,
        placeholder: L("مبلغ العربون", "Deposit amount"),
        suffix: L("ر.ع", "OMR"),
      },
      { id: "delivery", label: L("التوصيل", "Delivery"), kind: "choice", required: true, options: [
        { id: "yes", name: L("متوفر", "Available") },
        { id: "no", name: L("غير متوفر", "Not available") },
      ]},
      ...listingTail({
        priceLabel: L("سعر الإيجار", "Rental rate"),
        priceLead: L("اكتب سعر الفترة المختارة (يومي/شهري).", "Enter the rate for the selected period."),
      }),
    ],
  },
  {
    id: "scrap",
    name: L("سكراب — سيارات ومركبات أخرى", "Scrap — cars & other vehicles"),
    blurb: L("هيكل كامل أو قطع سكراب بحالة ملكية واضحة.", "Whole shell or scrap parts with clear ownership."),
    icon: "🛠️",
    requestKind: "scrap",
    mode: "wizard",
    fields: [
      {
        id: "scrapType",
        label: L("نوع السكراب", "Scrap type"),
        kind: "choice",
        required: true,
        options: [
          { id: "whole", name: L("مركبة كاملة", "Whole vehicle") },
          { id: "shell", name: L("هيكل فقط", "Shell only") },
          { id: "parts", name: L("قطع سكراب", "Scrap parts") },
          { id: "engine", name: L("محرك / قير", "Engine / gearbox") },
        ],
      },
      { id: "make", label: L("الشركة", "Make"), kind: "text", required: true, placeholder: L("مثال: نيسان", "e.g. Nissan") },
      { id: "model", label: L("الموديل", "Model"), kind: "text", required: true, placeholder: L("مثال: باترول", "e.g. Patrol") },
      { id: "year", label: L("سنة الصنع", "Year"), kind: "choice", required: true, options: years },
      {
        id: "damageLevel",
        label: L("مستوى الضرر", "Damage level"),
        kind: "choice",
        required: true,
        options: [
          { id: "light", name: L("خفيف", "Light") },
          { id: "medium", name: L("متوسط", "Medium") },
          { id: "heavy", name: L("ثقيل", "Heavy") },
          { id: "burnt", name: L("محروق", "Burnt") },
          { id: "flood", name: L("غرق", "Flood") },
        ],
      },
      {
        id: "titleStatus",
        label: L("حالة الملكية", "Title status"),
        kind: "choice",
        required: true,
        options: [
          { id: "clear", name: L("ملكية سليمة", "Clear title") },
          { id: "papers", name: L("أوراق ناقصة", "Incomplete papers") },
          { id: "none", name: L("بدون أوراق", "No papers") },
        ],
      },
      {
        id: "exportable",
        label: L("قابل للتصدير", "Exportable"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("نعم", "Yes") },
          { id: "no", name: L("لا", "No") },
          { id: "unknown", name: L("غير معروف", "Unknown") },
        ],
      },
      ...listingTail({
        photosLead: L("صور الضرر والهيكل مهمة جدًا للسكراب.", "Damage and shell photos matter most for scrap."),
      }),
    ],
  },
  {
    id: "motorcycle",
    name: L("دراجات نارية ومستلزمات", "Motorcycles & gear"),
    blurb: L("دراجة أو خوذة أو ملحقات بدقة المحرك والنوع.", "Bike, helmet, or gear — with type and engine size."),
    icon: "🏍️",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "itemType",
        label: L("ماذا تعلن؟", "What are you listing?"),
        kind: "choice",
        required: true,
        options: [
          { id: "bike", name: L("دراجة نارية", "Motorcycle") },
          { id: "scooter", name: L("سكوتر", "Scooter") },
          { id: "atv", name: L("دراجة رباعية", "ATV") },
          { id: "helmet", name: L("خوذة / ملابس", "Helmet / apparel") },
          { id: "parts", name: L("قطع دراجة", "Bike parts") },
        ],
      },
      { id: "make", label: L("الشركة", "Make"), kind: "text", required: true, placeholder: L("مثال: ياماها", "e.g. Yamaha") },
      { id: "model", label: L("الموديل", "Model"), kind: "text", required: true, placeholder: L("مثال: R1", "e.g. R1") },
      { id: "year", label: L("سنة الصنع", "Year"), kind: "choice", required: true, options: years },
      {
        id: "cc",
        label: L("سعة المحرك", "Engine size"),
        kind: "choice",
        required: true,
        options: [
          { id: "50-125", name: L("50–125 سي سي", "50–125 cc") },
          { id: "150-250", name: L("150–250 سي سي", "150–250 cc") },
          { id: "300-500", name: L("300–500 سي سي", "300–500 cc") },
          { id: "600-900", name: L("600–900 سي سي", "600–900 cc") },
          { id: "1000+", name: L("1000 سي سي فأكثر", "1000+ cc") },
          { id: "na", name: L("غير منطبق", "N/A") },
        ],
      },
      { id: "mileage", label: L("الممشى", "Mileage"), kind: "choice", required: true, options: mileageBands },
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      { id: "color", label: L("اللون", "Colour"), kind: "choice", required: true, options: colors },
      { id: "license", label: L("الترخيص", "License"), kind: "choice", required: true, options: licenseStatuses },
      ...listingTail(),
    ],
  },
  {
    id: "heavy",
    name: L("آليات ثقيلة", "Heavy machinery"),
    blurb: L("حفارات ورافعات ورافعات شوكية بساعات التشغيل.", "Excavators, cranes, forklifts — with operating hours."),
    icon: "🚜",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "equipType",
        label: L("نوع الآلية", "Equipment type"),
        kind: "choice",
        required: true,
        options: [
          { id: "excavator", name: L("حفّار", "Excavator") },
          { id: "loader", name: L("شيول / لودر", "Loader") },
          { id: "bulldozer", name: L("بلدوزر", "Bulldozer") },
          { id: "crane", name: L("رافعة", "Crane") },
          { id: "forklift", name: L("رافعة شوكية", "Forklift") },
          { id: "roller", name: L("مدحاة", "Roller") },
          { id: "generator", name: L("مولّد", "Generator") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      { id: "make", label: L("الشركة", "Make"), kind: "text", required: true, placeholder: L("مثال: كاتربيلر", "e.g. Caterpillar") },
      { id: "model", label: L("الموديل", "Model"), kind: "text", required: true, placeholder: L("مثال: 320D", "e.g. 320D") },
      { id: "year", label: L("سنة الصنع", "Year"), kind: "choice", required: true, options: years },
      {
        id: "hours",
        label: L("ساعات التشغيل", "Operating hours"),
        kind: "choice",
        required: true,
        options: [
          { id: "0-1k", name: L("أقل من 1000", "Under 1,000") },
          { id: "1-3k", name: L("1–3 آلاف", "1–3k") },
          { id: "3-6k", name: L("3–6 آلاف", "3–6k") },
          { id: "6-10k", name: L("6–10 آلاف", "6–10k") },
          { id: "10k+", name: L("أكثر من 10 آلاف", "10k+") },
        ],
      },
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "attachments",
        label: L("الملحقات", "Attachments"),
        kind: "multi",
        options: [
          { id: "bucket", name: L("دلو", "Bucket") },
          { id: "hammer", name: L("مطرقة", "Breaker") },
          { id: "forks", name: L("شوك", "Forks") },
          { id: "blade", name: L("شفرة", "Blade") },
          { id: "none", name: L("بدون", "None") },
        ],
      },
      ...listingTail(),
    ],
  },
  {
    id: "trucks",
    name: L("الحافلات والشاحنات والمقطورات", "Buses, trucks & trailers"),
    blurb: L("حمولة ومحاور وسنة الصنع لمشتري الأسطول.", "Payload, axles, and year for fleet buyers."),
    icon: "🚛",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "truckType",
        label: L("النوع", "Type"),
        kind: "choice",
        required: true,
        options: [
          { id: "truck", name: L("شاحنة", "Truck") },
          { id: "bus", name: L("حافلة", "Bus") },
          { id: "trailer", name: L("مقطورة", "Trailer") },
          { id: "tanker", name: L("صهريج", "Tanker") },
          { id: "reefer", name: L("مبرّدة", "Reefer") },
        ],
      },
      { id: "make", label: L("الشركة", "Make"), kind: "text", required: true, placeholder: L("مثال: مرسيدس", "e.g. Mercedes") },
      { id: "model", label: L("الموديل", "Model"), kind: "text", required: true, placeholder: L("مثال: أكتروس", "e.g. Actros") },
      { id: "year", label: L("سنة الصنع", "Year"), kind: "choice", required: true, options: years },
      {
        id: "axles",
        label: L("عدد المحاور", "Axles"),
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
        label: L("الحمولة", "Payload"),
        kind: "choice",
        required: true,
        options: [
          { id: "1-3t", name: L("1–3 طن", "1–3 t") },
          { id: "3-7t", name: L("3–7 طن", "3–7 t") },
          { id: "7-15t", name: L("7–15 طن", "7–15 t") },
          { id: "15t+", name: L("أكثر من 15 طن", "15t+") },
          { id: "passengers", name: L("ركاب", "Passengers") },
        ],
      },
      { id: "mileage", label: L("الممشى", "Mileage"), kind: "choice", required: true, options: mileageBands },
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      { id: "gearbox", label: L("ناقل الحركة", "Transmission"), kind: "choice", required: true, options: [
        { id: "auto", name: L("أوتوماتيك", "Automatic") },
        { id: "manual", name: L("عادي", "Manual") },
      ]},
      ...listingTail(),
    ],
  },
  {
    id: "boats",
    name: L("قوارب وجت سكي", "Boats & jet skis"),
    blurb: L("طول القارب وساعات المحرك ونوع الهيكل.", "Length, engine hours, and hull type."),
    icon: "🚤",
    requestKind: "sell",
    mode: "wizard",
    fields: [
      {
        id: "vesselType",
        label: L("النوع", "Type"),
        kind: "choice",
        required: true,
        options: [
          { id: "boat", name: L("قارب", "Boat") },
          { id: "jetski", name: L("جت سكي", "Jet ski") },
          { id: "yacht", name: L("يخت", "Yacht") },
          { id: "dinghy", name: L("قارب صغير", "Dinghy") },
        ],
      },
      { id: "make", label: L("الشركة", "Make"), kind: "text", required: true, placeholder: L("مثال: ياماها", "e.g. Yamaha") },
      { id: "model", label: L("الموديل", "Model"), kind: "text", required: true, placeholder: L("مثال: VX Cruiser", "e.g. VX Cruiser") },
      { id: "year", label: L("سنة الصنع", "Year"), kind: "choice", required: true, options: years },
      {
        id: "length",
        label: L("الطول", "Length"),
        kind: "choice",
        required: true,
        options: [
          { id: "u3", name: L("أقل من 3 م", "Under 3 m") },
          { id: "3-6", name: L("3–6 م", "3–6 m") },
          { id: "6-10", name: L("6–10 م", "6–10 m") },
          { id: "10+", name: L("أكثر من 10 م", "10 m+") },
          { id: "na", name: L("غير منطبق", "N/A") },
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
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "trailer",
        label: L("مقطورة", "Trailer included"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("نعم", "Yes") },
          { id: "no", name: L("لا", "No") },
        ],
      },
      ...listingTail(),
    ],
  },
  {
    id: "plates",
    name: L("أرقام مركبات مميزة للبيع", "Special vehicle plates"),
    blurb: L("رمز اللوحة وعدد الأرقام وقابلية النقل.", "Plate code, digit count, and transferability."),
    icon: "🔢",
    requestKind: "plate",
    mode: "wizard",
    fields: [
      {
        id: "plateCode",
        label: L("رمز / حروف اللوحة", "Plate code / letters"),
        kind: "text",
        required: true,
        placeholder: L("مثال: أ ب ج", "e.g. A B C"),
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
        label: L("عدد الأرقام", "Digit count"),
        kind: "choice",
        required: true,
        options: [
          { id: "1", name: L("رقم واحد", "1 digit") },
          { id: "2", name: L("رقمان", "2 digits") },
          { id: "3", name: L("3 أرقام", "3 digits") },
          { id: "4", name: L("4 أرقام", "4 digits") },
          { id: "5+", name: L("5 فأكثر", "5+") },
        ],
      },
      {
        id: "plateStyle",
        label: L("نوع اللوحة", "Plate style"),
        kind: "choice",
        required: true,
        options: [
          { id: "private", name: L("خصوصي", "Private") },
          { id: "commercial", name: L("تجاري", "Commercial") },
          { id: "classic", name: L("كلاسيك", "Classic") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      {
        id: "transferable",
        label: L("قابلة للنقل", "Transferable"),
        kind: "choice",
        required: true,
        options: [
          { id: "yes", name: L("نعم", "Yes") },
          { id: "no", name: L("لا", "No") },
          { id: "owner-only", name: L("بموافقة المالك", "Owner approval") },
        ],
      },
      ...listingTail({
        minPhotos: 1,
        photosLead: L("صورة واضحة للوحة كافية للبدء.", "A clear plate photo is enough to start."),
        priceLead: L("سعر نقل الرقم / اللوحة.", "Price for the plate transfer."),
      }),
    ],
  },
  {
    id: "tires",
    name: L("إطارات وجنوط", "Tires & rims"),
    blurb: L("مقاس الإطار أو الجنط والكمية والحالة.", "Tire/rim size, quantity, and condition."),
    icon: "⭕",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "product",
        label: L("المنتج", "Product"),
        kind: "choice",
        required: true,
        options: [
          { id: "tires", name: L("إطارات", "Tires") },
          { id: "rims", name: L("جنوط", "Rims") },
          { id: "set", name: L("طقم كامل", "Full set") },
        ],
      },
      {
        id: "diameter",
        label: L("قطر الجنط / الإطار", "Diameter"),
        kind: "choice",
        required: true,
        options: ["14", "15", "16", "17", "18", "19", "20", "21", "22", "24"].map((n) => ({
          id: n,
          name: L(`${n} إنش`, `${n}"`),
        })),
      },
      {
        id: "size",
        label: L("مقاس الإطار", "Tire size"),
        kind: "text",
        required: true,
        placeholder: L("مثال: 265/65R17", "e.g. 265/65R17"),
      },
      {
        id: "brand",
        label: L("العلامة", "Brand"),
        kind: "text",
        required: true,
        placeholder: L("مثال: ميشلان", "e.g. Michelin"),
      },
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "quantity",
        label: L("الكمية", "Quantity"),
        kind: "choice",
        required: true,
        options: [
          { id: "1", name: L("1", "1") },
          { id: "2", name: L("2", "2") },
          { id: "3", name: L("3", "3") },
          { id: "4", name: L("4", "4") },
          { id: "5+", name: L("5+", "5+") },
        ],
      },
      {
        id: "fitment",
        label: L("يناسب", "Fits"),
        kind: "text",
        placeholder: L("مثال: لاندكروزر / باترول", "e.g. Land Cruiser / Patrol"),
      },
      ...listingTail(),
    ],
  },
  {
    id: "parts",
    name: L("قطع غيار المركبات", "Vehicle spare parts"),
    blurb: L("اسم القطعة والتوافق مع الماركة والموديل.", "Part name and make/model compatibility."),
    icon: "⚙️",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "partCategory",
        label: L("فئة القطعة", "Part category"),
        kind: "choice",
        required: true,
        options: [
          { id: "engine", name: L("محرك", "Engine") },
          { id: "body", name: L("بودي", "Body") },
          { id: "electrical", name: L("كهرباء", "Electrical") },
          { id: "suspension", name: L("تعليق", "Suspension") },
          { id: "brakes", name: L("فرامل", "Brakes") },
          { id: "interior", name: L("داخلي", "Interior") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      {
        id: "partName",
        label: L("اسم القطعة", "Part name"),
        kind: "text",
        required: true,
        placeholder: L("مثال: كشاف أمامي", "e.g. Headlight"),
      },
      {
        id: "oem",
        label: L("رقم القطعة / OEM", "Part / OEM number"),
        kind: "text",
        placeholder: L("إن وُجد", "If available"),
      },
      { id: "make", label: L("يناسب الشركة", "Fits make"), kind: "text", required: true, placeholder: L("مثال: تويوتا", "e.g. Toyota") },
      { id: "model", label: L("يناسب الموديل", "Fits model"), kind: "text", required: true, placeholder: L("مثال: كورولا", "e.g. Corolla") },
      {
        id: "yearFrom",
        label: L("من سنة", "From year"),
        kind: "choice",
        required: true,
        options: years,
      },
      {
        id: "yearTo",
        label: L("إلى سنة", "To year"),
        kind: "choice",
        required: true,
        options: years,
      },
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "quantity",
        label: L("الكمية", "Quantity"),
        kind: "number",
        required: true,
        placeholder: L("1", "1"),
      },
      ...listingTail(),
    ],
  },
  {
    id: "accessories",
    name: L("إكسسوارات المركبات", "Vehicle accessories"),
    blurb: L("إضافات وتجهيزات بحالة وتوافق واضح.", "Add-ons with clear condition and fitment."),
    icon: "✨",
    requestKind: "part",
    mode: "wizard",
    fields: [
      {
        id: "accType",
        label: L("نوع الإكسسوار", "Accessory type"),
        kind: "choice",
        required: true,
        options: [
          { id: "audio", name: L("صوتيات", "Audio") },
          { id: "lights", name: L("إضاءة", "Lighting") },
          { id: "covers", name: L("تلبيس / أغطية", "Covers") },
          { id: "roof", name: L("سقف / حمّالات", "Roof / racks") },
          { id: "interior", name: L("داخلي", "Interior") },
          { id: "exterior", name: L("خارجي", "Exterior") },
          { id: "security", name: L("حماية", "Security") },
          { id: "other", name: L("أخرى", "Other") },
        ],
      },
      {
        id: "name",
        label: L("اسم المنتج", "Product name"),
        kind: "text",
        required: true,
        placeholder: L("مثال: شاشة أندرويد", "e.g. Android screen"),
      },
      {
        id: "brand",
        label: L("العلامة", "Brand"),
        kind: "text",
        placeholder: L("مثال: جينيسيس", "e.g. Pioneer"),
      },
      { id: "condition", label: L("الحالة", "Condition"), kind: "choice", required: true, options: conditions },
      {
        id: "fitment",
        label: L("التوافق", "Fitment"),
        kind: "text",
        placeholder: L("عام أو ماركة/موديل محدد", "Universal or specific make/model"),
      },
      {
        id: "install",
        label: L("التركيب", "Installation"),
        kind: "choice",
        required: true,
        options: [
          { id: "included", name: L("يشمل التركيب", "Includes install") },
          { id: "optional", name: L("تركيب اختياري", "Optional install") },
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
