import Link from "next/link";
import { adminLoginHref } from "@/lib/admin/access";
import { PortalEntrance } from "@/components/portal/portal-entrance";

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
        ? "لوحة التحكم محمية بهوية BHD. سجّل الدخول بالحساب المخوَّل ثم عد إلى لوحة التحكم."
        : "The control desk is protected by BHD Identity. Sign in with an authorized account, then return to the console.",
      cta: ar ? "دخول عبر BHD" : "Sign in with BHD",
      href: adminLoginHref("/admin"),
    },
    forbidden: {
      title: ar ? "لا صلاحية لهذه اللوحة" : "No access to this console",
      body: ar
        ? "الحساب مسجّل لكن غير مدرج في قائمة التحكم."
        : "You are signed in, but this account is not on the control list.",
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
  const eyebrow = ar ? "BHD CARS · تحكم الموقع" : "BHD CARS · Site control";

  return (
    <PortalEntrance eyebrow={eyebrow} title={copy.title} lead={copy.body} hint={accountHint}>
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
    </PortalEntrance>
  );
}
