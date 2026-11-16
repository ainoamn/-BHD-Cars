import { listingSections } from "@/lib/listing-sections";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export type MenuLink = {
  href: string;
  label: Copy;
  blurb?: Copy;
  image?: string;
  badge?: Copy;
};

/** Primary header links — market first, then core services. */
export const primaryNav: MenuLink[] = [
  { href: "/cars", label: L("السيارات", "Cars") },
  { href: "/auctions", label: L("المزادات", "Auctions") },
  { href: "/rental", label: L("التأجير", "Hire") },
  { href: "/parts", label: L("قطع وتجهيزات", "Parts & fitments") },
  { href: "/finance", label: L("التمويل", "Finance") },
  { href: "/insurance", label: L("التأمين", "Insurance") },
  { href: "/inspection", label: L("الفحص", "Inspection") },
];

/** Secondary header / mobile extras. */
export const moreNav: MenuLink[] = [
  { href: "/scrap", label: L("مركبات للتفكيك", "Dismantling") },
  { href: "/plates", label: L("أرقام مميزة", "Distinctive plates") },
  { href: "/import", label: L("الاستيراد", "Import") },
  { href: "/valuation", label: L("التثمين", "Valuation") },
  { href: "/reports", label: L("سجل السيارة", "History") },
  { href: "/service", label: L("الصيانة", "Service") },
  { href: "/dealers", label: L("المعارض", "Houses") },
  { href: "/sell", label: L("أضف عرضًا", "Add an offer") },
  { href: "/requests", label: L("طلباتي", "Requests") },
];

export const footerMarket: MenuLink[] = [
  { href: "/cars", label: L("السيارات", "Cars") },
  { href: "/auctions", label: L("المزادات", "Auctions") },
  { href: "/rental", label: L("تأجير مركبات", "Vehicle hire") },
  { href: "/parts", label: L("قطع وتجهيزات", "Parts & fitments") },
  { href: "/scrap", label: L("مركبات للتفكيك", "Dismantling") },
  { href: "/plates", label: L("أرقام مميزة", "Distinctive plates") },
  { href: "/dealers", label: L("المعارض", "Houses") },
];

export const footerServices: MenuLink[] = [
  { href: "/valuation", label: L("التثمين", "Valuation") },
  { href: "/finance", label: L("التمويل", "Finance") },
  { href: "/insurance", label: L("التأمين", "Insurance") },
  { href: "/inspection", label: L("الفحص", "Inspection") },
  { href: "/import", label: L("الاستيراد", "Import") },
  { href: "/service", label: L("الصيانة", "Service") },
  { href: "/sell", label: L("مسارات العرض", "Offer paths") },
];

export const footerCompany: MenuLink[] = [
  { href: "/about", label: L("عن المنصة", "About") },
  { href: "/contact", label: L("تواصل", "Contact") },
  { href: "/requests", label: L("متابعة الطلب", "Track a request") },
  { href: "/reports", label: L("سجل السيارة", "History") },
];

/**
 * Homepage “what do you need” cards — browse boards where they exist,
 * otherwise the matching offer path from listing-sections.
 */
export const homeCategories: MenuLink[] = [
  {
    href: "/cars",
    label: L("سيارات للبيع", "Cars for sale"),
    blurb: L("سوق يومي جاهز ومعارض وأفراد", "Daily market from houses and private sellers"),
    badge: L("تصفّح", "Browse"),
  },
  {
    href: "/auctions",
    label: L("مزادات مباشرة", "Live auctions"),
    blurb: L("خطوة معلنة وعمولة واضحة", "Stated step and clear premium"),
    badge: L("مباشر", "Live"),
  },
  {
    href: "/rental",
    label: L("تأجير مركبات", "Vehicle hire"),
    blurb: L("يومي وشهري بحد مسافة واضح", "Daily and monthly with a clear distance limit"),
    badge: L("حجز", "Book"),
  },
  {
    href: "/scrap",
    label: L("مركبات للتفكيك", "Vehicles for dismantling"),
    blurb: L("هيكل أو أجزاء بملكية موثّقة", "Shell or parts with documented ownership"),
    badge: L("ساحات", "Yards"),
  },
  {
    href: "/parts",
    label: L("قطع غيار", "Spare parts"),
    blurb: L("حسب نظام القطعة والتوافق", "By part system and fitment"),
    badge: L("قطع", "Parts"),
  },
  {
    href: "/plates",
    label: L("أرقام مميزة", "Distinctive plates"),
    blurb: L("نقل رقم بشروط واضحة", "Number transfer with clear terms"),
    badge: L("لوحات", "Plates"),
  },
  {
    href: "/sell/motorcycle",
    label: L("دراجات نارية", "Motorcycles"),
    blurb: L("دراجة أو سكوتر أو ملحقات حماية", "Bike, scooter, or protective gear"),
    badge: L("أضف عرضًا", "List"),
  },
  {
    href: "/sell/heavy",
    label: L("معدات ثقيلة", "Heavy equipment"),
    blurb: L("حفارات ورافعات بساعات التشغيل", "Excavators and cranes with hours"),
    badge: L("أضف عرضًا", "List"),
  },
  {
    href: "/sell/trucks",
    label: L("شاحنات وحافلات", "Trucks & buses"),
    blurb: L("حمولة ومحاور لأسطول العمل", "Payload and axles for fleets"),
    badge: L("أضف عرضًا", "List"),
  },
  {
    href: "/sell/boats",
    label: L("قوارب وبحرية", "Boats & watercraft"),
    blurb: L("قارب أو جت سكي بساعات المحرك", "Boat or jet ski with engine hours"),
    badge: L("أضف عرضًا", "List"),
  },
  {
    href: "/sell/tires",
    label: L("إطارات وعجلات", "Tires & wheels"),
    blurb: L("مقاس وكمية وتوافق المركبة", "Size, quantity, and fitment"),
    badge: L("أضف عرضًا", "List"),
  },
  {
    href: "/sell/consumables",
    label: L("زيوت ومواد تشغيل", "Oils & fluids"),
    blurb: L("زيوت وفلاتر وسوائل خدمة", "Oils, filters, and service fluids"),
    badge: L("أضف عرضًا", "List"),
  },
];

/** Prefetch targets after first paint. */
export const criticalRoutes = [
  "/",
  "/cars",
  "/auctions",
  "/sell",
  "/rental",
  "/parts",
  "/scrap",
  "/plates",
  "/portal",
  "/account",
  "/finance",
  "/insurance",
  "/valuation",
  ...listingSections.map((section) => `/sell/${section.id}`),
];
