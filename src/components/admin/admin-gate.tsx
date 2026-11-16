import Link from "next/link";
import { adminLoginHref } from "@/lib/admin/access";

export function AdminGate({
  locale,
  reason,
  accountHint,
}: {
  locale: "ar" | "en";
  reason: "login" | "forbidden" | "auth-config";
  accountHint?: string;
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

  const market = ar ? "العودة للسوق" : "Back to market";

  return (
    <div className="portal-entrance">
      <div className="portal-entrance__stage">
        <img className="portal-entrance__mark" src="/brand/bhd-mark.svg" alt="BHD" />
        <p className="portal-entrance__house">Bin Hamood</p>
        <p className="portal-entrance__product">Site Control</p>
        <span className="portal-entrance__rule" aria-hidden />
        <h1>{copy.title}</h1>
        <p className="portal-entrance__lead">{copy.body}</p>
        {accountHint ? <p className="portal-entrance__hint">{accountHint}</p> : null}
        <div className="portal-entrance__actions">
          <Link className="portal-entrance__cta" href={copy.href}>
            {copy.cta}
          </Link>
          {copy.href !== "/" ? (
            <Link className="portal-entrance__quiet" href="/">
              {market}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
