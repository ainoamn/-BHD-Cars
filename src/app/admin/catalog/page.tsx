import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { allMakes } from "@/lib/makes-full";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const modelCount = allMakes.reduce((sum, make) => sum + make.models.length, 0);

  return (
    <div>
      <AdminPageHeader />
      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "شركات" : "Makes"}</p>
          <p className="admin-card__value">{allMakes.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "موديلات" : "Models"}</p>
          <p className="admin-card__value">{modelCount}</p>
        </div>
      </div>
      <div className="admin-banner admin-banner--info">
        {ar
          ? "الكتالوج الثابت المستخدم في الفلاتر وبيع السيارة. تحرير الشعارات والموديلات من لوحة التحكم يأتي لاحقًا."
          : "Static catalog used by filters and sell flow. In-console make/logo editing comes later."}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "الشركات" : "Makes"}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الشركة" : "Make"}</th>
                <th>{ar ? "الفئة" : "Category"}</th>
                <th>{ar ? "موديلات" : "Models"}</th>
                <th>{ar ? "شعار" : "Logo"}</th>
              </tr>
            </thead>
            <tbody>
              {allMakes.slice(0, 40).map((make) => (
                <tr key={make.id}>
                  <td>
                    <strong>{ar ? make.name.ar : make.name.en}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>{make.id}</div>
                  </td>
                  <td>{make.category || "cars"}</td>
                  <td>{make.models.length}</td>
                  <td style={{ direction: "ltr" }}>{make.logo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allMakes.length > 40 ? (
          <div className="admin-empty" style={{ padding: "0.85rem" }}>
            {ar
              ? `عرض أول 40 من ${allMakes.length} شركة.`
              : `Showing first 40 of ${allMakes.length} makes.`}
          </div>
        ) : null}
      </div>
    </div>
  );
}
