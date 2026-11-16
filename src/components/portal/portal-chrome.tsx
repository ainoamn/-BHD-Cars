"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrefs } from "@/lib/prefs";
import { hasScope } from "@/lib/portal/scopes";
import type { PortalNavItem } from "@/lib/portal/nav";

export function PortalChrome({
  kind,
  titleAr,
  titleEn,
  subtitle,
  nav,
  scopes,
  roleLabel,
  children,
}: {
  kind: "account" | "workspace";
  titleAr: string;
  titleEn: string;
  subtitle: string;
  nav: PortalNavItem[];
  scopes: string[];
  roleLabel: string;
  children: React.ReactNode;
}) {
  const { locale } = usePrefs();
  const ar = locale === "ar";
  const pathname = usePathname() || "/";
  const items = nav.filter((item) => {
    if (!item.scope) return true;
    if (scopes.includes("all")) return true;
    return hasScope(scopes, item.scope);
  });

  return (
    <div className="site-admin-shell portal-shell">
      <div className="site-admin-frame">
        <aside className="site-admin-nav" aria-label={ar ? titleAr : titleEn}>
          <div className="site-admin-nav__brand">
            <div className="site-admin-nav__mark" aria-hidden="true" />
            <div className="site-admin-nav__brand-copy">
              <p className="site-admin-nav__product">
                {kind === "workspace" ? "Bin Hamood · House" : "Bin Hamood · Account"}
              </p>
              <p className="site-admin-nav__title">{ar ? titleAr : titleEn}</p>
            </div>
            <span className="site-admin-nav__role">{roleLabel}</span>
          </div>
          <nav className="site-admin-nav__list">
            <div className="site-admin-nav__group">
              {items.map((item) => {
                const active =
                  item.href === pathname ||
                  (item.href !== "/account" &&
                    item.href !== "/workspace" &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={active ? "is-current" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {ar ? item.ar : item.en}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="site-admin-nav__account">
            <p className="site-admin-nav__account-name">{subtitle}</p>
            <div className="site-admin-nav__links">
              <Link href="/portal">{ar ? "تبديل المساحة" : "Switch space"}</Link>
              <Link href="/">{ar ? "السوق" : "Market"}</Link>
              <Link href="/api/auth/bhd/logout">{ar ? "خروج" : "Sign out"}</Link>
            </div>
          </div>
        </aside>
        <div className="site-admin-main">{children}</div>
      </div>
    </div>
  );
}
