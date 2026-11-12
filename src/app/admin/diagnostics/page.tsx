import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  adminEmailAllowlist,
  adminSubAllowlist,
  isAdminDevOpen,
  isAuthConfigured,
  resolveAdminAccessOrDev,
} from "@/lib/admin/access";
import { billingPulse, loadSiteBundle } from "@/lib/admin/store";
import { databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDiagnosticsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const access = await resolveAdminAccessOrDev();
  const site = await loadSiteBundle();
  const pulse = databaseConfigured()
    ? await billingPulse()
    : { plans: 0, activeSubs: 0, mrr: 0, enabledGateways: 0, openBalance: 0 };

  const rows = [
    ["AUTH_SECRET", isAuthConfigured() ? "ready" : "missing"],
    ["DATABASE_URL", databaseConfigured() ? "ready" : "missing"],
    ["SITE_ADMIN_EMAILS", String(adminEmailAllowlist().length)],
    ["SITE_ADMIN_SUBS", String(adminSubAllowlist().length)],
    ["SITE_ADMIN_DEV_OPEN", isAdminDevOpen() ? "on" : "off"],
    ["access", access.kind],
    ["maintenance", site.maintenance.enabled ? "on" : "off"],
    ["notice", site.notice.enabled ? "on" : "off"],
    ["default_market", site.defaultMarket.id],
    ["active_subs", String(pulse.activeSubs)],
    ["mrr", `${pulse.mrr} OMR`],
  ];

  return (
    <div>
      <AdminPageHeader
        actions={<Link href="/admin/settings">{ar ? "إعدادات الموقع" : "Site settings"}</Link>}
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "صحة النظام" : "System health"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "العنصر" : "Item"}</th>
              <th>{ar ? "القيمة" : "Value"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([key, value]) => (
              <tr key={key}>
                <td style={{ direction: "ltr" }}>
                  <strong>{key}</strong>
                </td>
                <td style={{ direction: "ltr" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
