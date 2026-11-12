import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  adminEmailAllowlist,
  adminSubAllowlist,
  isAdminDevOpen,
  isAuthConfigured,
  resolveAdminAccessOrDev,
} from "@/lib/admin/access";

export const dynamic = "force-dynamic";

function flag(ok: boolean, ar: boolean) {
  return ok ? (ar ? "جاهز" : "ready") : ar ? "ناقص" : "missing";
}

export default async function AdminDiagnosticsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const access = await resolveAdminAccessOrDev();
  const emails = adminEmailAllowlist();
  const subs = adminSubAllowlist();

  const rows = [
    {
      key: "auth",
      label: ar ? "AUTH_SECRET" : "AUTH_SECRET",
      value: flag(isAuthConfigured(), ar),
      ok: isAuthConfigured(),
    },
    {
      key: "oauth",
      label: ar ? "عميل BHD OAuth" : "BHD OAuth client",
      value: flag(Boolean(process.env.BHD_OAUTH_CLIENT_ID?.trim()), ar),
      ok: Boolean(process.env.BHD_OAUTH_CLIENT_ID?.trim()),
    },
    {
      key: "emails",
      label: "SITE_ADMIN_EMAILS",
      value: emails.length ? `${emails.length}` : ar ? "فارغ" : "empty",
      ok: emails.length > 0,
    },
    {
      key: "subs",
      label: "SITE_ADMIN_SUBS",
      value: subs.length ? `${subs.length}` : ar ? "فارغ" : "empty",
      ok: subs.length > 0,
    },
    {
      key: "dev",
      label: "SITE_ADMIN_DEV_OPEN",
      value: isAdminDevOpen() ? (ar ? "مفعّل (تطوير)" : "on (dev)") : ar ? "مغلق" : "off",
      ok: !isAdminDevOpen(),
    },
    {
      key: "db",
      label: "DATABASE_URL",
      value: flag(Boolean(process.env.DATABASE_URL?.trim()), ar),
      ok: Boolean(process.env.DATABASE_URL?.trim()),
    },
    {
      key: "node",
      label: "NODE_ENV",
      value: process.env.NODE_ENV || "—",
      ok: true,
    },
    {
      key: "access",
      label: ar ? "حالة الدخول" : "Access state",
      value: access.kind,
      ok: access.kind === "ok",
    },
  ];

  return (
    <div>
      <AdminPageHeader />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "صحة الإعداد" : "Config health"}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "العنصر" : "Item"}</th>
                <th>{ar ? "القيمة" : "Value"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <strong style={{ direction: "ltr", display: "inline-block" }}>{row.label}</strong>
                  </td>
                  <td style={{ direction: "ltr" }}>{row.value}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${row.ok ? "ready" : "warn"}`}>
                      {row.ok ? (ar ? "سليم" : "ok") : ar ? "راجع" : "check"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
