'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createInternationalRequest } from '@/lib/repositories/international-requests';
import { CheckCircle, User, Phone, Mail, Compass } from 'lucide-react';
import { mockSpecialties } from '@/data/mock/specialties';

export default function InternationalForm() {
  const t = useTranslations('forms');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [desc, setDesc] = useState('');
  const [budget, setBudget] = useState('');
  
  // Accommodation switches
  const [hotel, setHotel] = useState(false);
  const [translator, setTranslator] = useState(false);
  const [airport, setAirport] = useState(false);
  const [consent, setConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !country || !specialtyId || !desc || !consent) return;

    setIsLoading(true);
    try {
      const res = await createInternationalRequest({
        target_type: 'general',
        doctor_id: null,
        hospital_id: null,
        patient_name: name,
        country,
        phone,
        whatsapp: phone, // mock whatsapp
        email,
        age: 35, // default mock age
        gender: 'male', // default mock gender
        condition_description: desc,
        specialty_id: specialtyId,
        budget_range: budget || null,
        needs_hotel: hotel,
        needs_translator: translator,
        needs_airport_pickup: airport,
        consent_to_share: consent
      });

      if (res.ok) {
        setSuccessMsg(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-3xl mx-auto">
      {successMsg ? (
        <div className="bg-teal-50 border border-teal-200/50 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-teal-600 mx-auto" />
          <h3 className="text-xl font-bold text-teal-800">{isRtl ? 'تم إرسال طلبك بنجاح' : 'Request Sent Successfully'}</h3>
          <p className="text-sm text-teal-800 leading-relaxed font-cairo">
            {successMsg}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-cairo">
              <Compass className="h-5 w-5 text-teal-600 animate-spin" />
              {isRtl ? 'أدخل تفاصيل رحلتك العلاجية بالأردن' : 'Enter details for your medical trip to Jordan'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('patient_name')}</label>
              <div className="relative">
                <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد علي"
                  className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                />
              </div>
            </div>

            {/* Current Country */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('country')}</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={isRtl ? 'مثال: السعودية، العراق' : 'e.g. Saudi Arabia'}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('patient_phone')}</label>
              <div className="relative">
                <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966500000000"
                  className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('patient_email')}</label>
              <div className="relative">
                <Mail className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className={`w-full ${isRtl ? 'pr-9' : 'pl-9'} py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                />
              </div>
            </div>

            {/* Required Specialty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('specialty_required')}</label>
              <select
                required
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
              >
                <option value="">-- {t('specialty_required')} --</option>
                {mockSpecialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {isRtl ? spec.name_ar : spec.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('budget')}</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
              >
                <option value="">{isRtl ? 'غير محدد' : 'Not specified'}</option>
                <option value="under_3k">{isRtl ? 'أقل من 3000 دولار' : 'Under 3000 USD'}</option>
                <option value="3k_10k">3000 - 10000 USD</option>
                <option value="above_10k">{isRtl ? 'أكثر من 10000 دولار' : 'Above 10000 USD'}</option>
              </select>
            </div>

          </div>

          {/* Condition Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{t('condition_desc')}</label>
            <textarea
              required
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={isRtl ? 'أدخل التاريخ المرضي، الأعراض والتشخيص الحالي...' : 'Enter medical history, symptoms, and current diagnosis...'}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
            />
          </div>

          {/* Logistics Switches */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2 font-cairo">
              {isRtl ? 'الخدمات اللوجستية المطلوبة في الأردن' : 'Logistics Services Needed in Jordan'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-semibold bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <input
                  type="checkbox"
                  checked={hotel}
                  onChange={(e) => setHotel(e.target.checked)}
                  className="text-teal-600 focus:ring-teal-500 rounded"
                />
                <span>{isRtl ? 'حجز فندق' : 'Hotel Booking'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-semibold bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <input
                  type="checkbox"
                  checked={translator}
                  onChange={(e) => setTranslator(e.target.checked)}
                  className="text-teal-600 focus:ring-teal-500 rounded"
                />
                <span>{isRtl ? 'مترجم طبي' : 'Medical Translator'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 font-semibold bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <input
                  type="checkbox"
                  checked={airport}
                  onChange={(e) => setAirport(e.target.checked)}
                  className="text-teal-600 focus:ring-teal-500 rounded"
                />
                <span>{isRtl ? 'استقبال المطار' : 'Airport Pickup'}</span>
              </label>
            </div>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-500 font-semibold leading-tight">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="text-teal-600 focus:ring-teal-500 rounded mt-0.5"
            />
            <span>{t('consent')}</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !consent}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>{isLoading ? t('submitting') : t('submit')}</span>
          </button>

        </form>
      )}
    </div>
  );
}
