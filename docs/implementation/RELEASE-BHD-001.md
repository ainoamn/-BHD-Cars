# إصدار BHD-001 — خط أساس الجودة

| الحقل | القيمة |
|---|---|
| التاريخ | 2026-11-12 |
| Git SHA | `9b09bb0d5bd5d85224a55adffdb064973f2236d5` |
| الفرع | `main` (+ `chore/bhd-001-quality-baseline`) |
| المستودع | https://github.com/ainoamn/-BHD-Cars |
| الإنتاج | https://bhd-cars.vercel.app |
| Inspect | https://vercel.com/bhdom89-8158s-projects/bhd-cars/2ACPfWaEzqYKnYX3b8qrhqtQLjo9 |

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
