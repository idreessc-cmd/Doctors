'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';
import { Menu, X, ChevronDown, Stethoscope, Building2, Globe, LogIn } from 'lucide-react';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = pathname?.includes('/admin') || pathname?.includes('/doctor-dashboard') || pathname?.includes('/hospital-dashboard');

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname || '/', { locale: newLocale });
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/doctors', label: t('nav.doctors') },
    { href: '/hospitals', label: t('nav.hospitals') },
    { href: '/specialties', label: t('nav.specialties') },
    { href: '/international-treatment', label: t('nav.international') },
  ];

  const moreLinks = [
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/packages', label: t('nav.packages') },
    { href: '/privacy', label: t('nav.privacy') },
    { href: '/terms', label: t('nav.terms') },
  ];

  if (isDashboard) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">
            {t('site.name')}
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={switchLanguage} className="btn btn-ghost btn-sm flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {locale === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            {t('site.name')}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-primary bg-primary-light' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative" onMouseEnter={() => setIsMoreOpen(true)} onMouseLeave={() => setIsMoreOpen(false)}>
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 flex items-center gap-1">
                {t('common.read_more')} <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={switchLanguage} className="btn btn-ghost btn-sm flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {locale === 'ar' ? 'English' : 'العربية'}
            </button>
            <Link href="/join-doctor" className="btn btn-outline btn-sm">
              <Stethoscope className="w-4 h-4" />
              {t('nav.join_doctor')}
            </Link>
            <Link href="/join-hospital" className="btn btn-outline btn-sm">
              <Building2 className="w-4 h-4" />
              {t('nav.join_hospital')}
            </Link>
            <Link href="/login" className="btn btn-primary btn-sm">
              <LogIn className="w-4 h-4" />
              {t('nav.login')}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden btn btn-ghost p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1">
            {[...navLinks, ...moreLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href="/join-doctor" className="block px-4 py-3 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg">
              {t('nav.join_doctor')}
            </Link>
            <Link href="/join-hospital" className="block px-4 py-3 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg">
              {t('nav.join_hospital')}
            </Link>
            <Link href="/login" className="block px-4 py-3 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg">
              {t('nav.login')}
            </Link>
            <button onClick={switchLanguage} className="w-full text-right px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              {locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
