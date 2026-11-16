import { headers } from "next/headers";
import { SiteControlBanner } from "@/components/site-control-banner";
import { loadSiteBundle } from "@/lib/admin/store";

export async function SiteRuntime({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "/";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isPortal =
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/workspace" ||
    pathname.startsWith("/workspace/") ||
    pathname === "/portal" ||
    pathname.startsWith("/portal/");
  const isApi = pathname.startsWith("/api/");

  if (isApi) return <>{children}</>;

  // Cached per-request + across requests (30s). Never hang the whole shell on Neon.
  const bundle = await loadSiteBundle();
  if (bundle.maintenance.enabled && !isAdmin && !isPortal) {
    return <SiteControlBanner bundle={bundle} />;
  }

  return (
    <>
      {!isAdmin && !isPortal ? <SiteControlBanner bundle={bundle} /> : null}
      {children}
    </>
  );
}
