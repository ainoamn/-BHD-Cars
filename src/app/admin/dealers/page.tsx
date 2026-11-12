import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { sellers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDealersPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  return (
    <div>
      <AdminPageHeader />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "ملفات البائعين من بيانات العرض. اعتماد المعارض والتوثيق الخادمي لاحقًا."
          : "Seller files from demo data. Dealer accreditation and server verification come later."}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `البائعون والمعارض (${sellers.length})` : `Sellers & dealers (${sellers.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الاسم" : "Name"}</th>
                <th>{ar ? "النوع" : "Kind"}</th>
                <th>{ar ? "المدينة" : "City"}</th>
                <th>{ar ? "منذ" : "Since"}</th>
                <th>{ar ? "التوثيق" : "Verified"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.slug}>
                  <td>
                    <strong>{seller.name}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.75rem", direction: "ltr" }}>
                      {seller.phone}
                    </div>
                  </td>
                  <td>{seller.kind}</td>
                  <td>
                    {ar ? seller.city.ar : seller.city.en} · {seller.country.toUpperCase()}
                  </td>
                  <td>{seller.since}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${seller.verified ? "ready" : "muted"}`}>
                      {seller.verified ? (ar ? "موثّق" : "verified") : ar ? "غير موثّق" : "unverified"}
                    </span>
                  </td>
                  <td>
                    <Link href={`/dealers/${seller.slug}`}>{ar ? "الملف" : "Profile"}</Link>
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
