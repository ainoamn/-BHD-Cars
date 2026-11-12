import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listPartnerOrgs, listServiceRequests } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminDispatchPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const requests = await listServiceRequests();
  const partners = await listPartnerOrgs();
  const open = requests.filter((row) => row.status === "new" || row.status === "assigned");

  const byKind = partners.reduce<Record<string, typeof partners>>((acc, partner) => {
    acc[partner.kind] = acc[partner.kind] || [];
    acc[partner.kind].push(partner);
    return acc;
  }, {});

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/requests">{ar ? "الطلبات" : "Requests"}</Link>
            <Link href="/admin/partners">{ar ? "الشركاء" : "Partners"}</Link>
          </>
        }
      />
      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "طابور مفتوح" : "Open queue"}</p>
          <p className="admin-card__value">{open.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "شركاء نشطون" : "Active partners"}</p>
          <p className="admin-card__value">
            {partners.filter((partner) => partner.status === "active").length}
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "الإسناد حسب النوع" : "Capacity by kind"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الخدمة" : "Service"}</th>
              <th>{ar ? "شركاء" : "Partners"}</th>
              <th>{ar ? "طلبات مفتوحة" : "Open requests"}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(byKind).map((kind) => (
              <tr key={kind}>
                <td>{kind}</td>
                <td>{byKind[kind].map((partner) => (ar ? partner.name_ar : partner.name_en)).join(" · ")}</td>
                <td>{open.filter((row) => row.kind === kind).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "بانتظار الإسناد" : "Awaiting assignment"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الطلب" : "Request"}</th>
              <th>{ar ? "النوع" : "Kind"}</th>
              <th>{ar ? "المسند" : "Assignee"}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {open.map((row) => (
              <tr key={row.id}>
                <td>{row.title}</td>
                <td>{row.kind}</td>
                <td>{row.assignee || "—"}</td>
                <td>
                  <Link href="/admin/requests">{ar ? "إدارة" : "Manage"}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
