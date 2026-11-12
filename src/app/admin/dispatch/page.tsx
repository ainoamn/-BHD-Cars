import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminDispatchPage() {
  return (
    <AdminPendingPage
      needAr="إسناد الشركاء للطوابير حسب السوق ونوع الخدمة والسعة."
      needEn="Assign partners to queues by market, service type, and capacity."
    />
  );
}
