import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminAccess } from "@/lib/admin/access";

export function AdminChrome({
  access,
  locale,
  children,
  allowlistMissing,
}: {
  access: AdminAccess;
  locale: "ar" | "en";
  children: React.ReactNode;
  allowlistMissing?: boolean;
}) {
  const ar = locale === "ar";
  return (
    <div className="site-admin-shell">
      <div className="site-admin-frame">
        <AdminNav
          name={access.session.name}
          email={access.session.email}
          roleLabel={ar ? "مالك الموقع" : "Site owner"}
        />
        <div className="site-admin-main">
          {allowlistMissing ? (
            <div className="admin-banner">
              {ar
                ? "بيئة تطوير: لم تُضبط SITE_ADMIN_EMAILS بعد. أضف البريد المسموح قبل الإنتاج."
                : "Development mode: SITE_ADMIN_EMAILS is empty. Set allowed emails before production."}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
