import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { getOrg } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function WorkspaceSettingsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolveWorkspaceAccess("settings.read");
  if (result.kind === "forbidden") return <PortalGate locale={ar ? "ar" : "en"} reason="forbidden" />;
  if (result.kind !== "ok") return null;

  const org = await getOrg(result.membership.org_id);

  return (
    <div>
      <AdminPageHeader
        title={ar ? "إعدادات المنشأة" : "Organization settings"}
        lead={ar ? "ملف المعرض/الشركة الحالي." : "Current dealer/company profile."}
      />
      <div className="admin-panel">
        <table className="admin-table">
          <tbody>
            <tr>
              <th>{ar ? "المعرّف" : "ID"}</th>
              <td style={{ direction: "ltr" }}>{org?.id}</td>
            </tr>
            <tr>
              <th>{ar ? "النوع" : "Kind"}</th>
              <td>{org?.kind}</td>
            </tr>
            <tr>
              <th>{ar ? "الاسم" : "Name"}</th>
              <td>{ar ? org?.name_ar : org?.name_en}</td>
            </tr>
            <tr>
              <th>{ar ? "الحالة" : "Status"}</th>
              <td>{org?.status}</td>
            </tr>
            <tr>
              <th>{ar ? "دورك" : "Your role"}</th>
              <td>{result.membership.role}</td>
            </tr>
            <tr>
              <th>{ar ? "صلاحياتك" : "Your scopes"}</th>
              <td style={{ fontSize: "0.78rem" }}>
                {(result.membership.role === "owner" || result.membership.role === "admin"
                  ? ["all"]
                  : result.membership.scopes
                ).join(", ")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
