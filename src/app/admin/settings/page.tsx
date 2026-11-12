import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsClientForm } from "@/components/admin/settings-client-form";
import { DEFAULT_PAGE_FLAGS } from "@/lib/admin/site-control";
import { loadSiteBundle } from "@/lib/admin/store";
import { databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const db = databaseConfigured();
  const site = await loadSiteBundle();
  const pageKeys = Object.keys(DEFAULT_PAGE_FLAGS);

  return (
    <div>
      <AdminPageHeader
        lead={
          ar
            ? "ضوابط الموقع الظاهر للزوار فقط. الصلاحيات والاشتراكات والمدفوعات في أقسام المنصة."
            : "Public-site controls only. Permissions, subscriptions, and payments live under Platform."
        }
      />

      <div className={`admin-banner ${db ? "admin-banner--info" : ""}`}>
        {db
          ? ar
            ? "التغييرات هنا تطبَّق فورًا على الموقع العام (صيانة، تنبيه، صفحات)."
            : "Changes here apply immediately to the public site (maintenance, notice, pages)."
          : ar
            ? "DATABASE_URL غير مضبوط — لن يُحفظ شيء."
            : "DATABASE_URL is missing — nothing will persist."}
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "وضع الصيانة" : "Maintenance"}</h2>
          <span className={`admin-badge admin-badge--${site.maintenance.enabled ? "warn" : "ready"}`}>
            {site.maintenance.enabled ? (ar ? "مفعّل" : "on") : ar ? "متوقف" : "off"}
          </span>
        </div>
        <div style={{ padding: "1rem" }}>
          <SettingsClientForm
            section="maintenance"
            submitLabel={ar ? "حفظ الصيانة" : "Save maintenance"}
            initial={site.maintenance}
            fields={[
              { key: "enabled", label: ar ? "تفعيل" : "Enabled", kind: "checkbox" },
              { key: "messageAr", label: ar ? "رسالة عربية" : "Arabic message", kind: "text" },
              { key: "messageEn", label: ar ? "رسالة إنجليزية" : "English message", kind: "text" },
            ]}
          />
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "تنبيه عام" : "Public notice"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <SettingsClientForm
            section="notice"
            submitLabel={ar ? "حفظ التنبيه" : "Save notice"}
            initial={site.notice}
            fields={[
              { key: "enabled", label: ar ? "إظهار" : "Show", kind: "checkbox" },
              { key: "messageAr", label: ar ? "نص عربي" : "Arabic text", kind: "text" },
              { key: "messageEn", label: ar ? "نص إنجليزي" : "English text", kind: "text" },
            ]}
          />
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "الصفحات العامة" : "Public pages"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <SettingsClientForm
            section="pages"
            submitLabel={ar ? "حفظ الصفحات" : "Save pages"}
            initial={pageKeys.reduce<Record<string, boolean>>((acc, key) => {
              acc[key] = site.pages[key] !== false;
              return acc;
            }, {})}
            fields={pageKeys.map((key) => ({ key, label: key, kind: "checkbox" as const }))}
          />
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "السوق الافتراضي" : "Default market"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <SettingsClientForm
            section="default_market"
            submitLabel={ar ? "حفظ السوق" : "Save market"}
            initial={site.defaultMarket}
            fields={[
              {
                key: "id",
                label: ar ? "السوق" : "Market",
                kind: "select",
                options: [
                  { value: "om", label: "Oman" },
                  { value: "ae", label: "UAE" },
                  { value: "sa", label: "Saudi" },
                  { value: "qa", label: "Qatar" },
                  { value: "bh", label: "Bahrain" },
                  { value: "kw", label: "Kuwait" },
                  { value: "world", label: "Worldwide" },
                ],
              },
            ]}
          />
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "أقسام المنصة" : "Platform desks"}</h2>
        </div>
        <div className="admin-actions" style={{ padding: "1rem" }}>
          <Link href="/admin/delegates">{ar ? "الصلاحيات" : "Permissions"}</Link>
          <Link href="/admin/users">{ar ? "الأعضاء" : "Members"}</Link>
          <Link href="/admin/plans">{ar ? "الاشتراكات" : "Subscriptions"}</Link>
          <Link href="/admin/billing">{ar ? "الإحصائيات" : "Stats"}</Link>
          <Link href="/admin/accounting">{ar ? "الحسابات" : "Accounts"}</Link>
          <Link href="/admin/payments">{ar ? "المدفوعات" : "Payments"}</Link>
        </div>
      </div>
    </div>
  );
}
