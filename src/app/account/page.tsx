import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { resolvePortalViewer } from "@/lib/portal/access";
import { listPersonalListings, listPersonalRequests } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") return null;

  const listings = await listPersonalListings(result.viewer.session.sub);
  const requests = await listPersonalRequests(result.viewer.session.sub);
  const orgs = result.viewer.memberships.filter((row) => row.status === "active");

  return (
    <div>
      <AdminPageHeader
        title={ar ? "لوحة المستخدم" : "User desk"}
        lead={ar ? "بياناتك الشخصية فقط — معزولة عن أي معرض." : "Your personal data only — isolated from any dealership."}
        actions={
          <>
            <Link href="/account/listings">{ar ? "مركباتي" : "My vehicles"}</Link>
            <Link href="/account/auctions">{ar ? "مزاداتي" : "My auctions"}</Link>
            <Link className="primary" href="/account/listings#add-vehicle">
              {ar ? "إضافة مركبة" : "Add vehicle"}
            </Link>
          </>
        }
      />
      <div className="admin-grid">
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "مركباتي" : "My vehicles"}</p>
          <p className="admin-card__value">{listings.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "طلباتي" : "My requests"}</p>
          <p className="admin-card__value">{requests.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "عضويات المنشآت" : "Org memberships"}</p>
          <p className="admin-card__value">{orgs.length}</p>
        </div>
      </div>
      <div className="admin-panel" style={{ marginTop: "1rem" }}>
        <div className="admin-panel__head">
          <h2>{ar ? "عزل الحساب" : "Account isolation"}</h2>
        </div>
        <div className="admin-empty" style={{ textAlign: "start" }}>
          {ar
            ? `المعرّف: ${result.viewer.session.sub} · البريد: ${result.viewer.session.email}. الاستعلامات مقيّدة بـ owner_user_id الخاص بك فقط.`
            : `ID: ${result.viewer.session.sub} · Email: ${result.viewer.session.email}. Queries are constrained to your owner_user_id only.`}
        </div>
      </div>
    </div>
  );
}
