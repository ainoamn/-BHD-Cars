import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { auctions, cars, sellers } from "@/lib/data";
import {
  billingPulse,
  listListingControls,
  listServiceRequests,
  listSupportTickets,
  loadSiteBundle,
} from "@/lib/admin/store";
import { databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const db = databaseConfigured();
  const site = db ? await loadSiteBundle() : null;
  const controls = db ? await listListingControls() : [];
  const requests = db ? await listServiceRequests() : [];
  const tickets = db ? await listSupportTickets() : [];
  const pulse = db
    ? await billingPulse()
    : { plans: 0, activeSubs: 0, mrr: 0, enabledGateways: 0, openBalance: 0 };

  const held = controls.filter((row) => row.status === "held" || row.status === "flagged").length;
  const openRequests = requests.filter((row) => row.status === "new" || row.status === "assigned").length;
  const openTickets = tickets.filter((row) => row.status === "open").length;

  return (
    <div>
      <AdminPageHeader
        actions={
          <>
            <Link href="/admin/settings">{ar ? "إعدادات الموقع" : "Site settings"}</Link>
            <Link className="primary" href="/cars">
              {ar ? "فتح السوق" : "Open market"}
            </Link>
          </>
        }
      />

      <div className={`admin-banner ${db ? "admin-banner--info" : ""}`}>
        {db
          ? ar
            ? "لوحة تشغيل حية مرتبطة بقاعدة Neon. غيّر الإعدادات والحالات من الأقسام أدناه."
            : "Live control desk on Neon. Change settings and statuses from the sections below."
          : ar
            ? "DATABASE_URL غير مضبوط — اللوحة تعمل بوضع عرض فقط."
            : "DATABASE_URL missing — console is read-only demo mode."}
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "إعلانات الكتالوج" : "Catalog listings"}</p>
          <p className="admin-card__value">{cars.length}</p>
          <p className="admin-card__hint">
            {ar ? `${held} بانتظار مراجعة` : `${held} awaiting review`}
          </p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "مزادات" : "Auctions"}</p>
          <p className="admin-card__value">{auctions.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "طلبات مفتوحة" : "Open requests"}</p>
          <p className="admin-card__value">{openRequests}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "تذاكر دعم" : "Support tickets"}</p>
          <p className="admin-card__value">{openTickets}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">MRR</p>
          <p className="admin-card__value">{pulse.mrr.toLocaleString()}</p>
          <p className="admin-card__hint">
            {ar ? `${pulse.activeSubs} اشتراك نشط` : `${pulse.activeSubs} active subs`}
          </p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "صيانة الموقع" : "Maintenance"}</p>
          <p className="admin-card__value" style={{ fontSize: "1.1rem" }}>
            {site?.maintenance.enabled ? (ar ? "مفعّل" : "ON") : ar ? "متوقف" : "OFF"}
          </p>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "اختصارات التشغيل" : "Ops shortcuts"}</h2>
        </div>
        <div className="admin-actions" style={{ padding: "1rem" }}>
          <Link href="/admin/listings">{ar ? "الإعلانات" : "Listings"}</Link>
          <Link href="/admin/moderation">{ar ? "المراجعة" : "Moderation"}</Link>
          <Link href="/admin/requests">{ar ? "الطلبات" : "Requests"}</Link>
          <Link href="/admin/support">{ar ? "الدعم" : "Support"}</Link>
          <Link href="/admin/dealers">{ar ? "المعارض" : "Dealers"}</Link>
          <Link href="/admin/plans">{ar ? "الاشتراكات" : "Subscriptions"}</Link>
          <Link href="/admin/delegates">{ar ? "الصلاحيات" : "Permissions"}</Link>
          <Link href="/admin/payments">{ar ? "المدفوعات" : "Payments"}</Link>
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "أحدث الإعلانات" : "Latest listings"}</h2>
          <Link href="/admin/listings">{ar ? "الكل" : "View all"}</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>{ar ? "الإعلان" : "Listing"}</th>
              <th>{ar ? "السعر" : "Price"}</th>
              <th>{ar ? "البائع" : "Seller"}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cars.slice(0, 6).map((car) => (
              <tr key={car.slug}>
                <td>
                  <strong>{ar ? car.title.ar : car.title.en}</strong>
                </td>
                <td>{car.priceOmr.toLocaleString()} OMR</td>
                <td>
                  <Link href={`/admin/dealers/${car.seller}`}>{car.seller}</Link>
                </td>
                <td>
                  <Link href={`/admin/listings/${car.slug}`}>{ar ? "إدارة" : "Manage"}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="admin-card__hint" style={{ marginTop: "1rem" }}>
        {ar ? `معارض في الكتالوج: ${sellers.length}` : `Catalog sellers: ${sellers.length}`}
      </p>
    </div>
  );
}
