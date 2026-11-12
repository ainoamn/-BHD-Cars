import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { allMakes } from "@/lib/makes-full";
import { cars } from "@/lib/data";
import { listListingControls } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const modelCount = allMakes.reduce((sum, make) => sum + make.models.length, 0);
  const controls = await listListingControls();
  const makeUsage = cars.reduce<Record<string, number>>((acc, car) => {
    acc[car.make] = (acc[car.make] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/listings">{ar ? "الإعلانات" : "Listings"}</Link>
            <Link href="/admin/markets">{ar ? "الأسواق" : "Markets"}</Link>
          </>
        }
      />
      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "شركات" : "Makes"}</p>
          <p className="admin-card__value">{allMakes.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "موديلات" : "Models"}</p>
          <p className="admin-card__value">{modelCount}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "ضوابط إعلانات" : "Listing controls"}</p>
          <p className="admin-card__value">{controls.length}</p>
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "الشركات المرتبطة بالسوق" : "Makes linked to market"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الشركة" : "Make"}</th>
              <th>{ar ? "موديلات" : "Models"}</th>
              <th>{ar ? "إعلانات حالية" : "Live listings"}</th>
              <th>Logo</th>
            </tr>
          </thead>
          <tbody>
            {allMakes.slice(0, 50).map((make) => (
              <tr key={make.id}>
                <td>
                  <strong>{ar ? make.name.ar : make.name.en}</strong>
                </td>
                <td>{make.models.length}</td>
                <td>{makeUsage[make.name.en] || makeUsage[make.id] || 0}</td>
                <td style={{ direction: "ltr", fontSize: "0.72rem" }}>{make.logo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
