import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { markets } from "@/lib/data";
import { listMarketControls, loadSiteBundle } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminMarketsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const controls = await listMarketControls();
  const site = await loadSiteBundle();
  const byId = Object.fromEntries(controls.map((row) => [row.market_id, row]));

  return (
    <div>
      <AdminPageHeader
        actions={<Link href="/admin/settings">{ar ? "إعدادات الموقع" : "Site settings"}</Link>}
      />
      <div className="admin-banner admin-banner--info">
        {ar
          ? `السوق الافتراضي الحالي: ${site.defaultMarket.id}`
          : `Current default market: ${site.defaultMarket.id}`}
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "الأسواق" : "Markets"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "السوق" : "Market"}</th>
              <th>{ar ? "العملة" : "Currency"}</th>
              <th>{ar ? "مفعّل" : "Enabled"}</th>
              <th>{ar ? "تحكم" : "Control"}</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market) => {
              const control = byId[market.id];
              const enabled =
                control?.enabled ?? (market.id === "om" || market.id === "ae" || market.id === "world");
              const currency = control?.currency || market.currency;
              return (
                <tr key={market.id}>
                  <td>
                    <strong>{ar ? market.name.ar : market.name.en}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.72rem" }}>{market.id}</div>
                  </td>
                  <td>{currency}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${enabled ? "ready" : "muted"}`}>
                      {enabled ? "on" : "off"}
                    </span>
                  </td>
                  <td>
                    <AdminActionForm
                      action="/api/admin/markets"
                      method="PUT"
                      submitLabel={ar ? "حفظ" : "Save"}
                      fields={[
                        { name: "marketId", type: "hidden", label: "", defaultValue: market.id },
                        {
                          name: "enabled",
                          label: ar ? "مفعّل" : "Enabled",
                          type: "checkbox",
                          defaultValue: enabled,
                        },
                        {
                          name: "currency",
                          label: ar ? "العملة" : "Currency",
                          defaultValue: currency,
                          required: true,
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
