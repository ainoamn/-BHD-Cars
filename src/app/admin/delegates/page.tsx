import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { adminEmailAllowlist, adminSubAllowlist } from "@/lib/admin/access";
import { ADMIN_SCOPE_OPTIONS } from "@/lib/admin/site-control";
import { listDelegates } from "@/lib/admin/store";
import { DelegatesDeleteButton } from "@/components/admin/delegates-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminDelegatesPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const delegates = await listDelegates();
  const envEmails = adminEmailAllowlist();
  const envSubs = adminSubAllowlist();

  return (
    <div>
      <AdminPageHeader
        actions={<Link href="/admin/users">{ar ? "الأعضاء" : "Members"}</Link>}
      />

      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">SITE_ADMIN_EMAILS</p>
          <p className="admin-card__value" style={{ fontSize: "1rem" }}>
            {envEmails.length || 0}
          </p>
          <p className="admin-card__hint" style={{ direction: "ltr" }}>
            {envEmails.join(", ") || "—"}
          </p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">SITE_ADMIN_SUBS</p>
          <p className="admin-card__value" style={{ fontSize: "1rem" }}>
            {envSubs.length || 0}
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "إضافة مفوّض" : "Add delegate"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/admin/delegates"
            method="PUT"
            submitLabel={ar ? "منح صلاحية" : "Grant access"}
            fields={[
              { name: "email", label: "Email", required: true },
              {
                name: "scopes",
                label: ar ? "الصلاحيات (مفصولة بفاصلة)" : "Scopes (comma-separated)",
                defaultValue: "marketplace,operations",
                required: true,
              },
              { name: "note", label: ar ? "ملاحظة" : "Note" },
            ]}
          />
          <p className="admin-card__hint" style={{ marginTop: "0.75rem" }}>
            {ADMIN_SCOPE_OPTIONS.map((scope) => (ar ? scope.ar : scope.en)).join(" · ")}
          </p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "المفوّضون" : "Delegates"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>{ar ? "الصلاحيات" : "Scopes"}</th>
              <th>{ar ? "ملاحظة" : "Note"}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {delegates.map((row) => (
              <tr key={row.email}>
                <td style={{ direction: "ltr" }}>{row.email}</td>
                <td>{(row.scopes || []).join(", ")}</td>
                <td>{row.note || "—"}</td>
                <td>
                  <DelegatesDeleteButton email={row.email} label={ar ? "حذف" : "Remove"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
