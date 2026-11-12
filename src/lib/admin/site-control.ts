export type MaintenanceSettings = {
  enabled: boolean;
  messageAr: string;
  messageEn: string;
};

export type NoticeSettings = {
  enabled: boolean;
  messageAr: string;
  messageEn: string;
};

export type PageFlags = Record<string, boolean>;

export type DefaultMarketSettings = {
  id: string;
};

export type SiteBundle = {
  maintenance: MaintenanceSettings;
  notice: NoticeSettings;
  pages: PageFlags;
  defaultMarket: DefaultMarketSettings;
};

export const DEFAULT_PAGE_FLAGS: PageFlags = {
  cars: true,
  auctions: true,
  finance: true,
  insurance: true,
  inspection: true,
  import: true,
  rental: true,
  valuation: true,
  parts: true,
  scrap: true,
  plates: true,
  reports: true,
  service: true,
  dealers: true,
  sell: true,
};

export const DEFAULT_SITE_BUNDLE: SiteBundle = {
  maintenance: {
    enabled: false,
    messageAr: "الموقع تحت الصيانة",
    messageEn: "Site under maintenance",
  },
  notice: { enabled: false, messageAr: "", messageEn: "" },
  pages: { ...DEFAULT_PAGE_FLAGS },
  defaultMarket: { id: "om" },
};

export const ADMIN_SCOPE_OPTIONS = [
  { id: "all", ar: "كل الصلاحيات", en: "All scopes" },
  { id: "marketplace", ar: "السوق", en: "Marketplace" },
  { id: "operations", ar: "التشغيل", en: "Operations" },
  { id: "partners", ar: "الشركاء", en: "Partners" },
  { id: "plans", ar: "الاشتراكات", en: "Subscriptions" },
  { id: "users", ar: "الأعضاء", en: "Members" },
  { id: "payments", ar: "المدفوعات", en: "Payments" },
  { id: "accounting", ar: "الحسابات", en: "Accounting" },
  { id: "delegates", ar: "التفويض", en: "Delegates" },
  { id: "settings", ar: "إعدادات الموقع", en: "Site settings" },
] as const;
