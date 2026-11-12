import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { cars, sellerBySlug } from "@/lib/data";
import { listDealerControls, listSubscriptions } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminDealerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seller = sellerBySlug(slug);
  if (!seller) notFound();
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const control = (await listDealerControls()).find((row) => row.slug === slug);
  const sub = (await listSubscriptions()).find((row) => row.dealer_slug === slug);
  const listings = cars.filter((car) => car.seller === slug);

  return (
    <div>
      <AdminPageHeader
        title={seller.name}
        lead={ar ? seller.about.ar : seller.about.en}
        actions={
          <>
            <Link href="/admin/dealers">{ar ? "كل المعارض" : "All dealers"}</Link>
            <Link href={`/dealers/${seller.slug}`}>{ar ? "الصفحة العامة" : "Public page"}</Link>
          </>
        }
      />
      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "إعلانات" : "Listings"}</p>
          <p className="admin-card__value">{listings.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "الباقة" : "Plan"}</p>
          <p className="admin-card__value" style={{ fontSize: "1.1rem" }}>
            {sub ? sub.plan_id : "—"}
          </p>
          {sub ? <p className="admin-card__hint">{sub.status}</p> : null}
        </div>
      </div>
      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "الاعتماد" : "Accreditation"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/admin/dealers"
            submitLabel={ar ? "حفظ" : "Save"}
            fields={[
              { name: "slug", type: "hidden", label: "", defaultValue: seller.slug },
              {
                name: "verified",
                label: ar ? "موثّق" : "Verified",
                type: "checkbox",
                defaultValue: control?.verified ?? seller.verified,
              },
              {
                name: "accredited",
                label: ar ? "معتمد" : "Accredited",
                type: "checkbox",
                defaultValue: control?.accredited ?? false,
              },
              {
                name: "status",
                label: ar ? "الحالة" : "Status",
                type: "select",
                defaultValue: control?.status || "active",
                options: [
                  { value: "active", label: "active" },
                  { value: "suspended", label: "suspended" },
                ],
              },
              {
                name: "notes",
                label: ar ? "ملاحظات" : "Notes",
                type: "textarea",
                defaultValue: control?.notes || "",
              },
            ]}
          />
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "إعلانات مرتبطة" : "Linked listings"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الإعلان" : "Listing"}</th>
              <th>{ar ? "السعر" : "Price"}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {listings.map((car) => (
              <tr key={car.slug}>
                <td>{ar ? car.title.ar : car.title.en}</td>
                <td>{car.priceOmr.toLocaleString()} OMR</td>
                <td>
                  <Link href={`/admin/listings/${car.slug}`}>{ar ? "إدارة" : "Manage"}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
