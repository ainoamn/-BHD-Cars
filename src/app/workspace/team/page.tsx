import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { canManageTeam, DEFAULT_STAFF_SCOPES, PORTAL_SCOPE_LABELS } from "@/lib/portal/scopes";
import { listOrgInvitations, listOrgMembers } from "@/lib/portal/store";
import { TeamRemoveButton } from "@/components/portal/team-remove-button";

export const dynamic = "force-dynamic";

export default async function WorkspaceTeamPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolveWorkspaceAccess("team.read");
  if (result.kind === "forbidden") return <PortalGate locale={ar ? "ar" : "en"} reason="forbidden" />;
  if (result.kind !== "ok") return null;

  const manage = canManageTeam(result.membership.role, result.membership.scopes);
  const members = await listOrgMembers(result.membership.org_id);
  const invites = manage ? await listOrgInvitations(result.membership.org_id) : [];
  const scopeHint = Object.entries(PORTAL_SCOPE_LABELS)
    .map(([id, label]) => `${id}=${ar ? label.ar : label.en}`)
    .join(" · ");

  return (
    <div>
      <AdminPageHeader
        title={ar ? "الفريق والصلاحيات" : "Team & permissions"}
        lead={
          ar
            ? "أضف موظفين وامنحهم صلاحيات محددة لإدارة مركبات ومنشأتك فقط."
            : "Add staff and grant scoped permissions to manage only this org’s vehicles and ops."
        }
      />

      {manage ? (
        <div className="admin-panel" style={{ marginBottom: "1rem" }}>
          <div className="admin-panel__head">
            <h2>{ar ? "دعوة موظف / مستخدم" : "Invite staff / user"}</h2>
          </div>
          <div style={{ padding: "1rem" }}>
            <AdminActionForm
              action="/api/portal/team"
              method="PUT"
              submitLabel={ar ? "إرسال الدعوة" : "Send invite"}
              fields={[
                { name: "email", label: "Email", required: true },
                {
                  name: "role",
                  label: ar ? "الدور" : "Role",
                  type: "select",
                  defaultValue: "staff",
                  options: [
                    { value: "staff", label: ar ? "موظف" : "staff" },
                    { value: "admin", label: ar ? "مدير" : "admin" },
                  ],
                },
                {
                  name: "scopes",
                  label: ar ? "الصلاحيات (مفصولة بفاصلة)" : "Scopes (comma-separated)",
                  defaultValue: DEFAULT_STAFF_SCOPES.join(","),
                  required: true,
                },
              ]}
            />
            <p className="admin-card__hint" style={{ marginTop: "0.75rem" }}>
              {scopeHint}
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-banner">
          {ar ? "عرض فقط — لا تملك صلاحية إدارة الفريق." : "Read-only — you cannot manage the team."}
        </div>
      )}

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "الأعضاء" : "Members"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الاسم" : "Name"}</th>
              <th>Email</th>
              <th>{ar ? "الدور" : "Role"}</th>
              <th>{ar ? "الصلاحيات" : "Scopes"}</th>
              {manage ? <th>{ar ? "تحديث" : "Update"}</th> : null}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={`${member.org_id}-${member.user_id}`}>
                <td>{member.name || "—"}</td>
                <td style={{ direction: "ltr" }}>{member.email}</td>
                <td>{member.role}</td>
                <td style={{ fontSize: "0.72rem" }}>{(member.scopes || []).join(", ")}</td>
                {manage ? (
                  <td>
                    {member.role === "owner" ? (
                      <span className="admin-badge admin-badge--muted">{ar ? "مالك" : "owner"}</span>
                    ) : (
                      <div style={{ display: "grid", gap: "0.45rem" }}>
                        <AdminActionForm
                          action="/api/portal/team"
                          submitLabel={ar ? "حفظ صلاحيات" : "Save scopes"}
                          fields={[
                            { name: "userId", type: "hidden", label: "", defaultValue: member.user_id },
                            {
                              name: "role",
                              label: ar ? "الدور" : "Role",
                              type: "select",
                              defaultValue: member.role,
                              options: [
                                { value: "staff", label: "staff" },
                                { value: "admin", label: "admin" },
                              ],
                            },
                            {
                              name: "scopes",
                              label: ar ? "صلاحيات" : "Scopes",
                              defaultValue: (member.scopes || []).join(","),
                            },
                          ]}
                        />
                        <TeamRemoveButton
                          userId={member.user_id}
                          label={ar ? "إزالة" : "Remove"}
                        />
                      </div>
                    )}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {manage ? (
        <div className="admin-panel">
          <div className="admin-panel__head">
            <h2>{ar ? "دعوات معلّقة" : "Pending invites"}</h2>
          </div>
          {invites.length === 0 ? (
            <div className="admin-empty">{ar ? "لا دعوات معلّقة." : "No pending invites."}</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>{ar ? "الدور" : "Role"}</th>
                  <th>{ar ? "الصلاحيات" : "Scopes"}</th>
                  <th>{ar ? "تنتهي" : "Expires"}</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id}>
                    <td style={{ direction: "ltr" }}>{invite.email}</td>
                    <td>{invite.role}</td>
                    <td style={{ fontSize: "0.72rem" }}>{(invite.scopes || []).join(", ")}</td>
                    <td>{invite.expires_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : null}
    </div>
  );
}
