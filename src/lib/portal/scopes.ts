export const PORTAL_SCOPES = [
  "all",
  "listings.read",
  "listings.write",
  "auctions.read",
  "auctions.write",
  "requests.read",
  "requests.write",
  "team.read",
  "team.write",
  "settings.read",
  "settings.write",
  "analytics.read",
] as const;

export type PortalScope = (typeof PORTAL_SCOPES)[number];

export const PORTAL_SCOPE_LABELS: Record<
  PortalScope,
  { ar: string; en: string }
> = {
  all: { ar: "كل الصلاحيات", en: "All permissions" },
  "listings.read": { ar: "عرض المركبات", en: "View vehicles" },
  "listings.write": { ar: "إدارة المركبات", en: "Manage vehicles" },
  "auctions.read": { ar: "عرض المزادات", en: "View auctions" },
  "auctions.write": { ar: "إدارة المزادات", en: "Manage auctions" },
  "requests.read": { ar: "عرض الطلبات", en: "View requests" },
  "requests.write": { ar: "إدارة الطلبات", en: "Manage requests" },
  "team.read": { ar: "عرض الفريق", en: "View team" },
  "team.write": { ar: "إدارة الفريق", en: "Manage team" },
  "settings.read": { ar: "عرض الإعدادات", en: "View settings" },
  "settings.write": { ar: "تعديل الإعدادات", en: "Edit settings" },
  "analytics.read": { ar: "الإحصائيات", en: "Analytics" },
};

export const OWNER_SCOPES: PortalScope[] = ["all"];

export const DEFAULT_STAFF_SCOPES: PortalScope[] = [
  "listings.read",
  "listings.write",
  "requests.read",
  "requests.write",
];

export function hasScope(scopes: string[] | null | undefined, needed: PortalScope | PortalScope[]) {
  const list = (scopes || []).map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (list.includes("all")) return true;
  const required = Array.isArray(needed) ? needed : [needed];
  return required.every((scope) => list.includes(scope));
}

export function canManageTeam(role: string, scopes: string[]) {
  return role === "owner" || role === "admin" || hasScope(scopes, "team.write");
}
