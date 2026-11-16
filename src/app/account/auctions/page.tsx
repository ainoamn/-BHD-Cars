import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { resolvePortalViewer } from "@/lib/portal/access";
import { listPersonalListings } from "@/lib/portal/store";
import { listBidsForUser } from "@/lib/auctions/store";

export const dynamic = "force-dynamic";

export default async function AccountAuctionsPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return null;

  const listings = await listPersonalListings(result.viewer.session.sub);
  const bids = await listBidsForUser(result.viewer.session.sub);
  const published = listings.filter((row) => row.status === "published" || row.status === "draft");

  return (
    <div>
      <AdminPageHeader
        title={ar ? "مزاداتي" : "My auctions"}
        lead={
          ar
            ? "مزايداتك ولوحات طرح مركبة في المزاد — أفضل من لوحة عقارية عامة."
            : "Your bids and vehicle-to-auction listings — sharper than a generic property board."
        }
        actions={<Link href="/auctions">{ar ? "لوحة المزادات" : "Auction board"}</Link>}
      />

      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "طرح مركبة في المزاد" : "List a vehicle for auction"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          {published.length === 0 ? (
            <div className="admin-empty" style={{ textAlign: "start" }}>
              {ar ? (
                <>
                  أضف مركبة أولاً من{" "}
                  <Link href="/account/listings#add-vehicle">مركباتي</Link> ثم ارجع لطرحها في المزاد.
                </>
              ) : (
                <>
                  Add a vehicle from <Link href="/account/listings#add-vehicle">My vehicles</Link> first, then list it
                  here.
                </>
              )}
            </div>
          ) : (
            <AdminActionForm
              action="/api/portal/auctions"
              method="POST"
              submitLabel={ar ? "طرح في المزاد" : "List for auction"}
              fields={[
                {
                  name: "listingId",
                  label: ar ? "المركبة" : "Vehicle",
                  type: "select",
                  required: true,
                  options: published.map((row) => ({
                    value: row.id,
                    label: ar ? row.title_ar : row.title_en,
                  })),
                },
                {
                  name: "openingOmr",
                  label: ar ? "افتتاح (ر.ع)" : "Opening (OMR)",
                  type: "number",
                  defaultValue: Number(published[0]?.price_omr || 0),
                  required: true,
                },
                {
                  name: "incrementOmr",
                  label: ar ? "الخطوة" : "Increment",
                  type: "number",
                  defaultValue: 50,
                  required: true,
                },
                {
                  name: "reserveOmr",
                  label: ar ? "السعر السري (اختياري)" : "Reserve (optional)",
                  type: "number",
                },
                {
                  name: "startsAt",
                  label: ar ? "يبدأ" : "Starts",
                  type: "text",
                  defaultValue: new Date().toISOString().slice(0, 16),
                  required: true,
                },
                {
                  name: "endsAt",
                  label: ar ? "ينتهي" : "Ends",
                  type: "text",
                  defaultValue: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
                  required: true,
                },
              ]}
            />
          )}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? `مزايداتي (${bids.length})` : `My bids (${bids.length})`}</h2>
        </div>
        {bids.length === 0 ? (
          <div className="admin-empty">{ar ? "لا مزايدات بعد." : "No bids yet."}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ar ? "اللوت" : "Lot"}</th>
                <th>{ar ? "المبلغ" : "Amount"}</th>
                <th>{ar ? "حالة اللوت" : "Lot status"}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bids.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{ar ? row.title_ar : row.title_en}</strong>
                  </td>
                  <td>{Number(row.amount_omr).toLocaleString()} OMR</td>
                  <td>{row.lot_status}</td>
                  <td>
                    <Link href={`/auctions/${row.slug}`}>{ar ? "فتح" : "Open"}</Link>
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
