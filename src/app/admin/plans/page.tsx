import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listPlans, listSubscriptions } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const plans = await listPlans();
  const subs = await listSubscriptions();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/billing">{ar ? "الإحصائيات" : "Stats"}</Link>
            <Link href="/admin/dealers">{ar ? "المعارض" : "Dealers"}</Link>
          </>
        }
      />
      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "الباقات" : "Plans"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{ar ? "الاسم" : "Name"}</th>
              <th>{ar ? "السعر" : "Price"}</th>
              <th>{ar ? "سقف الإعلانات" : "Cap"}</th>
              <th>{ar ? "مزاد" : "Auction"}</th>
              <th>{ar ? "تعديل" : "Edit"}</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>{ar ? plan.name_ar : plan.name_en}</td>
                <td>{plan.price_omr} OMR</td>
                <td>{plan.listing_cap}</td>
                <td>{plan.auction_access ? "yes" : "no"}</td>
                <td>
                  <AdminActionForm
                    action="/api/admin/plans"
                    method="PUT"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: plan.id },
                      { name: "nameAr", label: "AR", defaultValue: plan.name_ar, required: true },
                      { name: "nameEn", label: "EN", defaultValue: plan.name_en, required: true },
                      {
                        name: "priceOmr",
                        label: ar ? "السعر" : "Price",
                        type: "number",
                        defaultValue: Number(plan.price_omr),
                      },
                      {
                        name: "listingCap",
                        label: ar ? "السقف" : "Cap",
                        type: "number",
                        defaultValue: plan.listing_cap,
                      },
                      {
                        name: "auctionAccess",
                        label: ar ? "مزاد" : "Auction",
                        type: "checkbox",
                        defaultValue: plan.auction_access,
                      },
                      {
                        name: "active",
                        label: ar ? "نشط" : "Active",
                        type: "checkbox",
                        defaultValue: plan.active,
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "اشتراكات المعارض" : "Dealer subscriptions"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "المعرض" : "Dealer"}</th>
              <th>{ar ? "الباقة" : "Plan"}</th>
              <th>{ar ? "التجديد" : "Renews"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تحديث" : "Update"}</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <Link href={`/admin/dealers/${sub.dealer_slug}`}>{sub.dealer_slug}</Link>
                </td>
                <td>{sub.plan_id}</td>
                <td>{sub.renews_at || "—"}</td>
                <td>{sub.status}</td>
                <td>
                  <AdminActionForm
                    action="/api/admin/subscriptions"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: sub.id },
                      {
                        name: "planId",
                        label: ar ? "الباقة" : "Plan",
                        type: "select",
                        defaultValue: sub.plan_id,
                        options: plans.map((plan) => ({ value: plan.id, label: plan.id })),
                      },
                      {
                        name: "status",
                        label: ar ? "الحالة" : "Status",
                        type: "select",
                        defaultValue: sub.status,
                        options: [
                          { value: "active", label: "active" },
                          { value: "past_due", label: "past_due" },
                          { value: "cancelled", label: "cancelled" },
                        ],
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
