import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolvePortalViewer } from "@/lib/portal/access";
import { ACCOUNT_NAV } from "@/lib/portal/nav";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "حسابي", template: "%s · حسابي · BHD Cars" },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const locale = jar.get("bhd_locale")?.value === "en" ? "en" : "ar";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") {
    return <PortalGate locale={locale} reason={result.kind} />;
  }

  return (
    <PortalChrome
      kind="account"
      titleAr="تحكم المستخدم"
      titleEn="User control"
      subtitle={result.viewer.session.email}
      nav={ACCOUNT_NAV}
      scopes={["all"]}
      roleLabel={locale === "ar" ? "حساب شخصي" : "Personal"}
    >
      {children}
    </PortalChrome>
  );
}
