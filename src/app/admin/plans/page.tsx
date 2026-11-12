import { AdminDeskPage } from "@/components/admin/admin-desk";

export const dynamic = "force-dynamic";

export default function AdminPlansPage() {
  return (
    <AdminDeskPage
      leadAr="باقات اشتراك المعارض وحدود الإعلانات والمزادات والظهور."
      leadEn="Dealer subscription plans and listing, auction, and visibility limits."
      panels={[
        {
          titleAr: "كتالوج الباقات",
          titleEn: "Plan catalog",
          bodyAr: "أسعار شهرية/سنوية، سقف الإعلانات، وعمولة المزاد.",
          bodyEn: "Monthly/yearly prices, listing caps, and auction commission.",
          statusAr: "مسودة منتج",
          statusEn: "Product draft",
        },
        {
          titleAr: "اشتراك كل معرض",
          titleEn: "Per-dealer subscription",
          bodyAr: "حالة التجديد، الترقية، والإيقاف عند التأخر.",
          bodyEn: "Renewal state, upgrades, and past-due suspension.",
          href: "/admin/dealers",
          ctaAr: "المعارض",
          ctaEn: "Dealers",
        },
        {
          titleAr: "إحصائيات",
          titleEn: "Stats",
          bodyAr: "عرض الإيراد التقديري ومعدلات التحويل.",
          bodyEn: "Estimated revenue and conversion rates.",
          href: "/admin/billing",
          ctaAr: "الإحصائيات",
          ctaEn: "Billing stats",
        },
      ]}
      columns={[
        { key: "plan", ar: "الباقة", en: "Plan" },
        { key: "price", ar: "السعر", en: "Price" },
        { key: "listings", ar: "سقف الإعلانات", en: "Listing cap" },
        { key: "subscribers", ar: "مشتركون", en: "Subscribers" },
      ]}
      rows={[
        {
          id: "starter",
          plan: "Starter",
          price: "15 OMR / mo",
          listings: "20",
          subscribers: "—",
        },
        {
          id: "pro",
          plan: "Pro",
          price: "45 OMR / mo",
          listings: "100",
          subscribers: "—",
        },
        {
          id: "house",
          plan: "House",
          price: "120 OMR / mo",
          listings: "Unlimited*",
          subscribers: "—",
        },
      ]}
    />
  );
}
