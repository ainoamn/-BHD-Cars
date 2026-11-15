import Link from "next/link";
import { portalLoginHref } from "@/lib/portal/access";

export function PortalGate({
  locale,
  reason,
}: {
  locale: "ar" | "en";
  reason: "login" | "auth-config" | "no-org" | "forbidden";
}) {
  const ar = locale === "ar";
  const copy = {
    login: {
      title: ar ? "دخول حسابك" : "Sign in to your account",
      body: ar
        ? "لوحة المستخدم والمعرض محمية بهوية BHD."
        : "User and dealer desks are protected by BHD Identity.",
      cta: ar ? "دخول عبر BHD" : "Sign in with BHD",
      href: portalLoginHref("/portal"),
    },
    "auth-config": {
      title: ar ? "المصادقة غير جاهزة" : "Auth is not ready",
      body: ar ? "يلزم إعداد AUTH_SECRET وعميل BHD." : "AUTH_SECRET and BHD OAuth are required.",
      cta: ar ? "العودة" : "Back",
      href: "/",
    },
    "no-org": {
      title: ar ? "لا يوجد معرض مرتبط" : "No linked dealership",
      body: ar
        ? "حسابك شخصي فقط. يمكنك إدارة مركباتك من لوحة المستخدم، أو اطلب دعوة من معرض."
        : "This is a personal account only. Manage your vehicles from the user desk, or wait for a dealer invite.",
      cta: ar ? "لوحة المستخدم" : "User desk",
      href: "/account",
    },
    forbidden: {
      title: ar ? "لا صلاحية لهذا القسم" : "No permission for this section",
      body: ar
        ? "المالك أو المدير لم يمنحك صلاحية هذا الجزء."
        : "The owner or admin did not grant this section.",
      cta: ar ? "العودة لمساحة العمل" : "Back to workspace",
      href: "/workspace",
    },
  }[reason];

  return (
    <div className="admin-gate">
      <div className="admin-gate__card">
        <p className="admin-eyebrow">BHD CARS · PORTAL</p>
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
