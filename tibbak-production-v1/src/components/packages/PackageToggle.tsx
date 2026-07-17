'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, ShieldCheck, Star, Crown } from 'lucide-react';
import { Package } from '@/types';

interface PackageToggleProps {
  doctorPackages: Package[];
  hospitalPackages: Package[];
}

export default function PackageToggle({ doctorPackages, hospitalPackages }: PackageToggleProps) {
  const t = useTranslations('packages');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [activeTab, setActiveTab] = useState<'doctor' | 'hospital'>('doctor');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubscribe = (pkgName: string) => {
    setSuccessMsg(
      isRtl
        ? `تم استلام طلب ترقية/اشتراك باقة (${pkgName}) بنجاح! هذا نموذج تجريبي في المرحلة الأولى، وسيقوم فريق المبيعات لدينا بالتواصل معك قريباً لتنسيق الدفع وتفعيل الباقة.`
        : `Your subscription request for the (${pkgName}) package has been received! This is a mock/MVP demonstration model, and our sales team will contact you shortly to coordinate billing and activation.`
    );
  };

  const currentPackages = activeTab === 'doctor' ? doctorPackages : hospitalPackages;

  return (
    <div className="space-y-12">
      {/* Patient Notice Banner */}
      <div className="bg-teal-50 border border-teal-200/50 rounded-2xl p-5 flex items-start gap-4 max-w-4xl mx-auto">
        <ShieldCheck className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-teal-800 text-sm sm:text-base font-cairo">
            {isRtl ? 'استخدام مجاني بالكامل للمرضى' : '100% Free for Patients'}
          </h4>
          <p className="text-xs sm:text-sm text-teal-700 mt-1 font-cairo">
            {t('patient_free_notice')}
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-2">
          <button
            onClick={() => {
              setActiveTab('doctor');
              setSuccessMsg(null);
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'doctor'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('doctor_tab')}
          </button>
          <button
            onClick={() => {
              setActiveTab('hospital');
              setSuccessMsg(null);
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'hospital'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('hospital_tab')}
          </button>
        </div>
      </div>

      {/* Success Modal/Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200/50 rounded-2xl p-6 text-center max-w-3xl mx-auto space-y-3">
          <ShieldCheck className="h-12 w-12 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-emerald-800 text-lg">{isRtl ? 'تم إرسال طلبك' : 'Request Submitted'}</h4>
          <p className="text-sm text-emerald-800 leading-relaxed font-cairo">{successMsg}</p>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            {isRtl ? 'إغلاق التنبيه' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {currentPackages.map((pkg) => {
          // Resolve icon
          const isVip = pkg.tier === 'vip' || pkg.tier === 'international';
          const isPremium = pkg.tier === 'premium';
          
          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl border p-8 flex flex-col justify-between relative transition-all shadow-sm hover:shadow-md ${
                isVip
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : isPremium
                  ? 'border-teal-500 ring-2 ring-teal-500/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Featured Ribbon */}
              {isVip && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1 gold-crown-glow">
                  <Crown className="h-3 w-3" />
                  {t('popular')}
                </span>
              )}

              {/* Title & Price */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    {isRtl ? pkg.name_ar : pkg.name_en}
                  </h3>
                  {isVip && <Crown className="h-5 w-5 text-amber-500" />}
                  {isPremium && <Star className="h-5 w-5 text-teal-600" />}
                </div>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-extrabold text-slate-900">{pkg.price_jod}</span>
                  <span className="text-sm font-semibold text-slate-500">
                    {tCommon('jod')} / {isRtl ? 'شهرياً' : 'monthly'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-medium mb-6">
                  {pkg.price_jod === 0 
                    ? (isRtl ? 'ظهور أساسي مجاني دائماً للمزود' : 'Always free for basic clinical exposure')
                    : (isRtl ? 'فوترة شهرية مرنة ودعم فني متكامل' : 'Flexible monthly billing with technical support')
                  }
                </p>

                <hr className="border-gray-100 my-6" />

                {/* Features List */}
                <ul className="space-y-3.5 mb-8 text-sm font-medium text-slate-600">
                  {pkg.features.map((feat, index) => (
                    <li key={index} className="flex items-start gap-2.5 font-cairo">
                      <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSubscribe(isRtl ? pkg.name_ar : pkg.name_en)}
                className={`w-full font-bold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
                  isVip
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                    : isPremium
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{t('subscribe_btn')}</span>
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}
