import { AdminDeskPage } from "@/components/admin/admin-desk";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <AdminDeskPage
      leadAr="حسابات المنصة: مشترو السوق، بائعو الأفراد، ومشغّلو المعارض."
      leadEn="Platform accounts: market buyers, private sellers, and dealer operators."
      panels={[
        {
          titleAr: "الأعضاء",
          titleEn: "Members",
          bodyAr: "بحث وتعليق وإعادة تفعيل حسابات الهوية المرتبطة بسيارات BHD.",
          bodyEn: "Search, suspend, and restore identity accounts linked to BHD Cars.",
          statusAr: "يحتاج SSO + قاعدة مستخدمين",
          statusEn: "Needs SSO + user DB",
        },
        {
          titleAr: "حسابات المعارض",
          titleEn: "Dealer accounts",
          bodyAr: "ربط مستخدمي المعرض بالملف التجاري والصلاحيات داخل المعرض.",
          bodyEn: "Bind dealer users to the commercial profile and in-house roles.",
          href: "/admin/dealers",
          ctaAr: "المعارض",
          ctaEn: "Dealers",
        },
        {
          titleAr: "التوثيق",
          titleEn: "Verification",
          bodyAr: "مراجعة الهوية المدنية وبيانات التواصل قبل فتح البيع.",
          bodyEn: "Review civil ID and contact details before enabling selling.",
          statusAr: "طابور لاحق",
          statusEn: "Queue later",
        },
      ]}
      columns={[
        { key: "name", ar: "الاسم", en: "Name" },
        { key: "email", ar: "البريد", en: "Email" },
        { key: "kind", ar: "النوع", en: "Kind" },
        { key: "status", ar: "الحالة", en: "Status" },
      ]}
      rows={[]}
    />
  );
}
