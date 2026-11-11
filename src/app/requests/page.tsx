"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { usePrefs } from "@/lib/prefs";
import { useStore } from "@/lib/store";
import type { Copy, RequestKind } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

const kindLabel: Record<RequestKind, Copy> = {
  valuation: L("تثمين", "Valuation"),
  finance: L("تمويل", "Finance"),
  insurance: L("تأمين", "Insurance"),
  inspection: L("فحص", "Inspection"),
  import: L("استيراد", "Import"),
  rental: L("تأجير", "Rental"),
  part: L("قطعة", "Part"),
  scrap: L("سكراب", "Scrap"),
  auction: L("مزاد", "Auction"),
  sell: L("بيع", "Sale"),
  plate: L("لوحة", "Plate"),
  report: L("سجل", "History"),
  service: L("صيانة", "Service"),
  inquiry: L("رسالة", "Message"),
};

const statusLabel = {
  submitted: L("وصل", "Received"),
  matching: L("يُطابق", "Matching"),
  quoted: L("بعرض", "Quoted"),
};

export default function Page() {
  const { tx, locale } = usePrefs();
  const { requests } = useStore();
  return (
    <div>
      <PageHeader
        kicker={L("الطلبات", "Requests")}
        title={L("كل ما أرسلته، برقم واحد.", "Everything you sent, under a reference.")}
        lead={L("التمويل والتأمين والفحص والتثمين والمزاد والرسائل تبقى هنا في هذا المتصفح.", "Finance, insurance, inspection, valuation, auctions, and messages stay here in this browser.")}
      />
      <div className="mx-auto max-w-3xl px-5 py-10">
        {requests.length === 0 ? (
          <div className="surface-card px-6 py-16 text-center">
            <p className="text-lg font-semibold text-night">{tx(L("لا طلبات بعد.", "No requests yet."))}</p>
            <p className="mt-2 text-sm text-muted">{tx(L("ابدأ من سيارة، أو من تمويل وتأمين وفحص.", "Start from a car, or from finance, insurance, or inspection."))}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/cars" className="btn-primary">{tx(L("السوق", "Market"))}</Link>
              <Link href="/finance" className="btn-secondary">{tx(L("تمويل", "Finance"))}</Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => (
              <li key={request.id} className="surface-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-2xl font-bold tracking-tight text-night">{request.ref}</p>
                  <p className="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-brass">
                    {tx(kindLabel[request.kind])} · {tx(statusLabel[request.status])}
                  </p>
                </div>
                <p className="mt-3 font-medium text-night">{request.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{request.detail}</p>
                <p className="mt-3 text-xs text-muted">{new Date(request.createdAt).toLocaleString(locale === "ar" ? "ar" : "en")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
