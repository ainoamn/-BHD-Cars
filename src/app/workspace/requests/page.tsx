import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { listOrgRequests } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function WorkspaceRequestsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolveWorkspaceAccess("requests.read");
  if (result.kind === "forbidden") return <PortalGate locale={ar ? "ar" : "en"} reason="forbidden" />;
  if (result.kind !== "ok") return null;

  const canWrite =
    result.membership.role === "owner" ||
    result.membership.role === "admin" ||
    result.membership.scopes.includes("requests.write") ||
    result.membership.scopes.includes("all");
  const rows = await listOrgRequests(result.membership.org_id);

  return (
    <div>
      <AdminPageHeader title={ar ? "طلبات المنشأة" : "Organization requests"} />
      {canWrite ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <div className="admin-panel__head">
            <h2>{ar ? "طلب جديد للمنشأة" : "New org request"}</h2>
          </div>
          <div style={{ padding: "1rem" }}>
            <AdminActionForm
              action="/api/portal/requests"
              method="PUT"
              submitLabel={ar ? "إرسال" : "Submit"}
              fields={[
                { name: "space", type: "hidden", label: "", defaultValue: "org" },
                {
                  name: "kind",
                  label: ar ? "النوع" : "Kind",
                  type: "select",
                  defaultValue: "inspection",
                  options: [
                    { value: "inspection", label: "inspection" },
                    { value: "finance", label: "finance" },
                    { value: "insurance", label: "insurance" },
                    { value: "valuation", label: "valuation" },
                  ],
                },
                { name: "title", label: ar ? "العنوان" : "Title", required: true },
              ]}
            />
          </div>
        </div>
      ) : null}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الطلب" : "Request"}</th>
              <th>{ar ? "النوع" : "Kind"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.kind}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
