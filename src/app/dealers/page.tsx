"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { sellers } from "@/lib/data";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const { tx } = usePrefs();
  const houses = sellers.filter((seller) => seller.kind === "dealer");
  return (
    <div>
      <PageHeader kicker={L("المعارض", "Houses")} title={L("معارض موثّقة، لا حسابات مجهولة.", "Verified houses, not anonymous accounts.")} lead={L("المعرض الموثّق يظهر باسمه وتاريخه. الإعلان الفردي يبقى فردياً.", "A verified house appears under its name and its history. A private listing stays private.")} />
      <div className="page-wrap grid gap-5 px-5 py-10 md:grid-cols-2">
        {houses.map((house) => (
          <Link key={house.slug} href={`/dealers/${house.slug}`} className="surface-card surface-card-hover p-6">
            <p className="text-xs font-medium text-brass">{tx(L("موثّق", "Verified"))} · {house.since}</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-night">{house.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{tx(house.about)}</p>
            <p className="mt-4 text-xs text-muted">{tx(house.city)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
