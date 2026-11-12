import { AdminDeskPage } from "@/components/admin/admin-desk";

export const dynamic = "force-dynamic";

export default function AdminAccountingPage() {
  return (
    <AdminDeskPage
      leadAr="حسابات العملاء: أرصدة المعارض والشركاء والفواتير المفتوحة."
      leadEn="Client accounts: dealer and partner balances and open invoices."
      panels={[
        {
          titleAr: "دفتر العملاء",
          titleEn: "Client ledger",
          bodyAr: "رصيد كل معرض/شريك مقابل الاشتراكات والعمولات.",
          bodyEn: "Each dealer/partner balance against subscriptions and commissions.",
          statusAr: "دفتر لاحق",
          statusEn: "Ledger later",
        },
        {
          titleAr: "الفواتير",
          titleEn: "Invoices",
          bodyAr: "إصدار ومتابعة فواتير الاشتراك وعمولة المزاد.",
          bodyEn: "Issue and track subscription and auction-commission invoices.",
          statusAr: "يتطلب فوترة",
          statusEn: "Needs billing",
        },
        {
          titleAr: "أموال المنصة",
          titleEn: "Platform money",
          bodyAr: "إيصالات ومصروفات مرتبطة ببوابات الدفع.",
          bodyEn: "Receipts and expenses tied to payment gateways.",
          href: "/admin/payments",
          ctaAr: "المدفوعات",
          ctaEn: "Payments",
        },
      ]}
      columns={[
        { key: "account", ar: "الحساب", en: "Account" },
        { key: "balance", ar: "الرصيد", en: "Balance" },
        { key: "open", ar: "مفتوح", en: "Open" },
        { key: "status", ar: "الحالة", en: "Status" },
      ]}
      rows={[]}
    />
  );
}
