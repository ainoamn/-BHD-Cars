import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <AdminPendingPage
      needAr="وضع الصيانة، التنبيهات العامة، وإعدادات الصفحات الظاهرة للزوار."
      needEn="Maintenance mode, public notices, and visitor-facing page settings."
    />
  );
}
