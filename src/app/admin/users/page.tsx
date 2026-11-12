import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listAccounts } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const accounts = await listAccounts();

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/delegates">{ar ? "الصلاحيات" : "Permissions"}</Link>
            <Link href="/admin/dealers">{ar ? "المعارض" : "Dealers"}</Link>
          </>
        }
      />
      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "إضافة / تحديث حساب" : "Add / update account"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/admin/users"
            method="PUT"
            submitLabel={ar ? "حفظ الحساب" : "Save account"}
            fields={[
              { name: "email", label: "Email", required: true },
              { name: "name", label: ar ? "الاسم" : "Name", required: true },
              {
                name: "kind",
                label: ar ? "النوع" : "Kind",
                type: "select",
                defaultValue: "member",
                options: [
                  { value: "member", label: "member" },
                  { value: "dealer", label: "dealer" },
                  { value: "partner", label: "partner" },
                  { value: "owner", label: "owner" },
                ],
              },
              {
                name: "status",
                label: ar ? "الحالة" : "Status",
                type: "select",
                defaultValue: "active",
                options: [
                  { value: "active", label: "active" },
                  { value: "suspended", label: "suspended" },
                ],
              },
              { name: "dealerSlug", label: ar ? "معرض مرتبط" : "Dealer slug" },
              { name: "identitySub", label: "Identity sub" },
            ]}
          />
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `الحسابات (${accounts.length})` : `Accounts (${accounts.length})`}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الاسم" : "Name"}</th>
              <th>Email</th>
              <th>{ar ? "النوع" : "Kind"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تحديث سريع" : "Quick update"}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <strong>{account.name || "—"}</strong>
                  {account.dealer_slug ? (
                    <div>
                      <Link href={`/admin/dealers/${account.dealer_slug}`}>{account.dealer_slug}</Link>
                    </div>
                  ) : null}
                </td>
                <td style={{ direction: "ltr" }}>{account.email}</td>
                <td>{account.kind}</td>
                <td>
                  <span className={`admin-badge admin-badge--${account.status === "active" ? "ready" : "warn"}`}>
                    {account.status}
                  </span>
                </td>
                <td>
                  <AdminActionForm
                    action="/api/admin/users"
                    method="PUT"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "email", type: "hidden", label: "", defaultValue: account.email },
                      { name: "name", type: "hidden", label: "", defaultValue: account.name },
                      { name: "kind", type: "hidden", label: "", defaultValue: account.kind },
                      {
                        name: "status",
                        label: ar ? "الحالة" : "Status",
                        type: "select",
                        defaultValue: account.status,
                        options: [
                          { value: "active", label: "active" },
                          { value: "suspended", label: "suspended" },
                        ],
                      },
                      {
                        name: "dealerSlug",
                        type: "hidden",
                        label: "",
                        defaultValue: account.dealer_slug || "",
                      },
                      {
                        name: "identitySub",
                        type: "hidden",
                        label: "",
                        defaultValue: account.identity_sub || "",
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
