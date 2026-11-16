import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export type Option = { id: string; name: Copy };

export const conditions: Option[] = [
  { id: "used", name: L("مستعمل", "Used") },
  { id: "new", name: L("جديد", "New") },
];

export const regionalSpecs: Option[] = [
  { id: "gcc", name: L("مواصفات دول الخليج", "GCC-built specs") },
  { id: "american", name: L("مواصفات السوق الأمريكي", "US-market specs") },
  { id: "european", name: L("مواصفات السوق الأوروبي", "EU-market specs") },
  { id: "japanese", name: L("مواصفات السوق الياباني", "Japan-market specs") },
  { id: "korean", name: L("مواصفات السوق الكوري", "Korea-market specs") },
  { id: "chinese", name: L("مواصفات السوق الصيني", "China-market specs") },
  { id: "agency", name: L("مواصفات الوكالة المحلية", "Local dealer specs") },
  { id: "other", name: L("مصدر مواصفات آخر", "Other market origin") },
];

export const fuelTypes: Option[] = [
  { id: "petrol", name: L("بنزين", "Petrol") },
  { id: "diesel", name: L("ديزل", "Diesel") },
  { id: "hybrid", name: L("هايبرد", "Hybrid") },
  { id: "mild-hybrid", name: L("مايلد هايبرد", "Mild hybrid") },
  { id: "plugin-hybrid", name: L("Plug-in هايبرد", "Plug-in hybrid") },
  { id: "ev", name: L("كهربائي", "Electric") },
];

export const seatCounts: Option[] = [
  { id: "2", name: L("مقعدان", "2 seats") },
  { id: "4", name: L("4 مقاعد", "4 seats") },
  { id: "5", name: L("5 مقاعد", "5 seats") },
  { id: "6", name: L("6 مقاعد", "6 seats") },
  { id: "7", name: L("7 مقاعد", "7 seats") },
  { id: "8+", name: L("8 مقاعد فأكثر", "8+ seats") },
];

export const licenseStatuses: Option[] = [
  { id: "licensed", name: L("مرخّصة", "Licensed") },
  { id: "unlicensed", name: L("غير مرخّصة", "Unlicensed") },
];

export const insuranceStatuses: Option[] = [
  { id: "third-party", name: L("تأمين طرف ثالث", "Third-party insurance") },
  { id: "comprehensive", name: L("تأمين شامل", "Comprehensive") },
  { id: "none", name: L("غير مؤمّنة", "Uninsured") },
];

export const paymentMethods: Option[] = [
  { id: "cash", name: L("نقدًا", "Cash") },
  { id: "installments", name: L("بالأقساط", "Installments") },
  { id: "both", name: L("نقدًا أو أقساط", "Cash or installments") },
];

export const interiorFeatures: Option[] = [
  { id: "aux-usb", name: L("مدخل AUX / USB", "AUX / USB") },
  { id: "airbags", name: L("وسائد هوائية", "Airbags") },
  { id: "power-seats", name: L("مقاعد كهربائية", "Power seats") },
  { id: "wheel-controls", name: L("أزرار على المقود", "Steering controls") },
  { id: "memory-seats", name: L("ذاكرة المقاعد", "Seat memory") },
  { id: "power-windows", name: L("نوافذ كهربائية", "Power windows") },
  { id: "central-lock", name: L("قفل مركزي", "Central lock") },
  { id: "heated-seats", name: L("مقاعد مدفأة", "Heated seats") },
  { id: "leather", name: L("مقاعد جلد", "Leather seats") },
  { id: "cooled-seats", name: L("مقاعد مبرّدة", "Cooled seats") },
  { id: "massage-seats", name: L("مقاعد مساج", "Massage seats") },
  { id: "sport-seats", name: L("مقاعد رياضية", "Sport seats") },
  { id: "rear-power-seat", name: L("مقعد خلفي كهربائي", "Rear power seat") },
  { id: "heated-wheel", name: L("مقود مدفأ", "Heated steering") },
  { id: "ac", name: L("تكييف", "Air conditioning") },
  { id: "dual-zone-ac", name: L("تكييف ثنائي المنطقة", "Dual-zone climate") },
  { id: "tri-zone-ac", name: L("تكييف ثلاثي المناطق", "Tri-zone climate") },
  { id: "ambient-light", name: L("إضاءة داخلية محيطية", "Ambient lighting") },
  { id: "wireless-charge", name: L("شحن لاسلكي", "Wireless charging") },
  { id: "panoramic-glass", name: L("سقف زجاجي من الداخل", "Glass roof interior view") },
  { id: "digital-cluster", name: L("عدادات رقمية", "Digital cluster") },
  { id: "headrest-screens", name: L("شاشات خلف المقاعد", "Rear seat screens") },
  { id: "alarm", name: L("نظام إنذار", "Alarm") },
  { id: "fragrance", name: L("نظام عطور", "Cabin fragrance") },
];

