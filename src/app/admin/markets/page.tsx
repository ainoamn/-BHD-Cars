import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { markets } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMarketsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  return (
    <div>
      <AdminPageHeader />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "أسواق العرض الحالية من الكود. أعلام التفعيل لكل خدمة ستُدار من قاعدة البيانات لاحقًا."
          : "Current demo markets from code. Per-service activation flags will be database-backed later."}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "الأسواق" : "Markets"}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "السوق" : "Market"}</th>
                <th>ID</th>
                <th>{ar ? "العملة" : "Currency"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => (
                <tr key={market.id}>
                  <td>
                    <strong>{ar ? market.name.ar : market.name.en}</strong>
                  </td>
                  <td style={{ direction: "ltr" }}>{market.id}</td>
                  <td>{market.currency}</td>
                  <td>
                    <span className="admin-badge admin-badge--ready">
                      {market.id === "om" ? (ar ? "افتراضي" : "default") : ar ? "معرّف" : "defined"}
                    </span>
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
