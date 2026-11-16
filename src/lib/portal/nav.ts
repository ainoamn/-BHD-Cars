import type { PortalScope } from "@/lib/portal/scopes";

export type PortalNavItem = {
  id: string;
  href: string;
  ar: string;
  en: string;
  scope?: PortalScope;
};

export const ACCOUNT_NAV: PortalNavItem[] = [
  { id: "overview", href: "/account", ar: "نظرة عامة", en: "Overview" },
  { id: "listings", href: "/account/listings", ar: "مركباتي", en: "My vehicles" },
  { id: "auctions", href: "/account/auctions", ar: "مزاداتي", en: "My auctions" },
  { id: "requests", href: "/account/requests", ar: "طلباتي", en: "My requests" },
  { id: "orgs", href: "/account/orgs", ar: "معارضي وشركاتي", en: "My orgs" },
];

export const WORKSPACE_NAV: PortalNavItem[] = [
  { id: "overview", href: "/workspace", ar: "نظرة عامة", en: "Overview" },
  {
    id: "listings",
    href: "/workspace/listings",
    ar: "المركبات",
    en: "Vehicles",
    scope: "listings.read",
  },
  {
    id: "requests",
    href: "/workspace/requests",
    ar: "الطلبات",
    en: "Requests",
    scope: "requests.read",
  },
  {
    id: "team",
    href: "/workspace/team",
    ar: "الفريق والصلاحيات",
    en: "Team & permissions",
    scope: "team.read",
  },
  {
    id: "settings",
    href: "/workspace/settings",
    ar: "إعدادات المعرض",
    en: "Org settings",
    scope: "settings.read",
  },
];
