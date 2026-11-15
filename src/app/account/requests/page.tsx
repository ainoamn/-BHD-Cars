import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { resolvePortalViewer } from "@/lib/portal/access";
import { listPersonalRequests } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function AccountRequestsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return null;
  const rows = await listPersonalRequests(result.viewer.session.sub);

  return (
    <div>
      <AdminPageHeader title={ar ? "طلباتي" : "My requests"} />
      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "طلب جديد" : "New request"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/portal/requests"
            method="PUT"
            submitLabel={ar ? "إرسال" : "Submit"}
            fields={[
              { name: "space", type: "hidden", label: "", defaultValue: "personal" },
              {
                name: "kind",
                label: ar ? "النوع" : "Kind",
                type: "select",
                defaultValue: "finance",
                options: [
                  { value: "finance", label: ar ? "تمويل" : "finance" },
                  { value: "insurance", label: ar ? "تأمين" : "insurance" },
                  { value: "inspection", label: ar ? "فحص" : "inspection" },
                  { value: "valuation", label: ar ? "تثمين" : "valuation" },
                  { value: "import", label: ar ? "استيراد" : "import" },
                ],
              },
              { name: "title", label: ar ? "العنوان" : "Title", required: true },
            ]}
          />
        </div>
      </div>
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
