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
  const eyebrow = pathname.startsWith("/workspace")
    ? ar
      ? "مساحة المعرض · BHD Cars"
      : "Dealer workspace · BHD Cars"
    : pathname.startsWith("/account")
      ? ar
        ? "حساب المستخدم · BHD Cars"
        : "User account · BHD Cars"
      : ar
        ? "تحكم الموقع والنظام"
        : "Site & system control";

  return (
    <header className="admin-page-head">
      <div>
        <p className="admin-eyebrow">{eyebrow}</p>
        <h1>{title || (ar ? section?.ar : section?.en) || (ar ? "لوحة التحكم" : "Admin")}</h1>
        <p>{lead || (ar ? section?.hintAr : section?.hintEn)}</p>
      </div>
      {actions ? <div className="admin-actions">{actions}</div> : null}
    </header>
  );
}
