import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listPartnerOrgs } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const partners = await listPartnerOrgs();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/dispatch">{ar ? "التوزيع" : "Dispatch"}</Link>
            <Link href="/admin/requests">{ar ? "الطلبات" : "Requests"}</Link>
          </>
        }
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `مؤسسات الخدمات (${partners.length})` : `Service orgs (${partners.length})`}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "المؤسسة" : "Organization"}</th>
              <th>{ar ? "النوع" : "Kind"}</th>
              <th>{ar ? "السوق" : "Market"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تحديث" : "Update"}</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id}>
                <td>
                  <strong>{ar ? partner.name_ar : partner.name_en}</strong>
                  <div style={{ direction: "ltr", fontSize: "0.72rem", color: "#5f736c" }}>
                    {partner.phone}
                  </div>
                </td>
                <td>{partner.kind}</td>
                <td>{partner.market_id}</td>
                <td>
                  <span className={`admin-badge admin-badge--${partner.status === "active" ? "ready" : "muted"}`}>
                    {partner.status}
                  </span>
                </td>
                <td>
                  <AdminActionForm
                    action="/api/admin/partners"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: partner.id },
                      {
                        name: "status",
                        label: ar ? "الحالة" : "Status",
                        type: "select",
                        defaultValue: partner.status,
                        options: [
                          { value: "active", label: "active" },
                          { value: "paused", label: "paused" },
                          { value: "revoked", label: "revoked" },
                        ],
                      },
                      {
                        name: "notes",
                        label: ar ? "ملاحظة" : "Note",
                        defaultValue: partner.notes || "",
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
  );
}
