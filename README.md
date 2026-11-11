# BHD Cars

منصة سيارات خليجية للشراء والبيع والمزاد، مع تثمين وتمويل وتأمين وفحص واستيراد وتأجير وقطع غيار — عربية/إنجليزية مع دعم RTL.

الموقع المنشور: [bhd-cars.vercel.app](https://bhd-cars.vercel.app)

## التشغيل المحلي

```bash
npm install
npm run dev
```

يفتح على [http://localhost:3010](http://localhost:3010).

```bash
npm run build
npm start
```

## المكدس

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Vercel

## كتالوج الوكالات والطرازات

- المصدر الرئيسي للوكالات: `src/lib/makes-full.ts` + الطبقة الموسّعة `src/lib/generated-models.json`
- **144 وكالة** مع شعارات حقيقية في `public/makes/` (SVG/PNG من Wikimedia وSimple Icons ومصادر رسمية)
- **~751 طرازاً** بأسماء عربية/إنجليزية وفئات تجهيز
- صور رمزية للطرازات في `public/models/` باسم `{makeId}--{modelId}.jpg|png`
- واجهة الاختيار: `MakePicker` (صفّان + بحث + فئات) و`ModelThumb` (سلسلة سقوط للصورة)

### تحديث الكتالوج محلياً

```bash
# توليد قائمة الطرازات بسرعة (بدون شبكة)
node scripts/emit-models-fast.js

# إثراء الصور من ويكيبيديا/Commons (بطيء بسبب حدود المعدل)
node scripts/enrich-model-images.js
node scripts/enrich-model-images-pass2.js
```

بيانات الأسماء قابلة للتعديل في `scripts/model-catalog-data.js`.

## مسارات البيع

| المسار | الوصف |
|--------|--------|
| `/sell` | مركز البيع |
| `/sell/ready` | معالج إعلان سيارة جاهزة |
| `/sell/accident` | معالج إعلان سيارة متضررة مع بوابة شفافية الضرر |

المكوّنات: `src/components/sell-wizard.tsx` · `src/components/accident-wizard.tsx`

## النشر

المستودع مرتبط بـ GitHub وVercel. الدفع إلى `main` يحدّث الإنتاج:

```bash
git push origin main
# أو يدوياً:
vercel --prod
```

## الهوية

واجهة بهوية BHD (ألوان/خطوط/اتجاه)، بحث أولاً، وبطاقات إعلان واضحة بالعربية والإنجليزية.
