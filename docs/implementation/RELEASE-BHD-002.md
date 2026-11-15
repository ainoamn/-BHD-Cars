# إصدار BHD-002 — تحكم الموقع والبوابات

| الحقل | القيمة |
|---|---|
| التاريخ | 2026-11-15 |
| الفرع | `main` |
| المستودع | https://github.com/ainoamn/-BHD-Cars |
| الإنتاج | https://bhd-cars.vercel.app |
| التوثيق | `docs/implementation/BHD-002.md` |

## ملخص النشر

- لوحة `/admin` حية على Neon مع فصل إعدادات الموقع عن أقسام المنصة.
- بوابات `/portal` · `/account` · `/workspace` مع عزل بيانات المستخدم/المنشأة.
- دعوة موظفين وصلاحيات scopes من `/workspace/team`.

## التحقق بعد النشر

- [ ] `/admin` يفتح لمالك الموقع المدرج في allowlist
- [ ] `/admin/settings` يفعّل تنبيهًا أو صيانة ويظهر للعامة
- [ ] `/portal` يعرض الحساب الشخصي + المنشآت
- [ ] `/account/listings` لا يعرض مركبات `org_id`
- [ ] `/workspace/listings` لا يعرض مركبات شخصية
- [ ] دعوة بريد من `/workspace/team` تظهر كـ pending ثم تُقبل بعد دخول المدعو

## ملاحظات تشغيل

- لا تلصق `DATABASE_URL=...` كاملًا كقيمة متغير؛ القيمة يجب أن تبدأ بـ `postgresql://`
- نظّف CRLF من قيم `SITE_ADMIN_*` عند الضبط من PowerShell
