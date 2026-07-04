# طبّك (Tabibak) - منصة السياحة العلاجية في الأردن

منصة ويب احترافية تربط المرضى من داخل الأردن وخارجها بالأطباء والعيادات والمستشفيات داخل الأردن.

## الرابط المباشر

🔗 **https://doctors-platform-tawny.vercel.app**

### حسابات تجريبية (البيانات محفوظة في المتصفح)

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|-------------------|-------------|
| إدارة | admin@tabibak.com | admin123 |
| طبيب | doctor1@tabibak.com | doctor123 |
| مستشفى | hospital1@tabibak.com | hospital123 |

## التقنيات المستخدمة

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **next-intl** (ترجمة عربي/إنجليزي + RTL)
- **Supabase** (جاهز للاتصال - المرحلة الأولى تستخدم localStorage)
- **Lucide React** (أيقونات)
- **Vercel** (استضافة)

## الصفحات

### عامة
- الرئيسية - `/ar` أو `/en`
- الأطباء - `/ar/doctors`
- المستشفيات - `/ar/hospitals`
- التخصصات - `/ar/specialties`
- تفاصيل طبيب - `/ar/doctors/[id]`
- تفاصيل مستشفى - `/ar/hospitals/[id]`
- حجز موعد - `/ar/booking/[type]/[id]`
- استشارة - `/ar/consultation/[type]/[id]`
- طلب علاج دولي - `/ar/international-treatment`
- الباقات - `/ar/packages`
- من نحن - `/ar/about`
- تواصل معنا - `/ar/contact`
- سياسة الخصوصية - `/ar/privacy`
- شروط الاستخدام - `/ar/terms`
- انضم كطبيب - `/ar/join-doctor`
- انضم كمستشفى - `/ar/join-hospital`
- تسجيل الدخول - `/ar/login`

### لوحات التحكم
- الإدارة - `/ar/admin`
- الطبيب - `/ar/doctor-dashboard`
- المستشفى - `/ar/hospital-dashboard`

## التشغيل المحلي

```bash
npm install
npm run dev
# http://localhost:3000
```

## هيكل المشروع

```
src/
├── app/[locale]/     # الصفحات (عامة + لوحات)
├── components/       # المكونات المشتركة (Header, Footer)
├── lib/              # utilities, store, seed-data
├── types/            # TypeScript types
├── i18n/             # الترجمة والتوجيه
messages/             # ملفات الترجمة AR/EN
```

## ملاحظة

في المرحلة الأولى، كل البيانات تُخزن في localStorage في المتصفح (لا حاجة لقاعدة بيانات). يمكن ربط Supabase لاحقًا للانتاج الفعلي.
