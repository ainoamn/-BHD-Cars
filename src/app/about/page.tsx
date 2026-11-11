"use client";

import { PageHeader } from "@/components/ui";
import { usePrefs } from "@/lib/prefs";
import type { Copy } from "@/lib/types";

const L = (ar: string, en: string): Copy => ({ ar, en });

export default function Page() {
  const { tx } = usePrefs();
  const points: [Copy, Copy][] = [
    [L("سوق لا تطبيق ملبوس على سطح المكتب", "A market, not an app stretched over a desktop"), L("سوق كارز شبكة إعلانات سريعة، اتصالها واتساب، وتأمينها يفتح موقعاً آخر. هنا القرار يبقى في الصفحة: سعر مقابل السوق، ثم تمويل، تأمين، فحص، أو تثمين.", "Sooq Cars is a fast classifieds grid, its contact is WhatsApp, and its insurance opens another site. Here the decision stays on the page: price against the market, then finance, cover, inspection, or a valuation.")],
    [L("وسيط لا حاسبة", "A desk, not a calculator"), L("بيمة تقارن شركات التأمين ثم تصدر الوثيقة بعد المستندات. أخذنا هذا المسار ووضعناه بجانب السيارة، مع نفس الصراحة: لا تغطية قبل الإصدار.", "Bima compares insurers and issues the policy after the documents. That path sits beside the car here, with the same honesty: no cover before issue.")],
    [L("الحادث لا يختبئ", "Damage does not hide"), L("الاستيراد والسيارات المتضررة قسم مستقل. المزاد يعلن الخطوة والعمولة. السكراب يعلن سعر الطن.", "Import and damaged cars are their own section. The auction states the step and the premium. Scrap states the price per tonne.")],
    [L("هذه النسخة", "This version"), L("واجهة عاملة ببيانات توضيحية وطلبات تُحفظ في المتصفح. الربط التالي: حسابات، دفع، وعقود بنوك وشركات تأمين ومثمنين ومختبرات.", "A working interface with illustrative data and requests kept in the browser. Next: accounts, payments, and contracts with banks, insurers, appraisers, and labs.")],
  ];
  return (
    <div>
      <PageHeader
        kicker={L("عن المنصة", "About")}
        title={L("بُنيت لتكون أهدأ من سوق الإعلانات، وأكمل من صفحة تأمين.", "Built to be calmer than a classifieds grid, and more complete than an insurance page.")}
      />
      <div className="mx-auto grid max-w-4xl gap-4 px-5 py-10">
        {points.map(([title, text]) => (
          <section key={title.en} className="surface-card p-6 md:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-night">{tx(title)}</h2>
            <p className="mt-3 leading-relaxed text-muted">{tx(text)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
