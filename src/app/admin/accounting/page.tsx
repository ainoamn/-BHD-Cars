import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listClientAccounts } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminAccountingPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const accounts = await listClientAccounts();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/billing">{ar ? "الإحصائيات" : "Stats"}</Link>
            <Link href="/admin/payments">{ar ? "المدفوعات" : "Payments"}</Link>
          </>
        }
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "حسابات العملاء" : "Client accounts"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الحساب" : "Account"}</th>
              <th>{ar ? "الرصيد" : "Balance"}</th>
              <th>{ar ? "فواتير مفتوحة" : "Open invoices"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تحديث" : "Update"}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <strong>{account.label}</strong>
                  {account.party_slug ? (
                    <div>
                      <Link href={`/admin/dealers/${account.party_slug}`}>{account.party_slug}</Link>
                    </div>
                  ) : null}
                </td>
                <td>{Number(account.balance_omr).toLocaleString()} OMR</td>
                <td>{account.open_invoices}</td>
                <td>{account.status}</td>
                <td>
                  <AdminActionForm
                    action="/api/admin/accounting"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: account.id },
                      {
                        name: "balanceOmr",
                        label: ar ? "الرصيد" : "Balance",
                        type: "number",
                        defaultValue: Number(account.balance_omr),
                      },
                      {
                        name: "openInvoices",
                        label: ar ? "فواتير" : "Invoices",
                        type: "number",
                        defaultValue: account.open_invoices,
                      },
                      {
                        name: "status",
                        label: ar ? "الحالة" : "Status",
                        type: "select",
                        defaultValue: account.status,
                        options: [
                          { value: "open", label: "open" },
                          { value: "hold", label: "hold" },
                          { value: "closed", label: "closed" },
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
