# إصدار BHD-001 — خط أساس الجودة

| الحقل | القيمة |
|---|---|
| التاريخ | 2026-11-12 |
| Git SHA | `2b39808ba3835f0059d466772fa58e0942dedeb9` |
| الفرع | `main` (+ `chore/bhd-001-quality-baseline`) |
| المستودع | https://github.com/ainoamn/-BHD-Cars |
| الإنتاج | https://bhd-cars.vercel.app |
| Inspect | https://vercel.com/bhdom89-8158s-projects/bhd-cars/Hs5iG8E3AzC4XAq2AQfbUaaKhYNR |

## ماذا دخل الإنتاج

- ESLint غير تفاعلي، typecheck، Vitest، Playwright scaffold، CI.
- Runbook محلي + حزمة مراجعة `docs/review-2026-11-12`.
- `.env.example` بقيم وهمية فقط.

## ماذا لم يدخل بعد

- قاعدة بيانات / Prisma (BHD-003)
- اكتمال المصادقة والصلاحيات (BHD-004+)
- سوق/طلبات خادمية حقيقية

## أوامر التحقق بعد النشر

```bash
npm ci
npm run ci:local
```

افتح: https://bhd-cars.vercel.app
