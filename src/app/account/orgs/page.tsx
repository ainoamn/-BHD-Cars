import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SwitchOrgButton } from "@/components/portal/switch-org-button";
import { resolvePortalViewer } from "@/lib/portal/access";

export const dynamic = "force-dynamic";

export default async function AccountOrgsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return null;
  const orgs = result.viewer.memberships.filter((row) => row.status === "active");

  return (
    <div>
      <AdminPageHeader
        title={ar ? "معارضي وشركاتي" : "My dealers & companies"}
        lead={ar ? "العضويات المرتبطة بحسابك فقط." : "Memberships linked to your account only."}
        actions={<Link href="/portal">{ar ? "مركز المساحات" : "Space hub"}</Link>}
      />
      <div className="admin-panel">
        {orgs.length === 0 ? (
          <div className="admin-empty">
            {ar ? "لا عضويات بعد." : "No memberships yet."}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "المنشأة" : "Organization"}</th>
                <th>{ar ? "الدور" : "Role"}</th>
                <th>{ar ? "الصلاحيات" : "Scopes"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.org_id}>
                  <td>
                    <strong>{ar ? org.org_name_ar : org.org_name_en}</strong>
                    <div style={{ color: "#5f736c", fontSize: "0.72rem" }}>{org.org_kind}</div>
                  </td>
                  <td>{org.role}</td>
                  <td style={{ fontSize: "0.75rem" }}>{(org.scopes || []).join(", ")}</td>
                  <td>
                    <SwitchOrgButton orgId={org.org_id} label={ar ? "مساحة العمل" : "Workspace"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
