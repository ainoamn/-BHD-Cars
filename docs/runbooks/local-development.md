# تشغيل وتطوير BHD Cars محليًا

تاريخ: 2026-11-12 · يخص دفعة BHD-001 وما بعدها.

## المتطلبات

- Node.js **22 LTS** (انظر `.nvmrc`). Node 24 يعمل غالبًا لكنه غير المثبت الرسمي في CI.
- npm عبر `package-lock.json` — استخدم `npm ci` بعد استنساخ نظيف.
- لاحقًا (BHD-003): PostgreSQL منفصل للاختبار فقط، وليس قاعدة إنتاج.

## الإعداد السريع

```bash
cd "C:\dev\bhd cars"
nvm use   # أو ثبّت Node 22 يدويًا
npm ci
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # macOS/Linux
```

عدّل `.env.local` محليًا فقط. لا تضع أسرارًا حقيقية في المستودع أو في لقطات الشاشة.

## الأوامر

| الأمر | الغرض |
|---|---|
| `npm run dev` | خادم تطوير Turbopack على المنفذ 3010 |
| `npm run lint` | ESLint CLI غير تفاعلي |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` / `test:unit` | وحدات قواعد الأعمال (Vitest) |
| `npm run test:regression` | انحدارات معزولة (لا تكسر بوابة CI الرئيسية) |
| `npm run test:integration` | يتطلب `DATABASE_URL` لقاعدة اختبار قابلة للمسح |
| `npm run test:e2e` | Playwright smoke (يشغّل dev إن لم تُضبط `PLAYWRIGHT_BASE_URL`) |
| `npm run build` | بناء إنتاج محلي |
| `npm run ci:local` | lint + typecheck + unit + build بالترتيب |

## قاعدة البيانات (بعد BHD-003)

1. أنشئ قاعدة `bhd_cars_test` محلية.
2. ضع `DATABASE_URL` في `.env.local` يشير إليها فقط.
3. شغّل الترحيلات والـ seed الموسومة `demo` وفق runbook الدفعة.
4. لا تشغّل اختبارات تكامل ضد بيانات إنتاج أو staging مشترك فيه بيانات حقيقية.

## Staging والإنتاج

- معاينة Vercel من فرع ميزة للاختبار الروتيني.
- الإنتاج الحالي بعد BHD-001: https://bhd-cars.vercel.app (يُحدَّث بأمر `vercel --prod` أو نشر Git المرتبط).
- عيّن أسرار staging/الإنتاج في لوحة الاستضافة لا في الملفات.
- لا تؤكد إرسال طلب أو استلام شريك إلا بعد مسار خادمي حقيقي (انظر مواصفات النظام).
- تفاصيل تسليم الجودة: `docs/implementation/BHD-001.md`.

## جودة وأمان أساسي

- `localStorage` للتفضيلات/مقارنة الضيف فقط — ليس مصدر حقيقة للطلبات أو الحسابات.
- لا تُسجَّل مستندات عملاء أو رموز جلسات في console أو logs عامة.
- `npm audit` يُعالَج في BHD-002؛ لا تستخدم `--force` بلا مراجعة توافق.

## استكشاف أخطاء شائعة

- **Module not found: jose** — ثبّت الاعتماديات بـ `npm ci`؛ الحزمة مطلوبة لـ WIP المسارات تحت `src/lib/auth`.
- **lint تفاعلي قديم** — تأكد أن السكربت هو `eslint .` وليس `next lint`.
- **E2E يفشل على المنفذ** — أوقف خادمًا آخر على 3010 أو عيّن `PLAYWRIGHT_PORT`.
