"use client";

import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { usePrefs } from "@/lib/prefs";

export type AdminDeskPanel = {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  statusAr?: string;
  statusEn?: string;
  href?: string;
  ctaAr?: string;
  ctaEn?: string;
};

export function AdminDeskPage({
  leadAr,
  leadEn,
  panels,
  rows,
  columns,
}: {
  leadAr: string;
  leadEn: string;
  panels?: AdminDeskPanel[];
  rows?: Array<Record<string, string>>;
  columns?: Array<{ key: string; ar: string; en: string }>;
}) {
  const { locale } = usePrefs();
  const ar = locale === "ar";

  return (
    <div>
      <AdminPageHeader lead={ar ? leadAr : leadEn} />
      <div className="admin-banner admin-banner--info">
        {ar
          ? "هيكل التشغيل جاهز. الحفظ والتعديل الحيّان يرتبطان بقاعدة البيانات وواجهات الإدارة (BHD-002+)."
          : "Ops chrome is ready. Live save/edit binds to the database and admin APIs (BHD-002+)."}
      </div>

      {panels?.length ? (
        <div className="admin-grid" style={{ marginBottom: "1rem" }}>
          {panels.map((panel) => (
            <div key={panel.titleEn} className="admin-card">
              <p className="admin-card__label">{ar ? panel.titleAr : panel.titleEn}</p>
              <p className="admin-card__hint" style={{ marginTop: "0.55rem", lineHeight: 1.5 }}>
                {ar ? panel.bodyAr : panel.bodyEn}
              </p>
              {panel.statusAr || panel.statusEn ? (
                <p style={{ margin: "0.7rem 0 0" }}>
                  <span className="admin-badge admin-badge--warn">
                    {ar ? panel.statusAr : panel.statusEn}
                  </span>
                </p>
              ) : null}
              {panel.href ? (
                <div className="admin-actions" style={{ marginTop: "0.85rem" }}>
                  <Link href={panel.href}>{ar ? panel.ctaAr || "فتح" : panel.ctaEn || "Open"}</Link>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {columns?.length && rows ? (
        <div className="admin-panel">
          <div className="admin-panel__head">
            <h2>{ar ? "سجل تشغيلي (عرض)" : "Ops register (preview)"}</h2>
          </div>
          {rows.length === 0 ? (
            <div className="admin-empty">
              {ar ? "لا صفوف بعد — ستظهر هنا بعد ربط قاعدة البيانات." : "No rows yet — they appear after the database is wired."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{ar ? col.ar : col.en}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id || String(index)}>
                      {columns.map((col) => (
                        <td key={col.key}>{row[col.key] || "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
