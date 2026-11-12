import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { billingPulse, listSubscriptions } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const pulse = await billingPulse();
  const subs = await listSubscriptions();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/plans">{ar ? "الباقات" : "Plans"}</Link>
            <Link href="/admin/payments">{ar ? "المدفوعات" : "Payments"}</Link>
            <Link href="/admin/accounting">{ar ? "الحسابات" : "Accounts"}</Link>
          </>
        }
      />
      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">MRR</p>
          <p className="admin-card__value">{pulse.mrr.toLocaleString()} OMR</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "اشتراكات نشطة" : "Active subs"}</p>
          <p className="admin-card__value">{pulse.activeSubs}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "بوابات مفعّلة" : "Gateways on"}</p>
          <p className="admin-card__value">{pulse.enabledGateways}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "أرصدة مفتوحة" : "Open balances"}</p>
          <p className="admin-card__value">{pulse.openBalance.toLocaleString()} OMR</p>
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "توزيع الاشتراكات" : "Subscription mix"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "المعرض" : "Dealer"}</th>
              <th>{ar ? "الباقة" : "Plan"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "التجديد" : "Renews"}</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <Link href={`/admin/dealers/${sub.dealer_slug}`}>{sub.dealer_slug}</Link>
                </td>
                <td>{sub.plan_id}</td>
                <td>{sub.status}</td>
                <td>{sub.renews_at || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
