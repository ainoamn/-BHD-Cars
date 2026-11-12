import Link from "next/link";
import { adminLoginHref } from "@/lib/admin/access";

export function AdminGate({
  locale,
  reason,
}: {
  locale: "ar" | "en";
  reason: "login" | "forbidden" | "auth-config";
}) {
  const ar = locale === "ar";
  const copy = {
    login: {
      title: ar ? "دخول تحكم الموقع" : "Sign in to site control",
      body: ar
        ? "لوحة التحكم محمية بهوية BHD. سجّل الدخول بالحساب المخوَّل ثم عد إلى /admin."
        : "The control desk is protected by BHD Identity. Sign in with an authorized account, then return to /admin.",
      cta: ar ? "دخول عبر BHD" : "Sign in with BHD",
      href: adminLoginHref("/admin"),
    },
    forbidden: {
      title: ar ? "لا صلاحية لهذه اللوحة" : "No access to this console",
      body: ar
        ? "الحساب مسجّل لكن غير مدرج في SITE_ADMIN_EMAILS / SITE_ADMIN_SUBS."
        : "You are signed in, but this account is not listed in SITE_ADMIN_EMAILS / SITE_ADMIN_SUBS.",
      cta: ar ? "العودة للسوق" : "Back to market",
      href: "/",
    },
    "auth-config": {
      title: ar ? "إعداد المصادقة ناقص" : "Auth is not configured",
      body: ar
        ? "يلزم AUTH_SECRET وإعداد عميل BHD OAuth قبل فتح لوحة التحكم."
        : "AUTH_SECRET and BHD OAuth client settings are required before opening the console.",
      cta: ar ? "العودة للسوق" : "Back to market",
      href: "/",
    },
  }[reason];

  return (
    <div className="admin-gate">
      <div className="admin-gate__card">
        <p className="admin-eyebrow">BHD CARS · ADMIN</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="admin-actions" style={{ justifyContent: "center", marginTop: "1.1rem" }}>
          <Link className="primary" href={copy.href}>
            {copy.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
