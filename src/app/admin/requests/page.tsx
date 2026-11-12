import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listPartnerOrgs, listServiceRequests } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const rows = await listServiceRequests();
  const partners = await listPartnerOrgs();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/dispatch">{ar ? "التوزيع" : "Dispatch"}</Link>
            <Link href="/admin/partners">{ar ? "الشركاء" : "Partners"}</Link>
          </>
        }
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `الطلبات (${rows.length})` : `Requests (${rows.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الطلب" : "Request"}</th>
                <th>{ar ? "النوع" : "Kind"}</th>
                <th>{ar ? "التواصل" : "Contact"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
                <th>{ar ? "تحديث" : "Update"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.title || row.kind}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.72rem" }}>{row.market_id}</div>
                  </td>
                  <td>{row.kind}</td>
                  <td>
                    {row.contact_name}
                    <div style={{ direction: "ltr", fontSize: "0.72rem", color: "#5f736c" }}>
                      {row.contact_phone}
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--muted">{row.status}</span>
                    {row.assignee ? <div style={{ fontSize: "0.72rem" }}>{row.assignee}</div> : null}
                  </td>
                  <td>
                    <AdminActionForm
                      action="/api/admin/requests"
                      submitLabel={ar ? "حفظ" : "Save"}
                      fields={[
                        { name: "id", type: "hidden", label: "", defaultValue: row.id },
                        {
                          name: "status",
                          label: ar ? "الحالة" : "Status",
                          type: "select",
                          defaultValue: row.status,
                          options: [
                            { value: "new", label: "new" },
                            { value: "assigned", label: "assigned" },
                            { value: "in_progress", label: "in_progress" },
                            { value: "done", label: "done" },
                            { value: "cancelled", label: "cancelled" },
                          ],
                        },
                        {
                          name: "assignee",
                          label: ar ? "الشريك" : "Assignee",
                          type: "select",
                          defaultValue: row.assignee || "",
                          options: [
                            { value: "", label: "—" },
                            ...partners
                              .filter((partner) => partner.kind === row.kind || partner.kind === "finance")
                              .map((partner) => ({
                                value: partner.id,
                                label: ar ? partner.name_ar : partner.name_en,
                              })),
                          ],
                        },
                      ]}
                    />
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
