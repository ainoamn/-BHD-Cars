import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { cars } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  return (
    <div>
      <AdminPageHeader
        actions={
          <Link href="/cars">{ar ? "عرض السوق" : "View market"}</Link>
        }
      />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "قائمة من كتالوج العرض الحالي. النشر/السحب والاعتماد الخادمي يأتيان مع قاعدة البيانات."
          : "List from the current demo catalog. Publish/withdraw and server approval land with the database."}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `كل الإعلانات (${cars.length})` : `All listings (${cars.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الإعلان" : "Listing"}</th>
                <th>{ar ? "السنة" : "Year"}</th>
                <th>{ar ? "السعر" : "Price"}</th>
                <th>{ar ? "الحالة" : "Condition"}</th>
                <th>{ar ? "البائع" : "Seller"}</th>
                <th>{ar ? "المدينة" : "City"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.slug}>
                  <td>
                    <strong>{ar ? car.title.ar : car.title.en}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>
                      {car.make} · {car.model}
                    </div>
                  </td>
                  <td>{car.year}</td>
                  <td>{car.priceOmr.toLocaleString()} OMR</td>
                  <td>
                    <span className={`admin-badge admin-badge--${car.condition === "accident" ? "warn" : "ready"}`}>
                      {car.condition}
                    </span>
                  </td>
                  <td>{car.seller}</td>
                  <td>{ar ? car.city.ar : car.city.en}</td>
                  <td>
                    <Link href={`/cars/${car.slug}`}>{ar ? "فتح" : "Open"}</Link>
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
