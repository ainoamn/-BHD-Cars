import { headers } from "next/headers";
import { SiteControlBanner } from "@/components/site-control-banner";
import { loadSiteBundle } from "@/lib/admin/store";

export async function SiteRuntime({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isApi = pathname.startsWith("/api/");

  if (isApi) return <>{children}</>;

  const bundle = await loadSiteBundle();
  if (bundle.maintenance.enabled && !isAdmin) {
    return <SiteControlBanner />;
  }

  return (
    <>
      {!isAdmin ? <SiteControlBanner /> : null}
      {children}
    </>
  );
}
