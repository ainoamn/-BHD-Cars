import { AdminDeskPage } from "@/components/admin/admin-desk";
import { sellers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function AdminBillingPage() {
  const dealers = sellers.filter((seller) => seller.kind === "dealer").length;

  return (
    <AdminDeskPage
      leadAr="إحصائيات الاشتراك والإيراد التقديري للمنصة — ليست إعدادات الموقع."
      leadEn="Subscription stats and estimated platform revenue — not site settings."
      panels={[
        {
          titleAr: "معارض في الكتالوج",
          titleEn: "Catalog dealers",
          bodyAr: `${dealers} معرض في بيانات العرض الحالية.`,
          bodyEn: `${dealers} dealers in the current demo catalog.`,
          statusAr: "عرض فقط",
          statusEn: "Demo only",
        },
        {
          titleAr: "MRR تقديري",
          titleEn: "Estimated MRR",
          bodyAr: "يُحسب بعد ربط الباقات باشتراكات حقيقية.",
          bodyEn: "Computed once plans bind to live subscriptions.",
          statusAr: "غير مربوط",
          statusEn: "Unwired",
        },
        {
          titleAr: "التجديد",
          titleEn: "Renewals",
          bodyAr: "نسبة التجديد والتعثر الشهري.",
          bodyEn: "Monthly renewal and delinquency rate.",
          statusAr: "يحتاج فوترة",
          statusEn: "Needs billing",
        },
      ]}
      columns={[
        { key: "metric", ar: "المؤشر", en: "Metric" },
        { key: "value", ar: "القيمة", en: "Value" },
        { key: "note", ar: "ملاحظة", en: "Note" },
      ]}
      rows={[
        {
          id: "mrr",
          metric: "MRR",
          value: "—",
          note: "awaiting subscriptions",
        },
        {
          id: "active",
          metric: "Active plans",
          value: "0",
          note: "no live billing yet",
        },
        {
          id: "past_due",
          metric: "Past due",
          value: "0",
          note: "—",
        },
      ]}
    />
  );
}
