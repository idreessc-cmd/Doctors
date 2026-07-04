'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { LogIn, Mail, Lock, Eye, EyeOff, Stethoscope, Building2, Shield, ChevronDown, User } from 'lucide-react';
import { authLogin, initializeStore, getAll } from '@/lib/store';

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [demoDoctors, setDemoDoctors] = useState<any[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    initializeStore();
    const doctors = getAll<any>('doctors');
    setDemoDoctors(doctors.slice(0, 10));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(locale === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }
    setSubmitting(true);
    try {
      const user = authLogin(email, password);
      if (user) {
        if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'doctor') router.push('/doctor-dashboard');
        else if (user.role === 'hospital') router.push('/hospital-dashboard');
        else router.push('/');
      } else {
        setError(t('auth.error_invalid'));
      }
    } catch {
      setError(locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const demoLogin = (doctorEmail: string) => {
    const user = authLogin(doctorEmail, 'doctor123');
    if (user) router.push('/doctor-dashboard');
  };

  const quickLogins = [
    { label: 'Admin', email: 'admin@tabibak.com', password: 'admin123', icon: Shield, color: 'text-vip' },
    { label: 'Doctor', email: 'doctor1@tabibak.com', password: 'doctor123', icon: Stethoscope, color: 'text-primary' },
    { label: 'Hospital', email: 'hospital1@tabibak.com', password: 'hospital123', icon: Building2, color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            {t('site.name')}
          </Link>
          <p className="text-gray-500 mt-2">{t('site.tagline')}</p>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {t('auth.login_title')}
          </h1>

          {error && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-4 mb-4">
              <span className="text-error font-medium text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('auth.email')} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input pl-10" placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email'} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('auth.password')} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10" placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary w-full btn-lg">
              <LogIn className="w-5 h-5" />
              {submitting ? (locale === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Logging in...') : t('auth.login_button')}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              {locale === 'ar' ? 'تسجيل دخول سريع للحسابات التجريبية:' : 'Quick Demo Login:'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLogins.map(item => (
                <button key={item.label} type="button"
                  onClick={() => { setEmail(item.email); setPassword(item.password); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                  {(locale === 'ar' ? { Admin: 'مدير', Doctor: 'طبيب', Hospital: 'مستشفى' } as any : { Admin: 'Admin', Doctor: 'Doctor', Hospital: 'Hospital' } as any)[item.label]}
                </button>
              ))}
            </div>
          </div>

          {demoDoctors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary py-2">
                <User className="w-4 h-4" />
                {locale === 'ar' ? 'تجربة لوحة طبيب (اختر من القائمة)' : 'Try Doctor Dashboard (select from list)'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showDemo ? 'rotate-180' : ''}`} />
              </button>
              {showDemo && (
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                  {demoDoctors.map(doc => (
                    <button key={doc.id} type="button" onClick={() => demoLogin(doc.user_id ? `doctor${doc.id.split('-')[1]}@tabibak.com` : 'doctor1@tabibak.com')}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-right">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {doc.name_ar?.charAt(0) || doc.name?.charAt(0)}
                      </div>
                      <div className="min-w-0 text-right">
                        <p className="text-sm font-medium truncate">{locale === 'ar' ? doc.name_ar : doc.name}</p>
                        <p className="text-xs text-gray-500 truncate">{doc.specialty_id?.replace('spec-', '')}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
