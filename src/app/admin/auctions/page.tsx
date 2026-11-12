import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { auctions } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminAuctionsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  return (
    <div>
      <AdminPageHeader
        actions={<Link href="/auctions">{ar ? "صفحة المزادات" : "Auctions page"}</Link>}
      />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "لوتات العرض الحالية. إغلاق المزاد والترسية الخادمية غير مفعّلين بعد."
          : "Current demo lots. Server-side close and award are not wired yet."}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `المزادات النشطة (${auctions.length})` : `Live auctions (${auctions.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "اللوت" : "Lot"}</th>
                <th>{ar ? "افتتاح" : "Opening"}</th>
                <th>{ar ? "أعلى مزايدة" : "High bid"}</th>
                <th>{ar ? "الاحتياطي" : "Reserve"}</th>
                <th>{ar ? "ينتهي خلال" : "Ends in"}</th>
                <th>{ar ? "المدينة" : "City"}</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((lot) => {
                const high = lot.bids[0]?.amountOmr ?? lot.openingOmr;
                return (
                  <tr key={lot.slug}>
                    <td>
                      <strong>{ar ? lot.title.ar : lot.title.en}</strong>
                      <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>
                        {lot.year} · {ar ? lot.origin.ar : lot.origin.en}
                      </div>
                    </td>
                    <td>{lot.openingOmr.toLocaleString()} OMR</td>
                    <td>{high.toLocaleString()} OMR</td>
                    <td>
                      <span className={`admin-badge admin-badge--${lot.reserveMet ? "ready" : "warn"}`}>
                        {lot.reserveMet ? (ar ? "مكسور" : "met") : ar ? "قائم" : "intact"}
                      </span>
                    </td>
                    <td>
                      {lot.endsInHours}h
                    </td>
                    <td>{ar ? lot.city.ar : lot.city.en}</td>
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
