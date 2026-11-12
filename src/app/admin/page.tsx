import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { auctions, cars, sellers } from "@/lib/data";
import { allMakes } from "@/lib/makes-full";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  const ready = cars.filter((car) => car.condition === "ready").length;
  const accident = cars.filter((car) => car.condition === "accident").length;
  const verifiedDealers = sellers.filter((seller) => seller.verified).length;

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/listings">{ar ? "إدارة الإعلانات" : "Manage listings"}</Link>
            <Link className="primary" href="/cars">
              {ar ? "فتح السوق" : "Open market"}
            </Link>
          </>
        }
      />

      <div className="admin-banner admin-banner--info">
        {ar
          ? "لوحة تشغيل BHD Cars بنفس أسلوب تحكم BHD R. الأرقام أدناه من بيانات العرض الحالية؛ الطلبات الخادمية والاعتماد الكامل يأتيان مع دفعات قاعدة البيانات والصلاحيات."
          : "BHD Cars control desk in the BHD R console style. Figures below come from the current demo catalog; server-backed requests and full RBAC land with the database batches."}
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "إعلانات الكتالوج" : "Catalog listings"}</p>
          <p className="admin-card__value">{cars.length}</p>
          <p className="admin-card__hint">
            {ar ? `${ready} جاهزة · ${accident} حادث معلن` : `${ready} ready · ${accident} declared damage`}
          </p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "مزادات نشطة (عرض)" : "Live auctions (demo)"}</p>
          <p className="admin-card__value">{auctions.length}</p>
          <p className="admin-card__hint">{ar ? "تحتاج إغلاقًا خادميًا لاحقًا" : "Needs server-side close later"}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "معارض" : "Dealers"}</p>
          <p className="admin-card__value">{sellers.length}</p>
          <p className="admin-card__hint">
            {ar ? `${verifiedDealers} موثّق` : `${verifiedDealers} verified`}
          </p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "شركات الكتالوج" : "Catalog makes"}</p>
          <p className="admin-card__value">{allMakes.length}</p>
          <p className="admin-card__hint">{ar ? "شعارات وموديلات للفلاتر" : "Logos and models for filters"}</p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "أقسام المنصة" : "Platform desks"}</h2>
          <Link href="/admin/settings">{ar ? "إعدادات الموقع فقط" : "Site settings only"}</Link>
        </div>
        <div className="admin-actions" style={{ padding: "1rem" }}>
          <Link href="/admin/delegates">{ar ? "الصلاحيات" : "Permissions"}</Link>
          <Link href="/admin/users">{ar ? "الأعضاء والحسابات" : "Members"}</Link>
          <Link href="/admin/plans">{ar ? "الاشتراكات" : "Subscriptions"}</Link>
          <Link href="/admin/billing">{ar ? "الإحصائيات" : "Stats"}</Link>
          <Link href="/admin/accounting">{ar ? "حسابات العملاء" : "Accounts"}</Link>
          <Link href="/admin/payments">{ar ? "المدفوعات" : "Payments"}</Link>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "أحدث الإعلانات في الكتالوج" : "Latest catalog listings"}</h2>
          <Link href="/admin/listings">{ar ? "الكل" : "View all"}</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الإعلان" : "Listing"}</th>
                <th>{ar ? "السنة" : "Year"}</th>
                <th>{ar ? "السعر" : "Price"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
                <th>{ar ? "المدينة" : "City"}</th>
              </tr>
            </thead>
            <tbody>
              {cars.slice(0, 8).map((car) => (
                <tr key={car.slug}>
                  <td>
                    <strong>{ar ? car.title.ar : car.title.en}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>{car.make}</div>
                  </td>
                  <td>{car.year}</td>
                  <td>{car.priceOmr.toLocaleString()} OMR</td>
                  <td>
                    <span className={`admin-badge admin-badge--${car.condition === "accident" ? "warn" : "ready"}`}>
                      {car.condition}
                    </span>
                  </td>
                  <td>{ar ? car.city.ar : car.city.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
