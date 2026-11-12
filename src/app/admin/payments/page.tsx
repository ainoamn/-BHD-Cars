import { AdminDeskPage } from "@/components/admin/admin-desk";

export const dynamic = "force-dynamic";

export default function AdminPaymentsPage() {
  return (
    <AdminDeskPage
      leadAr="بوابات الدفع وطرق التحصيل لاشتراكات المعارض ورسوم الخدمات."
      leadEn="Payment gateways and collection methods for dealer plans and service fees."
      panels={[
        {
          titleAr: "البوابات",
          titleEn: "Gateways",
          bodyAr: "تفعيل Thawani / بطاقات / تحويل بنكي حسب السوق.",
          bodyEn: "Enable Thawani / cards / bank transfer by market.",
          statusAr: "مفاتيح غير مربوطة",
          statusEn: "Keys unwired",
        },
        {
          titleAr: "طرق التحصيل",
          titleEn: "Methods",
          bodyAr: "ما يظهر للمعرض عند تجديد الباقة أو دفع العمولة.",
          bodyEn: "What dealers see when renewing a plan or paying commission.",
          statusAr: "واجهة لاحقة",
          statusEn: "UI later",
        },
        {
          titleAr: "الإحصائيات",
          titleEn: "Stats",
          bodyAr: "ربط المدفوعات الناجحة بإحصائيات الاشتراك.",
          bodyEn: "Tie successful charges to billing stats.",
          href: "/admin/billing",
          ctaAr: "الإحصائيات",
          ctaEn: "Billing stats",
        },
      ]}
      columns={[
        { key: "gateway", ar: "البوابة", en: "Gateway" },
        { key: "markets", ar: "الأسواق", en: "Markets" },
        { key: "status", ar: "الحالة", en: "Status" },
      ]}
      rows={[
        { id: "thawani", gateway: "Thawani", markets: "OM", status: "planned" },
        { id: "card", gateway: "Card (PSP)", markets: "OM · AE · SA", status: "planned" },
        { id: "bank", gateway: "Bank transfer", markets: "OM", status: "manual later" },
      ]}
    />
  );
}
