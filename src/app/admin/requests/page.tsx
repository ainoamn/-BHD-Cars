import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminRequestsPage() {
  return (
    <AdminPendingPage
      needAr="طلبات التثمين والفحص والتمويل والتأمين والاستيراد كطابور تشغيلي موحّد."
      needEn="Unified ops queue for valuation, inspection, finance, insurance, and import."
    />
  );
}
