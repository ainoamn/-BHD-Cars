import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { auctions } from "@/lib/data";
import { listAuctionControls } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminAuctionsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const controls = await listAuctionControls();
  const bySlug = Object.fromEntries(controls.map((row) => [row.slug, row]));

  return (
    <div>
      <AdminPageHeader actions={<Link href="/auctions">{ar ? "صفحة المزادات" : "Auctions page"}</Link>} />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `اللوتات (${auctions.length})` : `Lots (${auctions.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "اللوت" : "Lot"}</th>
                <th>{ar ? "أعلى مزايدة" : "High bid"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
                <th>{ar ? "تحكم" : "Control"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {auctions.map((lot) => {
                const control = bySlug[lot.slug];
                const status = control?.status || "live";
                const high = lot.bids[0]?.amountOmr ?? lot.openingOmr;
                return (
                  <tr key={lot.slug}>
                    <td>
                      <strong>{ar ? lot.title.ar : lot.title.en}</strong>
                      <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>
                        {lot.year} · {lot.endsInHours}h
                      </div>
                    </td>
                    <td>{high.toLocaleString()} OMR</td>
                    <td>
                      <span className={`admin-badge admin-badge--${status === "live" ? "ready" : "warn"}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <AdminActionForm
                        action="/api/admin/auctions"
                        submitLabel={ar ? "تحديث" : "Update"}
                        fields={[
                          { name: "slug", type: "hidden", label: "", defaultValue: lot.slug },
                          {
                            name: "status",
                            label: ar ? "الحالة" : "Status",
                            type: "select",
                            defaultValue: status,
                            options: [
                              { value: "live", label: "live" },
                              { value: "paused", label: "paused" },
                              { value: "closed", label: "closed" },
                              { value: "awarded", label: "awarded" },
                            ],
                          },
                          {
                            name: "notes",
                            label: ar ? "ملاحظة" : "Note",
                            defaultValue: control?.notes || "",
                          },
                        ]}
                      />
                    </td>
                    <td>
                      <Link href={`/admin/auctions/${lot.slug}`}>{ar ? "تفاصيل" : "Detail"}</Link>
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
