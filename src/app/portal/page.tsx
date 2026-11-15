import Link from "next/link";
import { cookies } from "next/headers";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolvePortalViewer } from "@/lib/portal/access";
import { SwitchOrgButton } from "@/components/portal/switch-org-button";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function PortalChooserPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") {
    return <PortalGate locale={ar ? "ar" : "en"} reason={result.kind} />;
  }

  const { session, memberships } = result.viewer;
  const orgs = memberships.filter((row) => row.status === "active");

  return (
    <div className="admin-gate">
      <div className="admin-gate__card" style={{ width: "min(560px, 100%)", textAlign: "start" }}>
        <p className="admin-eyebrow">BHD CARS · PORTAL</p>
        <h1 style={{ textAlign: "center" }}>{ar ? "اختر مساحة التحكم" : "Choose your control space"}</h1>
        <p style={{ textAlign: "center" }}>
          {ar ? `مرحبًا ${session.name}` : `Welcome ${session.name}`}
        </p>

        <div className="admin-panel" style={{ marginTop: "1.25rem" }}>
          <div className="admin-panel__head">
            <h2>{ar ? "حساب المستخدم" : "Personal account"}</h2>
          </div>
          <div style={{ padding: "1rem" }}>
            <p className="admin-card__hint">
              {ar
                ? "مركباتك الشخصية وطلباتك فقط — معزولة عن بيانات المعارض."
                : "Your personal vehicles and requests only — isolated from dealer data."}
            </p>
            <div className="admin-actions" style={{ marginTop: "0.85rem" }}>
              <Link className="primary" href="/account">
                {ar ? "فتح لوحة المستخدم" : "Open user desk"}
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-panel" style={{ marginTop: "1rem" }}>
          <div className="admin-panel__head">
            <h2>{ar ? "المعارض والشركات" : "Dealers & companies"}</h2>
          </div>
          {orgs.length === 0 ? (
            <div className="admin-empty">
              {ar
                ? "لست عضوًا في أي معرض بعد. اطلب دعوة من المالك."
                : "You are not a member of any dealership yet. Ask an owner for an invite."}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{ar ? "المنشأة" : "Organization"}</th>
                  <th>{ar ? "الدور" : "Role"}</th>
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
                    <td>
                      <SwitchOrgButton
                        orgId={org.org_id}
                        label={ar ? "دخول" : "Enter"}
                        next="/workspace"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
