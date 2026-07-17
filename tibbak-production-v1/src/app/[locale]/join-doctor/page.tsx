'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, Stethoscope, User, GraduationCap, MapPin, DollarSign } from 'lucide-react';
import { mockSpecialties } from '@/data/mock/specialties';
import { mockCities } from '@/data/mock/cities';

export default function JoinDoctorPage() {
  const t = useTranslations('forms');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !experience || !fee || !specialtyId || !cityId || !phone || !consent) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(
        isRtl
          ? 'تم استلام طلب التسجيل كطبيب بنجاح! هذا نموذج تجريبي في المرحلة الأولى، وسيقوم فريق المراجعة الطبية بالتحقق من البيانات والتواصل معك لتفعيل الحساب.'
          : 'Your doctor registration request has been received! This is a mock/MVP demonstration model, and our medical credentials team will review and contact you to activate your account.'
      );
    }, 600);
  };

  return (
    <div className="py-12 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {t('join_doctor_title')}
          </h1>
        </div>

        {/* Form Box */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          {successMsg ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="h-16 w-16 text-teal-600 mx-auto" />
              <h3 className="text-xl font-bold text-teal-800">{isRtl ? 'تم تسجيل الطلب' : 'Registration Pending'}</h3>
              <p className="text-sm text-teal-800 leading-relaxed font-cairo">
                {successMsg}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Arabic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('doctor_name')}</label>
                <div className="relative">
                  <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: د. أحمد الحسن"
                    className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                  />
                </div>
              </div>

              {/* Name English */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('doctor_name_en')}</label>
                <div className="relative">
                  <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Dr. Ahmed Al-Hassan"
                    className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                  />
                </div>
              </div>

              {/* Experience and Fee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('experience_years')}</label>
                  <div className="relative">
                    <GraduationCap className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                    <input
                      type="number"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="10"
                      className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('consultation_fee')}</label>
                  <div className="relative">
                    <DollarSign className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                    <input
                      type="number"
                      required
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      placeholder="25"
                      className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                    />
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('specialty_required')}</label>
                <select
                  required
                  value={specialtyId}
                  onChange={(e) => setSpecialtyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                >
                  <option value="">-- {isRtl ? 'اختر التخصص' : 'Select Specialty'} --</option>
                  {mockSpecialties.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {isRtl ? spec.name_ar : spec.name_en}
                    </option>
                  ))}
                </select>
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('patient_phone')}</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962791234567"
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isRtl ? 'الشارع، اسم العمارة، الطابق...' : 'Street, building name, floor...'}
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
                <span>{isRtl ? 'أقر بصحة البيانات الطبية والمؤهلات المرفقة.' : 'I certify that the provided credentials are true and correct.'}</span>
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
