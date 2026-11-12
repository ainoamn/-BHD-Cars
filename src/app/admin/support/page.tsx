import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { listSupportTickets } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const tickets = await listSupportTickets();

  return (
    <div>
      <AdminPageHeader
        actions={<Link href="/admin/moderation">{ar ? "مراجعة المحتوى" : "Moderation"}</Link>}
      />
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `التذاكر (${tickets.length})` : `Tickets (${tickets.length})`}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الموضوع" : "Subject"}</th>
              <th>{ar ? "الأولوية" : "Priority"}</th>
              <th>{ar ? "الفئة" : "Category"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "تحديث" : "Update"}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <strong>{ticket.subject}</strong>
                  <div style={{ color: "#5f736c", fontSize: "0.72rem" }}>
                    {ticket.contact_name} · {ticket.contact_email}
                  </div>
                  {ticket.related_slug ? (
                    <div style={{ marginTop: "0.25rem" }}>
                      <Link href={`/admin/listings/${ticket.related_slug}`}>{ticket.related_slug}</Link>
                    </div>
                  ) : null}
                </td>
                <td>{ticket.priority}</td>
                <td>{ticket.category}</td>
                <td>
                  <span className={`admin-badge admin-badge--${ticket.status === "open" ? "warn" : "ready"}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <AdminActionForm
                    action="/api/admin/support"
                    submitLabel={ar ? "حفظ" : "Save"}
                    fields={[
                      { name: "id", type: "hidden", label: "", defaultValue: ticket.id },
                      {
                        name: "status",
                        label: ar ? "الحالة" : "Status",
                        type: "select",
                        defaultValue: ticket.status,
                        options: [
                          { value: "open", label: "open" },
                          { value: "pending", label: "pending" },
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
