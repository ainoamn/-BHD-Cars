import Link from "next/link";
import { cookies } from "next/headers";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { listOrgListings, listOrgMembers, listOrgRequests } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function WorkspaceOverviewPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolveWorkspaceAccess();
  if (result.kind !== "ok") return null;

  const orgId = result.membership.org_id;
  const [listings, requests, members] = await Promise.all([
    listOrgListings(orgId),
    listOrgRequests(orgId),
    listOrgMembers(orgId),
  ]);

  return (
    <div>
      <AdminPageHeader
        title={ar ? result.membership.org_name_ar : result.membership.org_name_en}
        lead={ar ? "مساحة المعرض/الشركة — بيانات هذه المنشأة فقط." : "Dealer/company workspace — this org only."}
        actions={
          <>
            <Link href="/workspace/team">{ar ? "الفريق" : "Team"}</Link>
            <Link className="primary" href="/workspace/listings">
              {ar ? "المركبات" : "Vehicles"}
            </Link>
          </>
        }
      />
      <div className="admin-grid">
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "مركبات المنشأة" : "Org vehicles"}</p>
          <p className="admin-card__value">{listings.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "طلبات" : "Requests"}</p>
          <p className="admin-card__value">{requests.length}</p>
        </div>
        <div className="admin-card">
          <p className="admin-card__label">{ar ? "أعضاء الفريق" : "Team members"}</p>
          <p className="admin-card__value">{members.length}</p>
        </div>
      </div>
    </div>
  );
}
