"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { adminNavGrouped, adminSectionFromPath } from "@/lib/admin/nav";
import { usePrefs } from "@/lib/prefs";

export function AdminNav({
  name,
  email,
  roleLabel,
}: {
  name: string;
  email: string;
  roleLabel: string;
}) {
  const { locale } = usePrefs();
  const ar = locale === "ar";
  const pathname = usePathname() || "/admin";
  const search = useSearchParams();
  const current = adminSectionFromPath(pathname)?.id || "overview";
  const groups = adminNavGrouped();
  const au = search.get("au");

  function hrefWithAu(href: string) {
    if (!au) return href;
    const url = new URL(href, "https://bhd-cars.local");
    url.searchParams.set("au", au);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  return (
    <aside className="site-admin-nav" aria-label={ar ? "تحكم الموقع والنظام" : "Site & system control"}>
      <div className="site-admin-nav__brand">
        <div className="site-admin-nav__mark" aria-hidden="true" />
        <div className="site-admin-nav__brand-copy">
          <p className="site-admin-nav__product">BHD Cars</p>
          <p className="site-admin-nav__title">{ar ? "تحكم الموقع" : "Site control"}</p>
        </div>
        <span className="site-admin-nav__role">{roleLabel}</span>
      </div>

      <nav className="site-admin-nav__list">
        {groups.map(({ group, label, items }) => (
          <div key={group} className="site-admin-nav__group">
            {group !== "home" ? (
              <p className="site-admin-nav__group-label">{ar ? label.ar : label.en}</p>
            ) : null}
            {items.map((section) => {
              const active = section.id === current;
              return (
                <Link
                  key={section.id}
                  href={hrefWithAu(section.href)}
                  className={active ? "is-current" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  {ar ? section.ar : section.en}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="site-admin-nav__account">
        <p className="site-admin-nav__account-name">{name}</p>
        <p className="site-admin-nav__account-email">{email}</p>
        <div className="site-admin-nav__links">
          <Link href={hrefWithAu("/")}>{ar ? "السوق" : "Market"}</Link>
          <Link href="/api/auth/bhd/logout">{ar ? "خروج" : "Sign out"}</Link>
        </div>
      </div>
    </aside>
  );
}
