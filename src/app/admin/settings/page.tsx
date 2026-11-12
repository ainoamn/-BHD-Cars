import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const dynamic = "force-dynamic";

const SITE_CONTROLS = [
  {
    id: "maintenance",
    ar: "وضع الصيانة",
    en: "Maintenance mode",
    hintAr: "إيقاف الزيارة العامة مع رسالة عربية/إنجليزية.",
    hintEn: "Take the public site offline with AR/EN visitor copy.",
    valueAr: "متوقف",
    valueEn: "Off",
  },
  {
    id: "notice",
    ar: "تنبيه عام",
    en: "Public notice",
    hintAr: "شريط أعلى السوق لحملات أو أعطال مؤقتة.",
    hintEn: "Top-of-market banner for campaigns or brief outages.",
    valueAr: "بدون تنبيه",
    valueEn: "None",
  },
  {
    id: "pages",
    ar: "الصفحات العامة",
    en: "Public pages",
    hintAr: "تفعيل/إيقاف صفحات مثل التأجير واللوحات والسكراب.",
    hintEn: "Toggle public surfaces such as rental, plates, and scrap.",
    valueAr: "كل الصفحات ظاهرة (كود)",
    valueEn: "All pages visible (code)",
  },
  {
    id: "markets",
    ar: "السوق الافتراضي",
    en: "Default market",
    hintAr: "دولة الزائر عند أول زيارة والعملة الظاهرة.",
    hintEn: "Visitor’s first-visit country and display currency.",
    valueAr: "عُمان · OMR",
    valueEn: "Oman · OMR",
  },
];

const NOT_HERE = [
  { href: "/admin/delegates", ar: "الصلاحيات والتفويض", en: "Permissions" },
  { href: "/admin/users", ar: "الأعضاء والحسابات", en: "Members & accounts" },
  { href: "/admin/plans", ar: "الاشتراكات", en: "Subscriptions" },
  { href: "/admin/payments", ar: "المدفوعات", en: "Payments" },
  { href: "/admin/billing", ar: "الإحصائيات", en: "Billing stats" },
  { href: "/admin/accounting", ar: "حسابات العملاء", en: "Client accounts" },
];

export default async function AdminSettingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  return (
    <div>
      <AdminPageHeader
        lead={
          ar
            ? "هذه الصفحة لإدارة الموقع الظاهر للزوار فقط — ليست لوحة صلاحيات أو اشتراكات."
            : "This page manages the public site only — not permissions or subscriptions."
        }
      />

      <div className="admin-banner admin-banner--info">
        {ar
          ? "الصلاحيات، الأعضاء، الاشتراكات، المدفوعات، والإحصائيات لها أقسام مستقلة تحت «المنصة» في الشريط الجانبي."
          : "Permissions, members, subscriptions, payments, and stats live under Platform in the sidebar."}
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "ضوابط الموقع" : "Site controls"}</h2>
          <span className="admin-badge admin-badge--warn">{ar ? "حفظ لاحقًا" : "Save later"}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الضابط" : "Control"}</th>
                <th>{ar ? "الحالة الحالية" : "Current"}</th>
                <th>{ar ? "الوصف" : "Description"}</th>
              </tr>
            </thead>
            <tbody>
              {SITE_CONTROLS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{ar ? row.ar : row.en}</strong>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--muted">{ar ? row.valueAr : row.valueEn}</span>
                  </td>
                  <td style={{ color: "#5f736c" }}>{ar ? row.hintAr : row.hintEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "ليست هنا — انتقل إلى" : "Not here — go to"}</h2>
        </div>
        <div className="admin-actions" style={{ padding: "1rem" }}>
          {NOT_HERE.map((item) => (
            <Link key={item.href} href={item.href}>
              {ar ? item.ar : item.en}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
