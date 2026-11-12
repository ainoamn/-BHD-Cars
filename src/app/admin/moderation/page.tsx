import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { cars } from "@/lib/data";
import { listListingControls, listSupportTickets } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminModerationPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const controls = await listListingControls();
  const tickets = await listSupportTickets();
  const queue = controls.filter((row) => row.status === "flagged" || row.status === "held");
  const reports = tickets.filter((row) => row.category === "moderation" || row.status === "open");

  return (
    <div>
      <AdminPageHeader
        actions={<Link href="/admin/listings">{ar ? "كل الإعلانات" : "All listings"}</Link>}
      />
      <div className="admin-grid" style={{ marginBottom: "1rem" }}>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "بانتظار المراجعة" : "Awaiting review"}</p>
          <p className="admin-card__value">{queue.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "بلاغات مفتوحة" : "Open reports"}</p>
          <p className="admin-card__value">{reports.length}</p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "طابور الإعلانات" : "Listing queue"}</h2>
        </div>
        {queue.length === 0 ? (
          <div className="admin-empty">{ar ? "لا عناصر معلّقة." : "No held items."}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "الإعلان" : "Listing"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
                <th>{ar ? "ملاحظة" : "Note"}</th>
                <th>{ar ? "إجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((row) => {
                const car = cars.find((item) => item.slug === row.slug);
                return (
                  <tr key={row.slug}>
                    <td>
                      <Link href={`/admin/listings/${row.slug}`}>
                        {car ? (ar ? car.title.ar : car.title.en) : row.slug}
                      </Link>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--warn">{row.status}</span>
                    </td>
                    <td>{row.notes || "—"}</td>
                    <td>
                      <AdminActionForm
                        action="/api/admin/listings"
                        submitLabel={ar ? "نشر" : "Publish"}
                        fields={[
                          { name: "slug", type: "hidden", label: "", defaultValue: row.slug },
                          { name: "status", type: "hidden", label: "", defaultValue: "published" },
                          { name: "notes", type: "hidden", label: "", defaultValue: "cleared in moderation" },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "بلاغات مرتبطة" : "Linked reports"}</h2>
          <Link href="/admin/support">{ar ? "الدعم" : "Support"}</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الموضوع" : "Subject"}</th>
              <th>{ar ? "الحالة" : "Status"}</th>
              <th>{ar ? "مرتبط" : "Related"}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.subject}</td>
                <td>{ticket.status}</td>
                <td>
                  {ticket.related_slug ? (
                    <Link href={`/admin/listings/${ticket.related_slug}`}>{ticket.related_slug}</Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
