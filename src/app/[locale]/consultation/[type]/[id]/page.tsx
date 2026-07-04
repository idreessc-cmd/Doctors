'use client';

import { useState, use, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { ArrowLeft, User, Phone, MessageSquare, Paperclip, CheckCircle } from 'lucide-react';
import { getById, add, incrementStat } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { Doctor, Hospital } from '@/types';

type Props = {
  params: Promise<{ locale: string; type: string; id: string }>;
};

export default function ConsultationPage({ params }: Props) {
  const { type, id } = use(params);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const entity = type === 'doctor'
    ? getById<Doctor>('doctors', id)
    : getById<Hospital>('hospitals', id);

  const entityName = entity
    ? locale === 'ar'
      ? (entity as any).name_ar || (entity as any).name
      : (entity as any).name
    : '';

  const [form, setForm] = useState({
    patient_name: '',
    patient_phone: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!entity) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          {locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <Link href="/" className="btn btn-primary">
          {t('nav.home')}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.patient_name || !form.patient_phone || !form.message) {
      setError(locale === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const consultation = {
        id: generateId(),
        patient_name: form.patient_name,
        patient_phone: form.patient_phone,
        message: form.message,
        file_url: file ? file.name : undefined,
        ...(type === 'doctor' ? { doctor_id: id } : { hospital_id: id }),
        status: 'new' as const,
        created_at: new Date().toISOString(),
      };

      add('consultations', consultation);
      incrementStat(type, id, 'consultations_count');

      setSuccess(true);
      setForm({ patient_name: '', patient_phone: '', message: '' });
      setFile(null);

      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError(locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{locale === 'ar' ? 'رجوع' : 'Back'}</span>
        </button>

        <div className="card mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('consultation.title')}</h1>
          <p className="text-lg text-primary font-medium">{entityName}</p>
        </div>

        {success && (
          <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success shrink-0" />
            <span className="text-success font-medium">{t('consultation.success')}</span>
          </div>
        )}

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-xl p-4 mb-6">
            <span className="text-error font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('consultation.patient_name')} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={form.patient_name}
                onChange={e => handleChange('patient_name', e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('consultation.phone')} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={form.patient_phone}
                onChange={e => handleChange('patient_phone', e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('consultation.message')} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                rows={6}
                value={form.message}
                onChange={e => handleChange('message', e.target.value)}
                className="input pl-10 resize-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('consultation.file')}
            </label>
            <div className="relative">
              <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="input pl-10 pt-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm file:font-medium"
              />
            </div>
            {file && (
              <p className="text-sm text-gray-500 mt-1">
                {locale === 'ar' ? 'الملف المرفق:' : 'Attached file:'} {file.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full btn-lg"
          >
            {submitting
              ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...')
              : t('consultation.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
