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
- **144 وكالة** مع شعارات رسمية حقيقية في `public/makes/` (من الويب — وليست رسوماً بالذكاء الاصطناعي)
- **~751 طرازاً** بأسماء عربية/إنجليزية وفئات تجهيز
- ربط أسماء الإعلانات بالكتالوج: `src/lib/make-map.ts`

### صور الفئات (كتالوج واقعي بهوية BHD)

واجهة اختيار الفئة تعرض **صوراً واقعية بأسلوب كتالوج سوق كارس** (خلفية بيضاء، زاوية ثلاثية الأرباع) مولَّدة بهوية الموقع:

- ألوان الطلاء مستوحاة من BHD: أخضر ليلي `#092d24`، تركواز `#08a39f`، كحلي `#174b70`، نحاسي `#b58d55`
- الملفات في `public/stickers/` حسب شكل الهيكل (`sedan` · `suv` · `coupe` · `pickup` · `hatch` · `van` · `moto` · `truck` · `ev`)
- المكوّن: `src/components/model-thumb.tsx` — بطاقات بيضاء نظيفة بلا رسوم كرتونية

### ترتيب الاختيار (مثل موقع كارس)

1. **الشركة** — شبكة شعارات حقيقية  
2. **الفئة / الموديل** — صور كتالوج واقعية بهوية BHD  
3. **سنة الصنع**  
4. **نوع الهيكل**  
5. **نوع الوقود**

يُطبَّق في:
- فلتر السوق: `src/components/cars-browser.tsx` → `/cars`
- معالج البيع: `src/components/sell-wizard.tsx` → `/sell/ready`

### تحديث الكتالوج محلياً

```bash
node scripts/emit-models-fast.js
node scripts/enrich-model-images.js
node scripts/enrich-model-images-pass2.js
```

بيانات الأسماء: `scripts/model-catalog-data.js`.

## مسارات البيع

| المسار | الوصف |
|--------|--------|
| `/sell` | مركز البيع |
| `/sell/ready` | معالج إعلان سيارة جاهزة |
| `/sell/accident` | معالج إعلان سيارة متضررة مع بوابة شفافية الضرر |

## النشر

```bash
git push origin main
# أو:
vercel --prod
```

الدفع إلى `main` يحدّث الإنتاج على Vercel.

## الهوية

واجهة بهوية BHD (ألوان/خطوط/اتجاه)، بحث أولاً، وبطاقات إعلان واضحة بالعربية والإنجليزية.
