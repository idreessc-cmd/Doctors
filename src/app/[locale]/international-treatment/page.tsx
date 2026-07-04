'use client';

import { useState, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import { getAll, add } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { Specialty, Doctor, Hospital } from '@/types';

const countries = [
  'Saudi Arabia', 'Iraq', 'UAE', 'Kuwait', 'Qatar',
  'Oman', 'Bahrain', 'Yemen', 'Libya', 'Egypt',
  'Sudan', 'Syria', 'Palestine',
];

export default function InternationalTreatmentPage() {
  const t = useTranslations();
  const locale = useLocale();

  const specialties = getAll<Specialty>('specialties');
  const doctors = getAll<Doctor>('doctors');
  const hospitals = getAll<Hospital>('hospitals');

  const [form, setForm] = useState({
    patient_name: '',
    country: '',
    phone: '',
    whatsapp: '',
    email: '',
    age: '',
    gender: '',
    condition_description: '',
    specialty_id: '',
    has_previous_diagnosis: '',
    has_medical_reports: '',
    prefer_option: '',
    preferred_doctor_id: '',
    preferred_hospital_id: '',
    travel_date: '',
    budget: '',
    needs_hotel: false,
    needs_translator: false,
    needs_airport_pickup: false,
    notes: '',
    consent: false,
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.patient_name || !form.country || !form.phone || !form.condition_description || !form.consent) {
      setError(locale === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const prefersDoctor = form.prefer_option === 'doctor';
      const prefersHospital = form.prefer_option === 'hospital';

      const request = {
        id: generateId(),
        patient_name: form.patient_name,
        country: form.country,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        email: form.email || undefined,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        condition_description: form.condition_description,
        specialty_id: form.specialty_id || undefined,
        has_previous_diagnosis: form.has_previous_diagnosis === 'yes' ? true : form.has_previous_diagnosis === 'no' ? false : undefined,
        has_medical_reports: form.has_medical_reports === 'yes' ? true : form.has_medical_reports === 'no' ? false : undefined,
        files: files && files.length > 0 ? Array.from(files).map(f => f.name) : undefined,
        prefers_doctor: prefersDoctor || undefined,
        prefers_hospital: prefersHospital || undefined,
        preferred_doctor_id: form.preferred_doctor_id || undefined,
        preferred_hospital_id: form.preferred_hospital_id || undefined,
        travel_date: form.travel_date || undefined,
        budget: form.budget || undefined,
        needs_hotel: form.needs_hotel || undefined,
        needs_translator: form.needs_translator || undefined,
        needs_airport_pickup: form.needs_airport_pickup || undefined,
        notes: form.notes || undefined,
        consent: form.consent,
        status: 'new' as const,
        created_at: new Date().toISOString(),
      };

      add('international_requests', request);

      setSuccess(true);
      setForm({
        patient_name: '', country: '', phone: '', whatsapp: '', email: '',
        age: '', gender: '', condition_description: '', specialty_id: '',
        has_previous_diagnosis: '', has_medical_reports: '', prefer_option: '',
        preferred_doctor_id: '', preferred_hospital_id: '', travel_date: '',
        budget: '', needs_hotel: false, needs_translator: false,
        needs_airport_pickup: false, notes: '', consent: false,
      });
      setFiles(null);

      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError(locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'input';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const requiredMark = <span className="text-error">*</span>;

  const RadioGroup = ({ name, value, options, onChange }: { name: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-4">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-5 h-5 accent-primary"
          />
          <span className="text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('international.title')}</h1>
          <p className="text-lg text-gray-600">{t('international.subtitle')}</p>
        </div>

        {success && (
          <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success shrink-0" />
            <span className="text-success font-medium">{t('international.success')}</span>
          </div>
        )}

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-xl p-4 mb-6">
            <span className="text-error font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('international.patient_name')} {requiredMark}</label>
                <input type="text" value={form.patient_name} onChange={e => handleChange('patient_name', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{t('international.country')} {requiredMark}</label>
                <select value={form.country} onChange={e => handleChange('country', e.target.value)} className="select" required>
                  <option value="">{locale === 'ar' ? 'اختر الدولة' : 'Select country'}</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t('international.phone')} {requiredMark}</label>
                <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{t('international.whatsapp')}</label>
                <input type="tel" value={form.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t('international.email')}</label>
                <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('international.age')}</label>
                  <input type="number" min={0} max={150} value={form.age} onChange={e => handleChange('age', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('international.gender')}</label>
                  <RadioGroup
                    name="gender"
                    value={form.gender}
                    onChange={v => handleChange('gender', v)}
                    options={[
                      { value: 'male', label: t('international.male') },
                      { value: 'female', label: t('international.female') },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'ar' ? 'المعلومات الطبية' : 'Medical Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('international.condition')} {requiredMark}</label>
                <textarea rows={5} value={form.condition_description} onChange={e => handleChange('condition_description', e.target.value)} className={`${inputClass} resize-none`} required />
              </div>
              <div>
                <label className={labelClass}>{t('international.specialty')}</label>
                <select value={form.specialty_id} onChange={e => handleChange('specialty_id', e.target.value)} className="select">
                  <option value="">{locale === 'ar' ? 'اختر التخصص' : 'Select specialty'}</option>
                  {specialties.filter(s => s.is_active).map(s => (
                    <option key={s.id} value={s.id}>{locale === 'ar' ? s.name_ar : s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t('international.has_diagnosis')}</label>
                <RadioGroup
                  name="has_diagnosis"
                  value={form.has_previous_diagnosis}
                  onChange={v => handleChange('has_previous_diagnosis', v)}
                  options={[
                    { value: 'yes', label: t('common.yes') },
                    { value: 'no', label: t('common.no') },
                  ]}
                />
              </div>
              <div>
                <label className={labelClass}>{t('international.has_reports')}</label>
                <RadioGroup
                  name="has_reports"
                  value={form.has_medical_reports}
                  onChange={v => handleChange('has_medical_reports', v)}
                  options={[
                    { value: 'yes', label: t('common.yes') },
                    { value: 'no', label: t('common.no') },
                  ]}
                />
              </div>
              <div>
                <label className={labelClass}>{t('international.upload_files')}</label>
                <input
                  type="file"
                  multiple
                  onChange={e => setFiles(e.target.files)}
                  className={`${inputClass} pt-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium`}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'ar' ? 'التفضيلات' : 'Preferences'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  {locale === 'ar' ? 'أفضل:' : 'I prefer:'}
                </label>
                <RadioGroup
                  name="prefer_option"
                  value={form.prefer_option}
                  onChange={v => handleChange('prefer_option', v)}
                  options={[
                    { value: 'doctor', label: t('international.prefer_doctor') },
                    { value: 'hospital', label: t('international.prefer_hospital') },
                    { value: 'none', label: locale === 'ar' ? 'لا تفضيل' : 'No preference' },
                  ]}
                />
              </div>
              {form.prefer_option === 'doctor' && (
                <div>
                  <label className={labelClass}>{t('international.preferred_doctor')}</label>
                  <select value={form.preferred_doctor_id} onChange={e => handleChange('preferred_doctor_id', e.target.value)} className="select">
                    <option value="">{locale === 'ar' ? 'اختر طبيبًا' : 'Select doctor'}</option>
                    {doctors.filter(d => d.is_active).map(d => (
                      <option key={d.id} value={d.id}>{locale === 'ar' ? d.name_ar : d.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {form.prefer_option === 'hospital' && (
                <div>
                  <label className={labelClass}>{t('international.preferred_hospital')}</label>
                  <select value={form.preferred_hospital_id} onChange={e => handleChange('preferred_hospital_id', e.target.value)} className="select">
                    <option value="">{locale === 'ar' ? 'اختر مستشفى' : 'Select hospital'}</option>
                    {hospitals.filter(h => h.is_active).map(h => (
                      <option key={h.id} value={h.id}>{locale === 'ar' ? h.name_ar : h.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('international.travel_date')}</label>
                  <input type="date" value={form.travel_date} onChange={e => handleChange('travel_date', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('international.budget')}</label>
                  <input type="text" value={form.budget} onChange={e => handleChange('budget', e.target.value)} className={inputClass} placeholder={locale === 'ar' ? 'مثال: 5000 - 10000 USD' : 'e.g. 5000 - 10000 USD'} />
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'ar' ? 'الخدمات الإضافية' : 'Additional Services'}
            </h2>
            <div className="space-y-3">
              {[
                { key: 'needs_hotel', label: t('international.needs_hotel') },
                { key: 'needs_translator', label: t('international.needs_translator') },
                { key: 'needs_airport_pickup', label: t('international.needs_airport') },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={(form as any)[item.key] as boolean}
                    onChange={e => handleChange(item.key, e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-gray-700 text-base">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes & Consent */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'ar' ? 'ملاحظات وأذونات' : 'Notes & Consent'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('international.notes')}</label>
                <textarea rows={4} value={form.notes} onChange={e => handleChange('notes', e.target.value)} className={`${inputClass} resize-none`} />
              </div>
              <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={e => handleChange('consent', e.target.checked)}
                  className="w-5 h-5 accent-primary mt-0.5 shrink-0"
                  required
                />
                <span className="text-gray-700 text-base">
                  {t('international.consent')} {requiredMark}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full btn-lg"
          >
            {submitting
              ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...')
              : t('international.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
