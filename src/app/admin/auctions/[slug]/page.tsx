import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminActionForm } from "@/components/admin/admin-action-form";
import { auctions } from "@/lib/data";
import { listAuctionControls } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export default async function AdminAuctionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lot = auctions.find((item) => item.slug === slug);
  if (!lot) notFound();
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const control = (await listAuctionControls()).find((row) => row.slug === slug);

  return (
    <div>
      <AdminPageHeader
        title={ar ? lot.title.ar : lot.title.en}
        actions={<Link href="/admin/auctions">{ar ? "كل المزادات" : "All auctions"}</Link>}
      />
      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "المزايدات" : "Bids"}</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "المزايد" : "Bidder"}</th>
              <th>{ar ? "المبلغ" : "Amount"}</th>
              <th>{ar ? "الوقت" : "When"}</th>
            </tr>
          </thead>
          <tbody>
            {lot.bids.map((bid, index) => (
              <tr key={`${bid.name}-${index}`}>
                <td>{bid.name}</td>
                <td>{bid.amountOmr.toLocaleString()} OMR</td>
                <td>{ar ? bid.ago.ar : bid.ago.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>{ar ? "حالة اللوت" : "Lot status"}</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          <AdminActionForm
            action="/api/admin/auctions"
            submitLabel={ar ? "حفظ" : "Save"}
            fields={[
              { name: "slug", type: "hidden", label: "", defaultValue: lot.slug },
              {
                name: "status",
                label: ar ? "الحالة" : "Status",
                type: "select",
                defaultValue: control?.status || "live",
                options: [
                  { value: "live", label: "live" },
                  { value: "paused", label: "paused" },
                  { value: "closed", label: "closed" },
                  { value: "awarded", label: "awarded" },
                ],
              },
              {
                name: "notes",
                label: ar ? "ملاحظات" : "Notes",
                type: "textarea",
                defaultValue: control?.notes || "",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
