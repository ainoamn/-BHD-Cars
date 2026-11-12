import Link from "next/link";
import { cookies } from "next/headers";
import { loadSiteBundle } from "@/lib/admin/store";

export async function SiteControlBanner() {
  const bundle = await loadSiteBundle();
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  if (bundle.maintenance.enabled) {
    return (
      <div className="site-maintenance">
        <div className="site-maintenance__card">
          <p className="admin-eyebrow">BHD CARS</p>
          <h1>{ar ? "الموقع تحت الصيانة" : "Site under maintenance"}</h1>
          <p>{ar ? bundle.maintenance.messageAr : bundle.maintenance.messageEn}</p>
          <div className="admin-actions" style={{ justifyContent: "center", marginTop: "1rem" }}>
            <Link href="/admin">{ar ? "تحكم الموقع" : "Site control"}</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!bundle.notice.enabled) return null;
  const text = ar ? bundle.notice.messageAr : bundle.notice.messageEn;
  if (!text.trim()) return null;

  return <div className="site-notice">{text}</div>;
}

export async function isPageEnabled(page: string) {
  const bundle = await loadSiteBundle();
  if (bundle.pages[page] === undefined) return true;
  return Boolean(bundle.pages[page]);
}
