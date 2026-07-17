import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import {
  ShieldAlert, Stethoscope, Building2, CheckCircle2, Lock
} from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; role: string }> }): Promise<Metadata> {
  const { role, locale } = await params;
  const isRtl = locale === 'ar';
  
  const roleTitle = role === 'admin' 
    ? (isRtl ? 'لوحة الإدارة' : 'Admin Panel') 
    : role === 'doctor' 
    ? (isRtl ? 'لوحة تحكم الطبيب' : 'Doctor Panel') 
    : (isRtl ? 'لوحة تحكم المستشفى' : 'Hospital Panel');

  return {
    title: `${roleTitle} | طبّك الأردن`,
    description: 'Dashboard preview and management panel.',
  };
}

interface DashboardPageProps {
  params: Promise<{ locale: string; role: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale, role } = await params;
  setRequestLocale(locale);

  if (!['admin', 'doctor', 'hospital'].includes(role)) {
    notFound();
  }

  const isRtl = locale === 'ar';
  const t = await getTranslations('dashboard');

  // Simulated metrics and listings depending on the role
  return (
    <div className="py-10 bg-slate-50 flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner Alert for Prototype Mode */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm sm:text-base font-cairo">{t('admin_title') ? (isRtl ? 'بيئة استعراضية تجريبية' : 'MVP Evaluation Environment') : ''}</h4>
            <p className="text-xs sm:text-sm text-amber-700 mt-1 font-cairo">
              {t('placeholder_desc')}
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            {role === 'admin' && <CheckCircle2 className="h-8 w-8 text-teal-600" />}
            {role === 'doctor' && <Stethoscope className="h-8 w-8 text-teal-600" />}
            {role === 'hospital' && <Building2 className="h-8 w-8 text-teal-600" />}
            <span>
              {role === 'admin' && t('admin_title')}
              {role === 'doctor' && t('doctor_title')}
              {role === 'hospital' && t('hospital_title')}
            </span>
          </h1>
        </div>

        {/* ADMIN VIEW */}
        {role === 'admin' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('total_doctors')}</p>
                <p className="text-3xl font-black text-slate-800">142</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('total_hospitals')}</p>
                <p className="text-3xl font-black text-slate-800">18</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('total_bookings')}</p>
                <p className="text-3xl font-black text-slate-800">1,024</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('total_intl_requests')}</p>
                <p className="text-3xl font-black text-slate-800">84</p>
              </div>
            </div>

            {/* Moderation Queue */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {t('upgrade_requests')}
              </h3>
              <div className="divide-y divide-gray-100 font-cairo">
                <div className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">د. أحمد الحسن</h4>
                    <p className="text-xs text-slate-500 mt-0.5">طلب ترقية باقة إلى VIP | ترخيص طبي #A4492</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">معلق للمراجعة</span>
                </div>
                <div className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">مستشفى الأردن</h4>
                    <p className="text-xs text-slate-500 mt-0.5">طلب ترقية باقة إلى International Partner</p>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">معلق للمراجعة</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCTOR VIEW */}
        {role === 'doctor' && (
          <div className="space-y-8">
            {/* Free Package Limit Notice Alert */}
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex items-start gap-3">
              <Lock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm sm:text-base font-cairo">{isRtl ? 'حد الاتصال المجاني متجاوز!' : 'Free lead limit reached!'}</h4>
                <p className="text-xs sm:text-sm text-red-700 mt-1 font-cairo">
                  {t('leads_hidden_alert', { count: 4 })}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('leads_count')}</p>
                <p className="text-3xl font-black text-slate-800">7</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('total_bookings')}</p>
                <p className="text-3xl font-black text-slate-800">3</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{isRtl ? 'مشاهدات الملف' : 'Profile Views'}</p>
                <p className="text-3xl font-black text-slate-800">421</p>
              </div>
            </div>

            {/* Simulated Leads List with Masked Details */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {t('my_leads')}
              </h3>
              <div className="divide-y divide-gray-100 font-cairo">
                
                {/* Visible Leads */}
                <div className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">محمد أحمد</h4>
                    <p className="text-xs text-slate-500 mt-0.5">رقم الهاتف: 962791234567+ | طلب: اتصال هاتفي</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">مقروء</span>
                </div>
                
                <div className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">فاطمة علي</h4>
                    <p className="text-xs text-slate-500 mt-0.5">رقم الهاتف: 962779876543+ | طلب: موعد عيادة</p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">مقروء</span>
                </div>

                {/* Masked Leads (RLS simulated) */}
                <div className="py-4 flex justify-between items-center gap-4 opacity-75">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-500 text-sm flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-red-500" />
                      <span>{isRtl ? 'مريض رقم #4' : 'Patient #4'}</span>
                    </h4>
                    <p className="text-xs text-red-500 font-semibold font-cairo">
                      {isRtl ? 'اسم المريض ورقم الهاتف محجوب. ترقية الباقة لفتح البيانات' : 'Patient details masked. Upgrade package to reveal.'}
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold">محجوب (مغلق)</span>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* HOSPITAL VIEW */}
        {role === 'hospital' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{isRtl ? 'زيارات مستلمة' : 'Visits Received'}</p>
                <p className="text-3xl font-black text-slate-800">42</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{t('leads_count')}</p>
                <p className="text-3xl font-black text-slate-800">18</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{isRtl ? 'الأطباء المرتبطين' : 'Linked Doctors'}</p>
                <p className="text-3xl font-black text-slate-800">5</p>
              </div>
            </div>

            {/* Booking Visists */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {isRtl ? 'طلبات الزيارات والتقديرات الطبية' : 'Visits & Medical Estimates Queue'}
              </h3>
              <div className="divide-y divide-gray-100 font-cairo">
                <div className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">عبد الله سعدون</h4>
                    <p className="text-xs text-slate-500 mt-0.5">طلب: تقدير تكلفة عملية جراحة الركبة | المحافظة: عمان</p>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">جديد</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
