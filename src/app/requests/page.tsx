"use client";

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
      <div className="mx-auto max-w-3xl px-5 py-12">
        {requests.length === 0 ? (
          <p className="text-muted">{tx(L("لا طلبات بعد.", "No requests yet."))}</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {requests.map((request) => (
              <li key={request.id} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="font-display text-2xl">{request.ref}</p>
                  <p className="text-xs text-brass">{tx(kindLabel[request.kind])} · {tx(statusLabel[request.status])}</p>
                </div>
                <p className="mt-2">{request.title}</p>
                <p className="mt-1 text-sm text-muted">{request.detail}</p>
                <p className="mt-2 text-xs text-muted">{new Date(request.createdAt).toLocaleString(locale === "ar" ? "ar" : "en")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
