import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { listOrgListings } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function WorkspaceListingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolveWorkspaceAccess("listings.read");
  if (result.kind === "forbidden") return <PortalGate locale={ar ? "ar" : "en"} reason="forbidden" />;
  if (result.kind !== "ok") return null;

  const canWrite =
    result.membership.role === "owner" ||
    result.membership.role === "admin" ||
    result.membership.scopes.includes("all") ||
    result.membership.scopes.includes("listings.write");
  const listings = await listOrgListings(result.membership.org_id);

  return (
    <div>
      <AdminPageHeader
        title={ar ? "مركبات المنشأة" : "Organization vehicles"}
        lead={ar ? "معزولة بـ org_id لهذه المنشأة." : "Isolated by this organization’s org_id."}
      />
      {canWrite ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <div className="admin-panel__head">
            <h2>{ar ? "إضافة مركبة" : "Add vehicle"}</h2>
          </div>
          <div style={{ padding: "1rem" }}>
            <AdminActionForm
              action="/api/portal/listings"
              method="PUT"
              submitLabel={ar ? "حفظ" : "Save"}
              fields={[
                { name: "space", type: "hidden", label: "", defaultValue: "org" },
                { name: "titleAr", label: ar ? "العنوان عربي" : "Title AR", required: true },
                { name: "titleEn", label: ar ? "العنوان إنجليزي" : "Title EN", required: true },
                { name: "priceOmr", label: ar ? "السعر" : "Price", type: "number", defaultValue: 0 },
                {
                  name: "status",
                  label: ar ? "الحالة" : "Status",
                  type: "select",
                  defaultValue: "draft",
                  options: [
                    { value: "draft", label: "draft" },
                    { value: "published", label: "published" },
                  ],
                },
              ]}
            />
          </div>
        </div>
      ) : null}
      <div className="admin-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "المركبة" : "Vehicle"}</th>
              <th>{ar ? "السعر" : "Price"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              {canWrite ? <th>{ar ? "تحديث" : "Update"}</th> : null}
            </tr>
          </thead>
          <tbody>
            {listings.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{ar ? row.title_ar : row.title_en}</strong>
                </td>
                <td>{Number(row.price_omr).toLocaleString()} OMR</td>
                <td>{row.status}</td>
                {canWrite ? (
                  <td>
                    <AdminActionForm
                      action="/api/portal/listings"
                      submitLabel={ar ? "حفظ" : "Save"}
                      fields={[
                        { name: "id", type: "hidden", label: "", defaultValue: row.id },
                        { name: "space", type: "hidden", label: "", defaultValue: "org" },
                        {
                          name: "status",
                          label: ar ? "الحالة" : "Status",
                          type: "select",
                          defaultValue: row.status,
                          options: [
                            { value: "draft", label: "draft" },
                            { value: "published", label: "published" },
                            { value: "withdrawn", label: "withdrawn" },
                          ],
                        },
                      ]}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
