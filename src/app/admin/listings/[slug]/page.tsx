import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { carBySlug, sellerBySlug } from "@/lib/data";
import { listListingControls } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = carBySlug(slug);
  if (!car) notFound();

  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const controls = await listListingControls();
  const control = controls.find((row) => row.slug === slug);
  const seller = sellerBySlug(car.seller);

  return (
    <div>
      <AdminPageHeader
        title={ar ? car.title.ar : car.title.en}
        lead={ar ? "ملف تشغيلي للإعلان" : "Operational listing file"}
        actions={
          <>
            <Link href="/admin/listings">{ar ? "كل الإعلانات" : "All listings"}</Link>
            <Link href={`/cars/${car.slug}`}>{ar ? "عرض السوق" : "Market view"}</Link>
          </>
        }
      />

      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "السعر" : "Price"}</p>
          <p className="admin-card__value">{car.priceOmr.toLocaleString()} OMR</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "الحالة الفنية" : "Condition"}</p>
          <p className="admin-card__value" style={{ fontSize: "1.1rem" }}>
            {car.condition}
          </p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "البائع" : "Seller"}</p>
          <p className="admin-card__value" style={{ fontSize: "1.1rem" }}>
            {seller?.name || car.seller}
          </p>
          {seller ? (
            <Link href={`/admin/dealers/${seller.slug}`} className="admin-card__hint">
              {ar ? "ملف المعرض/البائع" : "Dealer/seller file"}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "تحكم النشر" : "Publish control"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/admin/listings"
            submitLabel={ar ? "حفظ" : "Save"}
            fields={[
              { name: "slug", type: "hidden", label: "", defaultValue: car.slug },
              {
                name: "status",
                label: ar ? "الحالة" : "Status",
                type: "select",
                defaultValue: control?.status || "published",
                options: [
                  { value: "published", label: "published" },
                  { value: "held", label: "held" },
                  { value: "flagged", label: "flagged" },
                  { value: "withdrawn", label: "withdrawn" },
                ],
              },
              {
                name: "notes",
                label: ar ? "ملاحظات المراجعة" : "Moderation notes",
                type: "textarea",
                defaultValue: control?.notes || "",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
