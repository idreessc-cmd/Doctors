'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, Globe, HeartPulse, ChevronDown, Stethoscope, Building2 } from 'lucide-react';

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const switchLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/doctors', label: t('doctors') },
    { href: '/hospitals', label: t('hospitals') },
    { href: '/packages', label: t('packages') },
    { href: '/international-treatment', label: t('international') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-teal-600">
          <HeartPulse className="h-7 w-7 animate-pulse" />
          <span className="text-xl font-bold tracking-tight text-slate-800 font-cairo">
            {locale === 'ar' ? 'طبّك' : 'Tabibak'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                pathname === link.href ? 'text-teal-600 border-b-2 border-teal-500 py-1' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={switchLanguage}
            className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors border border-gray-200 px-3 py-1.5 rounded-full hover:bg-slate-50"
            title={locale === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="h-4 w-4" />
            <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Join dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsJoinOpen(!isJoinOpen)}
              className="flex items-center gap-1 text-sm font-medium bg-teal-50 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <span>{locale === 'ar' ? 'سجل معنا' : 'Join Us'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isJoinOpen && (
              <div className={`absolute ${locale === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 rounded-xl bg-white p-2 shadow-lg border border-gray-100 ring-1 ring-black/5`}>
                <Link
                  href="/join-doctor"
                  onClick={() => setIsJoinOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Stethoscope className="h-4 w-4 text-teal-600" />
                  {t('join_doctor')}
                </Link>
                <Link
                  href="/join-hospital"
                  onClick={() => setIsJoinOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Building2 className="h-4 w-4 text-teal-600" />
                  {t('join_hospital')}
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="text-sm font-medium bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            {t('contact')}
          </Link>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={switchLanguage}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 border border-gray-200 px-2 py-1 rounded-full hover:bg-slate-50"
          >
            <Globe className="h-3 w-3" />
            <span>{locale === 'ar' ? 'En' : 'عرب'}</span>
          </button>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 hover:text-teal-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-inner">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-2">
            <Link
              href="/join-doctor"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Stethoscope className="h-5 w-5 text-teal-600" />
              {t('join_doctor')}
            </Link>
            <Link
              href="/join-hospital"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Building2 className="h-5 w-5 text-teal-600" />
              {t('join_hospital')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
