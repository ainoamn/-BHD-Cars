import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { AdminChrome } from "@/components/admin/admin-chrome";
import { AdminGate } from "@/components/admin/admin-gate";
import { readAdminSession, resolveAdminAccessOrDev } from "@/lib/admin/access";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  title: {
    default: "تحكم الموقع والنظام",
    template: "%s · تحكم الموقع · BHD Cars",
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const locale = jar.get("bhd_locale")?.value === "en" ? "en" : "ar";
  const result = await resolveAdminAccessOrDev();

  if (result.kind !== "ok") {
    const session = result.kind === "forbidden" ? await readAdminSession() : null;
    return (
      <AdminGate
        locale={locale}
        reason={result.kind}
        accountHint={session ? `${session.email} · ${session.sub}` : undefined}
      />
    );
  }

  return (
    <Suspense fallback={<div className="admin-gate">…</div>}>
      <AdminChrome access={result.access} locale={locale} allowlistMissing={result.allowlistMissing}>
        {children}
      </AdminChrome>
    </Suspense>
  );
}
