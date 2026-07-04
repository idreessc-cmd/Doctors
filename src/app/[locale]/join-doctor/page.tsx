'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Stethoscope, UserPlus, CheckCircle, Mail, Phone, Lock, MapPin, Award, Users, Globe, DollarSign, Star
} from 'lucide-react';
import { initializeStore, getAll, add } from '@/lib/store';
import { generateId } from '@/lib/utils';
import type { Specialty, City, Doctor, User, Package } from '@/types';

export default function JoinDoctorPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    email: '',
    phone: '',
    password: '',
    specialty_id: '',
    city_id: '',
  });
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState({ email: '', password: '' });

  useEffect(() => {
    initializeStore();
    setSpecialties(getAll<Specialty>('specialties'));
    setCities(getAll<City>('cities'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name_ar.trim() || !formData.name_en.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password.trim() || !formData.specialty_id || !formData.city_id) {
      setError(locale === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    const users = getAll<User>('users');
    if (users.find(u => u.email === formData.email)) {
      setError(locale === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already in use');
      return;
    }

    const userId = `user-doctor-${generateId()}`;
    const doctorId = `doctor-${generateId()}`;

    const newUser: User & { password: string } = {
      id: userId,
      email: formData.email,
      password: formData.password,
      name: formData.name_en,
      name_ar: formData.name_ar,
      phone: formData.phone,
      role: 'doctor',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const defaultPackage = getAll<Package>('packages').find(p => p.type === 'doctor' && p.price === 0);

    const newDoctor: Doctor = {
      id: doctorId,
      user_id: userId,
      name: formData.name_en,
      name_ar: formData.name_ar,
      specialty_id: formData.specialty_id,
      years_experience: 0,
      fees: 0,
      city_id: formData.city_id,
      accepts_booking: true,
      accepts_consultation: true,
      accepts_international: false,
      rank: 'normal',
      verified: false,
      package_id: defaultPackage?.id,
      ranking_score: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    add('users', newUser);
    add('doctors', newDoctor);

    setSuccessInfo({ email: formData.email, password: formData.password });
    setStep('success');
  };

  if (step === 'info') {
    return (
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex p-3 rounded-full bg-primary-light text-primary mb-4">
              <Stethoscope className="w-8 h-8" />
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.join_doctor')}</h1>
            <p className="text-lg text-gray-500">
              {locale === 'ar' ? 'انضم إلى أكبر شبكة أطباء في الأردن ووسّع نطاق مرضاك' : 'Join the largest doctor network in Jordan and expand your patient reach'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Users className="w-6 h-6" />, title: locale === 'ar' ? 'مرضى جدد' : 'New Patients', desc: locale === 'ar' ? 'استقبل مرضى من داخل الأردن وخارجه' : 'Receive patients from Jordan and abroad' },
              { icon: <Globe className="w-6 h-6" />, title: locale === 'ar' ? 'مرضى دوليون' : 'International Patients', desc: locale === 'ar' ? 'وصول إلى آلاف المرضى من الدول العربية' : 'Access thousands of patients from Arab countries' },
              { icon: <DollarSign className="w-6 h-6" />, title: locale === 'ar' ? 'أسعار تنافسية' : 'Competitive Pricing', desc: locale === 'ar' ? 'اختر أسعارك بنفسك وتحكم في جدولك' : 'Set your own prices and manage your schedule' },
              { icon: <Star className="w-6 h-6" />, title: locale === 'ar' ? 'ظهور مميز' : 'Featured Visibility', desc: locale === 'ar' ? 'اختر باقتك وكن في مقدمة النتائج' : 'Choose your package and be at the top of results' },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <span className="inline-flex p-2 rounded-lg bg-primary-light text-primary mb-3">{item.icon}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => setStep('form')} className="btn btn-primary btn-lg">
              <UserPlus className="w-5 h-5" />
              {locale === 'ar' ? 'سجل الآن كطبيب' : 'Register Now as a Doctor'}
            </button>
            <p className="mt-3 text-sm text-gray-400">
              {locale === 'ar' ? 'التسجيل مجاني تماماً' : 'Registration is completely free'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account Created Successfully'}
          </h2>
          <p className="text-gray-500 mb-6">
            {locale === 'ar' ? 'يمكنك الآن تسجيل الدخول باستخدام البيانات التالية:' : 'You can now login using the following credentials:'}
          </p>
          <div className="card p-6 text-left space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
              <span className="font-mono font-medium text-gray-900">{successInfo.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{locale === 'ar' ? 'كلمة المرور' : 'Password'}</span>
              <span className="font-mono font-medium text-gray-900">{successInfo.password}</span>
            </div>
          </div>
          <Link href="/login" className="btn btn-primary">
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{locale === 'ar' ? 'تسجيل طبيب جديد' : 'Register New Doctor'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *</label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                className="input"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *</label>
              <input
                type="text"
                value={formData.name_en}
                onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline-block ml-1" />
              {t('auth.email')} *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline-block ml-1" />
              {t('auth.phone')} *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="input"
              placeholder="+962 7 0000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 inline-block ml-1" />
              {t('auth.password')} *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Award className="w-4 h-4 inline-block ml-1" />
              {t('doctor.filter_specialty')} *
            </label>
            <select
              value={formData.specialty_id}
              onChange={e => setFormData({ ...formData, specialty_id: e.target.value })}
              className="select"
            >
              <option value="">{locale === 'ar' ? 'اختر التخصص' : 'Select specialty'}</option>
              {specialties.map(s => (
                <option key={s.id} value={s.id}>{locale === 'ar' ? s.name_ar : s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline-block ml-1" />
              {t('doctor.filter_city')} *
            </label>
            <select
              value={formData.city_id}
              onChange={e => setFormData({ ...formData, city_id: e.target.value })}
              className="select"
            >
              <option value="">{locale === 'ar' ? 'اختر المدينة' : 'Select city'}</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{locale === 'ar' ? c.name_ar : c.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            <UserPlus className="w-4 h-4" />
            {t('auth.register_button')}
          </button>
        </form>
      </div>
    </div>
  );
}