export const exteriorFeatures: Option[] = [
  { id: "drl", name: L("إضاءة نهارية", "Daytime running lights") },
  { id: "spare", name: L("إطار احتياطي", "Spare tire") },
  { id: "rims", name: L("جنوط", "Alloy rims") },
  { id: "front-sensors", name: L("حساسات أمامية", "Front sensors") },
  { id: "rear-sensors", name: L("حساسات خلفية", "Rear sensors") },
  { id: "keyless", name: L("دخول بدون مفتاح", "Keyless entry") },
  { id: "sunroof", name: L("فتحة سقف", "Sunroof") },
  { id: "panoramic", name: L("سقف بانوراما", "Panoramic roof") },
  { id: "folding-mirrors", name: L("مرايا قابلة للطي", "Power folding mirrors") },
  { id: "power-mirrors", name: L("مرايا كهربائية", "Power mirrors") },
  { id: "led", name: L("إضاءة LED", "LED lights") },
  { id: "matrix-led", name: L("إضاءة Matrix LED", "Matrix LED") },
  { id: "xenon", name: L("إضاءة زينون", "Xenon lights") },
  { id: "sport-body", name: L("طقم جسم رياضي", "Sport body kit") },
  { id: "tow-hook", name: L("خطاف سحب", "Tow hook") },
  { id: "running-boards", name: L("دعسات جانبية", "Running boards") },
  { id: "roof-rails", name: L("قضبان سقف", "Roof rails") },
  { id: "privacy-glass", name: L("زجاج داكن", "Privacy glass") },
  { id: "soft-close", name: L("إغلاق أبواب ناعم", "Soft-close doors") },
  { id: "hands-free-tailgate", name: L("شنطة قدم / بدون لمس", "Hands-free tailgate") },
  { id: "trailer-assist", name: L("مساعد سحب المقطورة", "Trailer assist") },
];

export const techFeatures: Option[] = [
  { id: "carplay", name: L("Apple CarPlay", "Apple CarPlay") },
  { id: "android-auto", name: L("Android Auto", "Android Auto") },
  { id: "wireless-carplay", name: L("CarPlay لاسلكي", "Wireless CarPlay") },
  { id: "voice", name: L("أوامر صوتية", "Voice commands") },
  { id: "hud", name: L("شاشة أمامية HUD", "HUD projector") },
  { id: "bluetooth", name: L("بلوتوث", "Bluetooth") },
  { id: "remote-start", name: L("تشغيل عن بُعد", "Remote start") },
  { id: "collision", name: L("تحذير اصطدام أمامي", "Forward collision warning") },
  { id: "blind-spot", name: L("تحذير النقطة العمياء", "Blind spot warning") },
  { id: "lane", name: L("تحذير مغادرة المسار", "Lane departure warning") },
  { id: "lane-keep", name: L("مساعد البقاء في المسار", "Lane keep assist") },
  { id: "adaptive-cruise", name: L("مثبت سرعة تكيّفي", "Adaptive cruise") },
  { id: "tpms", name: L("حساس ضغط الإطارات", "Tire pressure sensor") },
  { id: "diff-lock", name: L("قفل دفرنس", "Diff-lock") },
  { id: "radar", name: L("رادار", "Radar") },
  { id: "touch", name: L("شاشة لمس", "Touch screen") },
  { id: "multimedia", name: L("شاشة وسائط", "Multimedia screen") },
  { id: "ota", name: L("تحديثات عن بُعد OTA", "OTA updates") },
  { id: "abs", name: L("فرامل ABS", "ABS brakes") },
  { id: "auto-lock", name: L("قفل أبواب تلقائي", "Automatic door lock") },
  { id: "cam-360", name: L("كاميرا 360", "360 camera") },
  { id: "cam-rear", name: L("كاميرا خلفية", "Rear camera") },
  { id: "traction", name: L("نظام ثبات", "Traction control") },
  { id: "cruise", name: L("مثبت سرعة", "Cruise control") },
  { id: "park-assist", name: L("مساعد ركن", "Parking assist") },
  { id: "auto-park", name: L("ركن ذاتي", "Auto park") },
  { id: "sport-suspension", name: L("تعليق رياضي", "Sport suspension") },
  { id: "air-suspension", name: L("تعليق هوائي", "Air suspension") },
  { id: "nav", name: L("ملاحة / خرائط", "Navigation / maps") },
  { id: "connected", name: L("اتصال بالإنترنت / تطبيق", "Connected app") },
];

export const aiStyles = [
  { id: "casual", name: L("مرح وودّي", "Cheerful & warm"), emoji: "✦" },
  { id: "professional", name: L("هادئ مهني", "Calm professional"), emoji: "◆" },
  { id: "simple", name: L("مختصر مباشر", "Short & direct"), emoji: "●" },
] as const;

export type AiStyleId = (typeof aiStyles)[number]["id"];
