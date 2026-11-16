import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { resolvePortalViewer } from "@/lib/portal/access";
import { listPersonalListings } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function AccountListingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return null;
  const listings = await listPersonalListings(result.viewer.session.sub);

  return (
    <div>
      <AdminPageHeader
        title={ar ? "مركباتي" : "My vehicles"}
        lead={ar ? "إعلاناتك الشخصية فقط." : "Your personal listings only."}
        actions={
          <a className="primary" href="#add-vehicle">
            {ar ? "إضافة مركبة" : "Add vehicle"}
          </a>
        }
      />
      <div id="add-vehicle" className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "إضافة مركبة" : "Add vehicle"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/portal/listings"
            method="PUT"
            submitLabel={ar ? "حفظ" : "Save"}
            fields={[
              { name: "space", type: "hidden", label: "", defaultValue: "personal" },
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
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `القائمة (${listings.length})` : `List (${listings.length})`}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "المركبة" : "Vehicle"}</th>
              <th>{ar ? "السعر" : "Price"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تحديث" : "Update"}</th>
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
                <td>
                  <AdminActionForm
                    action="/api/portal/listings"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: row.id },
                      { name: "space", type: "hidden", label: "", defaultValue: "personal" },
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
