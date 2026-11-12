"use client";

import { adminSectionFromPath } from "@/lib/admin/nav";
import { usePrefs } from "@/lib/prefs";
import { usePathname } from "next/navigation";

export function AdminPageHeader({
  title,
  lead,
  actions,
}: {
  title?: string;
  lead?: string;
  actions?: React.ReactNode;
}) {
  const { locale } = usePrefs();
  const pathname = usePathname() || "/admin";
  const section = adminSectionFromPath(pathname);
  const ar = locale === "ar";

  return (
    <header className="admin-page-head">
      <div>
        <p className="admin-eyebrow">{ar ? "تحكم الموقع والنظام" : "Site & system control"}</p>
        <h1>{title || (ar ? section?.ar : section?.en) || (ar ? "لوحة التحكم" : "Admin")}</h1>
        <p>{lead || (ar ? section?.hintAr : section?.hintEn)}</p>
      </div>
      {actions ? <div className="admin-actions">{actions}</div> : null}
    </header>
  );
}
