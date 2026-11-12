"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { usePrefs } from "@/lib/prefs";

export function AdminPendingPage({
  needAr,
  needEn,
}: {
  needAr: string;
  needEn: string;
}) {
  const { locale } = usePrefs();
  const ar = locale === "ar";

  return (
    <div>
      <AdminPageHeader />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "هذه الشاشة جاهزة في هيكل التحكم؛ العمليات الحية تتطلب قاعدة بيانات وواجهات تشغيل (دفعات BHD-002 فما بعد)."
          : "This screen is wired into the control chrome; live operations need the database and ops APIs (BHD-002+)."}
      </div>
      <div className="admin-panel">
        <div className="admin-empty">
          <p style={{ margin: 0, fontWeight: 700, color: "#092d24" }}>
            {ar ? "قيد الربط التشغيلي" : "Awaiting operational wiring"}
          </p>
          <p style={{ margin: "0.55rem 0 0" }}>{ar ? needAr : needEn}</p>
        </div>
      </div>
    </div>
  );
}
