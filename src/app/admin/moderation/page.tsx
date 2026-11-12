import { AdminPendingPage } from "@/components/admin/admin-pending";

export const dynamic = "force-dynamic";

export default function AdminModerationPage() {
  return (
    <AdminPendingPage
      needAr="طابور البلاغات، مراجعة الإفصاح عن الأضرار، وكشف المكررات."
      needEn="Report queue, damage-disclosure review, and duplicate detection."
    />
  );
}
