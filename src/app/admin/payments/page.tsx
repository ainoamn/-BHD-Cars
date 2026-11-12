import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listPaymentGateways } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const gateways = await listPaymentGateways();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/billing">{ar ? "الإحصائيات" : "Stats"}</Link>
            <Link href="/admin/plans">{ar ? "الاشتراكات" : "Plans"}</Link>
          </>
        }
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "بوابات الدفع" : "Payment gateways"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "البوابة" : "Gateway"}</th>
              <th>{ar ? "الأسواق" : "Markets"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تفعيل" : "Toggle"}</th>
            </tr>
          </thead>
          <tbody>
            {gateways.map((gateway) => (
              <tr key={gateway.id}>
                <td>
                  <strong>{gateway.label}</strong>
                  <div style={{ color: "#5f736c", fontSize: "0.72rem" }}>{gateway.id}</div>
                </td>
                <td>{(gateway.markets || []).join(", ")}</td>
                <td>
                  <span className={`admin-badge admin-badge--${gateway.enabled ? "ready" : "muted"}`}>
                    {gateway.enabled ? (ar ? "مفعّل" : "on") : ar ? "متوقف" : "off"}
                  </span>
                </td>
                <td>
                  <AdminActionForm
                    action="/api/admin/payments"
                    submitLabel={gateway.enabled ? (ar ? "إيقاف" : "Disable") : ar ? "تفعيل" : "Enable"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: gateway.id },
                      {
                        name: "enabled",
                        type: "hidden",
                        label: "",
                        defaultValue: gateway.enabled ? "false" : "true",
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
