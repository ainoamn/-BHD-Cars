import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminStaffPage() {
  return (
    <AdminPendingPage
      needAr="تفويض مديري الموقع وصلاحيات الأقسام بدل قائمة البريد فقط."
      needEn="Delegate site admins and section permissions beyond the email allowlist."
    />
  );
}
