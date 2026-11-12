import { AdminDeskPage } from "@/components/admin/admin-desk";
import { adminEmailAllowlist, adminSubAllowlist } from "@/lib/admin/access";

export const dynamic = "force-dynamic";

export default function AdminDelegatesPage() {
  const emails = adminEmailAllowlist();
  const subs = adminSubAllowlist();

  return (
    <AdminDeskPage
      leadAr="تفويض من يدير لوحة التحكم وما يُسمح له بفتحه من الأقسام."
      leadEn="Who may run the control desk and which sections they can open."
      panels={[
        {
          titleAr: "مالكو الموقع (بيئة)",
          titleEn: "Site owners (env)",
          bodyAr: emails.length
            ? `${emails.length} بريد في SITE_ADMIN_EMAILS.`
            : "لا بريد في SITE_ADMIN_EMAILS بعد.",
          bodyEn: emails.length
            ? `${emails.length} email(s) in SITE_ADMIN_EMAILS.`
            : "No emails in SITE_ADMIN_EMAILS yet.",
          statusAr: "قائمة بيئة فقط",
          statusEn: "Env allowlist only",
        },
        {
          titleAr: "معرّفات الهوية",
          titleEn: "Identity subjects",
          bodyAr: subs.length
            ? `${subs.length} معرّف في SITE_ADMIN_SUBS.`
            : "لا معرّفات في SITE_ADMIN_SUBS.",
          bodyEn: subs.length
            ? `${subs.length} subject(s) in SITE_ADMIN_SUBS.`
            : "No subjects in SITE_ADMIN_SUBS.",
          statusAr: "قائمة بيئة فقط",
          statusEn: "Env allowlist only",
        },
        {
          titleAr: "صلاحيات الأقسام",
          titleEn: "Section scopes",
          bodyAr: "سوق · تشغيل · شركاء · اشتراكات · أعضاء · مدفوعات · محاسبة · تفويض.",
          bodyEn: "Market · ops · partners · plans · users · payments · accounting · delegates.",
          statusAr: "يتطلب قاعدة بيانات",
          statusEn: "Needs database",
        },
      ]}
      columns={[
        { key: "email", ar: "البريد", en: "Email" },
        { key: "role", ar: "الدور", en: "Role" },
        { key: "scopes", ar: "الصلاحيات", en: "Scopes" },
        { key: "status", ar: "الحالة", en: "Status" },
      ]}
      rows={emails.map((email) => ({
        id: email,
        email,
        role: "root",
        scopes: "all",
        status: "env",
      }))}
    />
  );
}
