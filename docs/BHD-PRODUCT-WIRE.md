# ربط BHD Cars بهوية BHD الحية

> **تاريخ:** 12 نوفمبر 2026  
> **المستودع:** https://github.com/ainoamn/-BHD-Cars.git  
> **المنتج:** `bhd-cars` · https://cars.bhd-om.com  
> **الهوية:** https://id.bhd-om.com

## مطبَّق

| البند | المسار |
|---|---|
| سكربت الهوية | `src/app/layout.tsx` → `https://id.bhd-om.com/bhd-identity.js` |
| عزل الحساب / Silent SSO / Privacy | `src/components/bhd/BhdAccountIsolation.tsx` (+ SilentSso / PrivacyGate) |
| شريط البرامج الحي | `src/components/bhd/BhdProgramsStrip.tsx` (header + footer) |
| كتالوج | `src/lib/bhd/catalog.ts` ← `GET /api/bhd/catalog` |
| OAuth start / callback / logout / rebind | `src/app/api/auth/bhd/*` |
| جلسة المنتج | `src/lib/auth/session.ts` + `src/app/api/auth/me` |
| CSP | `next.config.ts` يسمح بـ `id.bhd-om.com` |

## هوية العميل

- `client_id`: `bhd-cars`
- `origin`: `https://cars.bhd-om.com`
- `redirect_uri`: `https://cars.bhd-om.com/api/auth/bhd/callback`
- Issuer: `https://id.bhd-om.com`

سجّل/حدّث العميل من [`/admin#connect`](https://id.bhd-om.com/admin#connect) ثم [`#clients`](https://id.bhd-om.com/admin#clients).

## env

انسخ `.env.example` إلى `.env.local` (لا ترفع أسراراً):

- `AUTH_SECRET` — يوقّع JWT جلسة المنتج (**مطلوب** لـ callback/rebind)
- `BHD_IDENTITY_ISSUER=https://id.bhd-om.com`
- `BHD_OAUTH_CLIENT_ID=bhd-cars`
- `BHD_OAUTH_CLIENT_SECRET` — من لوحة الإدارة إن لزم
- `BHD_OAUTH_REDIRECT_URI=https://cars.bhd-om.com/api/auth/bhd/callback`

## شريط البرامج

- في الهيدر: أيقونات حية من الكتالوج (`variant="header"`).
- في الفوتر: عمود **برامج BHD** (`variant="footer"`) — ليس قائمة ثابتة.
- المصدر: `https://id.bhd-om.com/api/bhd/catalog` (إدارة الشعار/الاسم من `/admin#apps`).

## مراجع القالب

المصدر المنسوخ منه: `nextjs-boilerplate` (`lib/bhd/*`, `lib/identity/*`, `api/auth/bhd/*`).
