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

## قاعدة البيانات (BHD-002+)

1. استخدم مشروع Neon مخصص لـ BHD Cars (أو قاعدة محلية قابلة للمسح).
2. ضع `DATABASE_URL` في `.env.local` — القيمة تبدأ بـ `postgresql://` فقط.
3. جداول التحكم والبوابات تُنشأ على Neon (انظر `docs/implementation/BHD-002.md`).
4. لا تشغّل اختبارات أو seeds ضد بيانات إنتاج فيها حسابات حقيقية دون قصد.

## بوابات التحكم المحلية

| المسار | الغرض |
|---|---|
| `/admin` | تحكم مالك الموقع |
| `/portal` | اختيار مساحة المستخدم/المعرض |
| `/account` | لوحة المستخدم الشخصية |
| `/workspace` | لوحة المعرض/الشركة + الفريق |

للمعاينة بدون SSO: `SITE_ADMIN_DEV_OPEN=1` في `.env.local` (يُتجاهل في الإنتاج).

## Staging والإنتاج

- معاينة Vercel من فرع ميزة للاختبار الروتيني.
- الإنتاج: https://bhd-cars.vercel.app (يُحدَّث بأمر `vercel --prod` أو نشر Git المرتبط).
- عيّن أسرار staging/الإنتاج في لوحة الاستضافة لا في الملفات.
- تفاصيل الجودة: `docs/implementation/BHD-001.md` · البوابات: `docs/implementation/BHD-002.md`.

## جودة وأمان أساسي

- `localStorage` للتفضيلات/مقارنة الضيف فقط — ليس مصدر حقيقة للطلبات أو الحسابات.
- لا تُسجَّل مستندات عملاء أو رموز جلسات في console أو logs عامة.
- `npm audit` يُعالَج في BHD-002؛ لا تستخدم `--force` بلا مراجعة توافق.

## استكشاف أخطاء شائعة

- **Module not found: jose** — ثبّت الاعتماديات بـ `npm ci`؛ الحزمة مطلوبة لـ WIP المسارات تحت `src/lib/auth`.
- **lint تفاعلي قديم** — تأكد أن السكربت هو `eslint .` وليس `next lint`.
- **E2E يفشل على المنفذ** — أوقف خادمًا آخر على 3010 أو عيّن `PLAYWRIGHT_PORT`.
