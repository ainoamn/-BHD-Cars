import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { sellers } from "@/lib/data";
import { listDealerControls, listSubscriptions } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminDealersPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const controls = await listDealerControls();
  const subs = await listSubscriptions();
  const bySlug = Object.fromEntries(controls.map((row) => [row.slug, row]));
  const subByDealer = Object.fromEntries(subs.map((row) => [row.dealer_slug, row]));

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/plans">{ar ? "الباقات" : "Plans"}</Link>
            <Link href="/admin/partners">{ar ? "مؤسسات الخدمات" : "Service orgs"}</Link>
          </>
        }
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `البائعون (${sellers.length})` : `Sellers (${sellers.length})`}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الاسم" : "Name"}</th>
                <th>{ar ? "النوع" : "Kind"}</th>
                <th>{ar ? "اشتراك" : "Plan"}</th>
                <th>{ar ? "الاعتماد" : "Accreditation"}</th>
                <th>{ar ? "تحكم" : "Control"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const control = bySlug[seller.slug];
                const sub = subByDealer[seller.slug];
                const verified = control?.verified ?? seller.verified;
                const accredited = control?.accredited ?? false;
                const status = control?.status || "active";
                return (
                  <tr key={seller.slug}>
                    <td>
                      <strong>{seller.name}</strong>
                      <div style={{ color: "#5f736c", fontSize: "0.75rem" }}>
                        {ar ? seller.city.ar : seller.city.en}
                      </div>
                    </td>
                    <td>{seller.kind}</td>
                    <td>{sub ? `${sub.plan_id} · ${sub.status}` : "—"}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${verified ? "ready" : "muted"}`}>
                        {verified ? "verified" : "unverified"}
                      </span>{" "}
                      <span className={`admin-badge admin-badge--${accredited ? "ready" : "muted"}`}>
                        {accredited ? "accredited" : "plain"}
                      </span>
                    </td>
                    <td>
                      <AdminActionForm
                        action="/api/admin/dealers"
                        submitLabel={ar ? "حفظ" : "Save"}
                        fields={[
                          { name: "slug", type: "hidden", label: "", defaultValue: seller.slug },
                          {
                            name: "verified",
                            label: ar ? "موثّق" : "Verified",
                            type: "checkbox",
                            defaultValue: verified,
                          },
                          {
                            name: "accredited",
                            label: ar ? "معتمد" : "Accredited",
                            type: "checkbox",
                            defaultValue: accredited,
                          },
                          {
                            name: "status",
                            label: ar ? "الحالة" : "Status",
                            type: "select",
                            defaultValue: status,
                            options: [
                              { value: "active", label: "active" },
                              { value: "suspended", label: "suspended" },
                            ],
                          },
                        ]}
                      />
                    </td>
                    <td>
                      <Link href={`/admin/dealers/${seller.slug}`}>{ar ? "ملف" : "File"}</Link>
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
