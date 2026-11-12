export type AdminNavGroup =
  | "home"
  | "marketplace"
  | "operations"
  | "partners"
  | "platform"
  | "system";

export const ADMIN_NAV_GROUPS: Record<AdminNavGroup, { ar: string; en: string; order: number }> = {
  home: { ar: "الرئيسية", en: "Home", order: 0 },
  marketplace: { ar: "السوق", en: "Marketplace", order: 1 },
  operations: { ar: "التشغيل", en: "Operations", order: 2 },
  partners: { ar: "الشركاء", en: "Partners", order: 3 },
  platform: { ar: "المنصة", en: "Platform", order: 4 },
  system: { ar: "الموقع", en: "Site", order: 5 },
};

export type AdminSection = {
  id: string;
  href: string;
  group: AdminNavGroup;
  ar: string;
  en: string;
  hintAr: string;
  hintEn: string;
};

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: "overview",
    href: "/admin",
    group: "home",
    ar: "نظرة عامة",
    en: "Overview",
    hintAr: "مؤشرات السوق والطلبات والمزادات",
    hintEn: "Market, requests, and auction pulse",
  },
  {
    id: "listings",
    href: "/admin/listings",
    group: "marketplace",
    ar: "الإعلانات",
    en: "Listings",
    hintAr: "مراجعة ونشر وسحب الإعلانات",
    hintEn: "Review, publish, and withdraw listings",
  },
  {
    id: "moderation",
    href: "/admin/moderation",
    group: "marketplace",
    ar: "مراجعة المحتوى",
    en: "Moderation",
    hintAr: "بلاغات وإفصاح أضرار ومكررات",
    hintEn: "Reports, damage disclosure, duplicates",
  },
  {
    id: "auctions",
    href: "/admin/auctions",
    group: "marketplace",
    ar: "المزادات",
    en: "Auctions",
    hintAr: "جلسات ولوتات وترسية",
    hintEn: "Sessions, lots, and awards",
  },
  {
    id: "requests",
    href: "/admin/requests",
    group: "operations",
    ar: "الطلبات",
    en: "Requests",
    hintAr: "تثمين وفحص وتمويل وتأمين واستيراد",
    hintEn: "Valuation, inspection, finance, insurance, import",
  },
  {
    id: "dispatch",
    href: "/admin/dispatch",
    group: "operations",
    ar: "التوزيع",
    en: "Dispatch",
    hintAr: "إسناد الشركاء والطوابير",
    hintEn: "Partner assignment queues",
  },
  {
    id: "support",
    href: "/admin/support",
    group: "operations",
    ar: "الدعم والشكاوى",
    en: "Support",
    hintAr: "تذاكر ونزاعات وإساءة استخدام",
    hintEn: "Tickets, disputes, and abuse",
  },
  {
    id: "dealers",
    href: "/admin/dealers",
    group: "partners",
    ar: "المعارض",
    en: "Dealers",
    hintAr: "ملفات المعارض والاعتماد",
    hintEn: "Dealer profiles and accreditation",
  },
  {
    id: "partners",
    href: "/admin/partners",
    group: "partners",
    ar: "مؤسسات الخدمات",
    en: "Service orgs",
    hintAr: "تأمين وتمويل وتثمين وفحص",
    hintEn: "Insurance, finance, valuation, inspection",
  },
  {
    id: "users",
    href: "/admin/users",
    group: "platform",
    ar: "الأعضاء والحسابات",
    en: "Members & accounts",
    hintAr: "حسابات المنصة، الإيقاف، والتفعيل",
    hintEn: "Platform accounts, suspend, and restore",
  },
  {
    id: "plans",
    href: "/admin/plans",
    group: "platform",
    ar: "الاشتراكات والباقات",
    en: "Subscriptions",
    hintAr: "باقات المعارض والحدود والأسعار",
    hintEn: "Dealer plans, limits, and pricing",
  },
  {
    id: "billing",
    href: "/admin/billing",
    group: "platform",
    ar: "إحصائيات الاشتراك",
    en: "Billing stats",
    hintAr: "إيراد تقديري ومعدلات التجديد",
    hintEn: "Estimated revenue and renewal rates",
  },
  {
    id: "accounting",
    href: "/admin/accounting",
    group: "platform",
    ar: "حسابات العملاء",
    en: "Client accounts",
    hintAr: "أرصدة المعارض والشركاء والفواتير",
    hintEn: "Dealer and partner balances and invoices",
  },
  {
    id: "payments",
    href: "/admin/payments",
    group: "platform",
    ar: "المدفوعات والبوابات",
    en: "Payments",
    hintAr: "بوابات الدفع والمفاتيح وطرق التحصيل",
    hintEn: "Payment gateways, keys, and methods",
  },
  {
    id: "delegates",
    href: "/admin/delegates",
    group: "platform",
    ar: "الصلاحيات والتفويض",
    en: "Permissions",
    hintAr: "تفويض مديري الموقع وصلاحيات الأقسام",
    hintEn: "Delegate site admins and section scopes",
  },
  {
    id: "catalog",
    href: "/admin/catalog",
    group: "system",
    ar: "الكتالوج",
    en: "Catalog",
    hintAr: "شركات وموديلات وشعارات",
    hintEn: "Makes, models, and logos",
  },
  {
    id: "markets",
    href: "/admin/markets",
    group: "system",
    ar: "الأسواق والعملات",
    en: "Markets",
    hintAr: "دول وخدمات وأعلام التفعيل",
    hintEn: "Countries, services, and flags",
  },
  {
    id: "settings",
    href: "/admin/settings",
    group: "system",
    ar: "إعدادات الموقع",
    en: "Site settings",
    hintAr: "صيانة، تنبيهات، وصفحات عامة فقط",
    hintEn: "Maintenance, notices, and public pages only",
  },
  {
    id: "diagnostics",
    href: "/admin/diagnostics",
    group: "system",
    ar: "تشخيص النظام",
    en: "Diagnostics",
    hintAr: "هوية، بيئة، وصحة البناء",
    hintEn: "Identity, env, and build health",
  },
];

export function adminNavGrouped() {
  return (Object.keys(ADMIN_NAV_GROUPS) as AdminNavGroup[])
    .sort((a, b) => ADMIN_NAV_GROUPS[a].order - ADMIN_NAV_GROUPS[b].order)
    .map((group) => ({
      group,
      label: ADMIN_NAV_GROUPS[group],
      items: ADMIN_SECTIONS.filter((section) => section.group === group),
    }))
    .filter((entry) => entry.items.length > 0);
}

export function adminSectionFromPath(pathname: string) {
  const clean = pathname.split("?")[0].replace(/\/$/, "") || "/admin";
  if (clean === "/admin") return ADMIN_SECTIONS[0];
  if (clean === "/admin/staff" || clean.startsWith("/admin/staff/")) {
    return ADMIN_SECTIONS.find((section) => section.id === "delegates") || null;
  }
  return (
    ADMIN_SECTIONS.find((section) => section.href !== "/admin" && clean.startsWith(section.href)) ||
    ADMIN_SECTIONS.find((section) => section.href === clean) ||
    null
  );
}
