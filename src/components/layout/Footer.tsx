'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations();

  const quickLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/doctors', label: t('nav.doctors') },
    { href: '/hospitals', label: t('nav.hospitals') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const doctorLinks = [
    { href: '/join-doctor', label: t('nav.join_doctor') },
    { href: '/packages', label: t('nav.packages') },
    { href: '/login', label: t('nav.login') },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('site.name')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{t('site.description')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('common.quick_links') || 'Quick Links'}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('common.for_doctors') || 'For Doctors'}</h3>
            <ul className="space-y-2">
              {doctorLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('common.contact_us')}</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>info@tabibak.jo</li>
              <li>+962 7 0000 0000</li>
              <li>{t('site.tagline')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between py-6 gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t('site.name')}. {t('common.rights')}.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{t('common.social_media') || 'Social Media'}</span>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">FB</span>
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">X</span>
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">IG</span>
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">YT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
