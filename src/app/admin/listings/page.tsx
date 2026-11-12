import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { cars } from "@/lib/data";
import { listListingControls } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const controls = await listListingControls();
  const bySlug = Object.fromEntries(controls.map((row) => [row.slug, row]));

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/moderation">{ar ? "المراجعة" : "Moderation"}</Link>
            <Link href="/cars">{ar ? "السوق" : "Market"}</Link>
          </>
        }
      />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "حالة كل إعلان محفوظة في قاعدة البيانات وتتحكم في ظهوره التشغيلي."
          : "Each listing status is stored in the database and drives operational visibility."}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `الإعلانات (${cars.length})` : `Listings (${cars.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الإعلان" : "Listing"}</th>
                <th>{ar ? "السعر" : "Price"}</th>
                <th>{ar ? "الحالة التشغيلية" : "Ops status"}</th>
                <th>{ar ? "تحكم" : "Control"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const control = bySlug[car.slug];
                const status = control?.status || "published";
                return (
                  <tr key={car.slug}>
                    <td>
                      <strong>{ar ? car.title.ar : car.title.en}</strong>
                      <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>
                        {car.make} · {car.year}
                      </div>
                      {control?.notes ? (
                        <div style={{ color: "#8a5a00", fontSize: "0.72rem", marginTop: "0.25rem" }}>
                          {control.notes}
                        </div>
                      ) : null}
                    </td>
                    <td>{car.priceOmr.toLocaleString()} OMR</td>
                    <td>
                      <span
                        className={`admin-badge admin-badge--${
                          status === "published" ? "ready" : status === "flagged" || status === "held" ? "warn" : "muted"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      <AdminActionForm
                        action="/api/admin/listings"
                        submitLabel={ar ? "تحديث" : "Update"}
                        fields={[
                          { name: "slug", type: "hidden", label: "", defaultValue: car.slug },
                          {
                            name: "status",
                            label: ar ? "الحالة" : "Status",
                            type: "select",
                            defaultValue: status,
                            options: [
                              { value: "published", label: ar ? "منشور" : "published" },
                              { value: "held", label: ar ? "موقوف" : "held" },
                              { value: "flagged", label: ar ? "مبلّغ" : "flagged" },
                              { value: "withdrawn", label: ar ? "مسحوب" : "withdrawn" },
                            ],
                          },
                          {
                            name: "notes",
                            label: ar ? "ملاحظة" : "Note",
                            type: "text",
                            defaultValue: control?.notes || "",
                          },
                        ]}
                      />
                    </td>
                    <td>
                      <Link href={`/admin/listings/${car.slug}`}>{ar ? "تفاصيل" : "Detail"}</Link>
                      {" · "}
                      <Link href={`/cars/${car.slug}`}>{ar ? "السوق" : "Live"}</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
