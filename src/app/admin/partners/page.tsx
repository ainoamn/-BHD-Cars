import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminPartnersPage() {
  return (
    <AdminPendingPage
      needAr="ملفات مؤسسات التأمين والتمويل والتثمين والفحص واعتمادها."
      needEn="Insurance, finance, valuation, and inspection org profiles and accreditation."
    />
  );
}
