'use client';

import { useState, FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { LogIn, Mail, Lock, Eye, EyeOff, Stethoscope, Building2, Shield } from 'lucide-react';
import { authLogin } from '@/lib/store';

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('auth.password')} <span className="text-error">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder={locale === 'ar' ? 'كلمة المرور' : 'Password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full btn-lg"
            >
              <LogIn className="w-5 h-5" />
              {submitting
                ? (locale === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Logging in...')
                : t('auth.login_button')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              {locale === 'ar' ? 'تسجيل دخول سريع:' : 'Quick Login:'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickLogins.map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => { setEmail(item.email); setPassword(item.password); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 ${item.color}`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {locale === 'ar'
                    ? ({ Admin: 'مدير', Doctor: 'طبيب', Hospital: 'مستشفى' } as any)[item.label] || item.label
                    : item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
