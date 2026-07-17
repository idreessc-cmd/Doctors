'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { HeartPulse, Stethoscope, Building2, HelpCircle, Shield, FileText } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-400">
              <HeartPulse className="h-7 w-7" />
              <span className="text-xl font-bold tracking-tight text-white font-cairo">
                {locale === 'ar' ? 'طبّك' : 'Tabibak'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-cairo">
              {locale === 'ar' 
                ? 'المنصة الوطنية الأردنية الأولى لترويج السياحة العلاجية وربط المرضى محلياً وعالمياً بأرقى المستشفيات والأطباء المعتمدين.'
                : 'The premier Jordanian national platform promoting medical tourism, connecting patients locally and globally with top accredited hospitals and clinics.'
              }
            </p>
          </div>

          {/* Patients Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-cairo mb-4">
              {locale === 'ar' ? 'للمرضى' : 'For Patients'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-500" />
                  {t('doctors')}
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-teal-500" />
                  {t('hospitals')}
                </Link>
              </li>
              <li>
                <Link href="/international-treatment" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <HeartPulse className="h-3.5 w-3.5 text-teal-500" />
                  {t('international')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Providers Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-cairo mb-4">
              {locale === 'ar' ? 'لمقدمي الخدمة' : 'For Providers'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/join-doctor" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-500" />
                  {t('join_doctor')}
                </Link>
              </li>
              <li>
                <Link href="/join-hospital" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-teal-500" />
                  {t('join_hospital')}
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-teal-500" />
                  {t('packages')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Info Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100 font-cairo mb-4">
              {locale === 'ar' ? 'معلومات قانونية' : 'Legal & Support'}
            </h3>
            <ul className="space-y-2 text-sm font-cairo">
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-teal-500" />
                  {t('contact')}
                </Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-500 cursor-not-allowed">
                  <Shield className="h-3.5 w-3.5" />
                  {locale === 'ar' ? 'سياسة الخصوصية (قريباً)' : 'Privacy Policy (Soon)'}
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-500 cursor-not-allowed">
                  <FileText className="h-3.5 w-3.5" />
                  {locale === 'ar' ? 'إخلاء المسؤولية الطبية' : 'Medical Disclaimer'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-cairo">
            &copy; {new Date().getFullYear()} {locale === 'ar' ? 'منصة طبّك الأردن. جميع الحقوق محفوظة.' : 'Tabibak Jordan Platform. All rights reserved.'}
          </p>
          <div className="flex gap-4 text-xs text-slate-500 font-cairo">
            <span>{locale === 'ar' ? 'تطوير هندسي إنتاجي MVP V1' : 'Production Grade MVP V1'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
