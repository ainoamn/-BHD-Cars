import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolveWorkspaceAccess } from "@/lib/portal/access";
import { WORKSPACE_NAV } from "@/lib/portal/nav";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "مساحة العمل", template: "%s · مساحة العمل · BHD Cars" },
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const locale = jar.get("bhd_locale")?.value === "en" ? "en" : "ar";
  const result = await resolveWorkspaceAccess();

  if (result.kind === "login" || result.kind === "auth-config") {
    return <PortalGate locale={locale} reason={result.kind} />;
  }
  if (result.kind === "no-org") {
    return <PortalGate locale={locale} reason="no-org" />;
  }
  if (result.kind === "forbidden") {
    return <PortalGate locale={locale} reason="forbidden" />;
  }

  const membership = result.membership;
  const orgName =
    locale === "ar" ? membership.org_name_ar || membership.org_id : membership.org_name_en || membership.org_id;

  return (
    <PortalChrome
      kind="workspace"
      titleAr="تحكم المعرض / الشركة"
      titleEn="Dealer / company control"
      subtitle={orgName || membership.org_id}
      nav={WORKSPACE_NAV}
      scopes={membership.role === "owner" || membership.role === "admin" ? ["all"] : membership.scopes}
      roleLabel={
        membership.role === "owner"
          ? locale === "ar"
            ? "مالك"
            : "Owner"
          : membership.role === "admin"
            ? locale === "ar"
              ? "مدير"
              : "Admin"
            : locale === "ar"
              ? "موظف"
              : "Staff"
      }
    >
      <div className="admin-banner admin-banner--info" style={{ marginBottom: "1rem" }}>
        {locale === "ar"
          ? "البيانات معزولة لهذه المنشأة فقط — لا تظهر مركبات أو طلبات منشآت أخرى."
          : "Data is isolated to this organization only — other orgs’ vehicles and requests never appear."}
      </div>
      {children}
    </PortalChrome>
  );
}
