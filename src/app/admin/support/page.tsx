import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminSupportPage() {
  return (
    <AdminPendingPage
      needAr="تذاكر الدعم والنزاعات وإساءة الاستخدام مع ربط الإعلان أو الطلب."
      needEn="Support tickets, disputes, and abuse cases linked to listings or requests."
    />
  );
}
