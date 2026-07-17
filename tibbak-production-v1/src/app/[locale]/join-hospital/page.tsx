'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, Building2, MapPin } from 'lucide-react';
import { mockCities } from '@/data/mock/cities';

export default function JoinHospitalPage() {
  const t = useTranslations('forms');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !cityId || !phone || !consent) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(
        isRtl
          ? 'تم استلام طلب التسجيل كمنشأة/مستشفى بنجاح! هذا نموذج تجريبي في المرحلة الأولى، وسيقوم فريق ترخيص المنشآت بالمنصة بالتواصل معك لمعاينة الأقسام وتفعيل الحساب.'
          : 'Your hospital registration request has been received! This is a mock/MVP demonstration model, and our healthcare facility verification team will contact you to inspect and activate your page.'
      );
    }, 600);
  };

  return (
    <div className="py-12 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {t('join_hospital_title')}
          </h1>
        </div>

        {/* Form Box */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          {successMsg ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="h-16 w-16 text-teal-600 mx-auto" />
              <h3 className="text-xl font-bold text-teal-800">{isRtl ? 'تم تسجيل طلب المنشأة' : 'Facility Pending'}</h3>
              <p className="text-sm text-teal-800 leading-relaxed font-cairo">
                {successMsg}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Arabic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('hospital_name')}</label>
                <div className="relative">
                  <Building2 className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: مستشفى الأردن"
                    className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                  />
                </div>
              </div>

              {/* Name English */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('hospital_name_en')}</label>
                <div className="relative">
                  <Building2 className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Jordan Hospital"
                    className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('city')}</label>
                <select
                  required
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                >
                  <option value="">-- {isRtl ? 'اختر المدينة' : 'Select City'} --</option>
                  {mockCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {isRtl ? city.name_ar : city.name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{isRtl ? 'هاتف التواصل الرئيسي للمستشفى' : 'Primary Hospital Phone'}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+96265000000"
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('address')}</label>
                <div className="relative">
                  <MapPin className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isRtl ? 'الشارع، المنطقة، اسم المجمع...' : 'Street, area, building name...'}
                    className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                  />
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-500 font-semibold leading-tight pt-2">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="text-teal-600 focus:ring-teal-500 rounded mt-0.5"
                />
                <span>{isRtl ? 'أقر بترخيص المنشأة الطبية وصحة الوثائق المرفقة.' : 'I certify that the healthcare facility is fully licensed.'}</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <span>{isLoading ? t('submitting') : t('submit')}</span>
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
