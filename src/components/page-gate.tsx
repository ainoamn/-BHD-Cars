import Link from "next/link";
import { cookies } from "next/headers";
import { isPageEnabled } from "@/components/site-control-banner";

export async function PageGate({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) {
  const enabled = await isPageEnabled(page);
  if (enabled) return <>{children}</>;

  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";

  return (
    <div className="page-wrap py-16 text-center">
      <h1 className="text-2xl font-bold">{ar ? "هذه الصفحة متوقفة مؤقتًا" : "This page is temporarily off"}</h1>
      <p className="mt-3 text-sm opacity-70">
        {ar
          ? "أوقفها مالك الموقع من إعدادات الموقع."
          : "The site owner turned this page off in site settings."}
      </p>
      <Link href="/" className="mt-6 inline-block underline">
        {ar ? "العودة للرئيسية" : "Back home"}
      </Link>
    </div>
  );
}
