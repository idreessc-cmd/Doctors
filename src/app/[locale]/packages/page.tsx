'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Check, Star, Crown, Zap, Building2, Stethoscope } from 'lucide-react';
import { initializeStore, getAll, getCurrentUser } from '@/lib/store';
import { cn, formatCurrency } from '@/lib/utils';
import type { Package } from '@/types';

const cardBorders: Record<string, string> = {
  free: 'border-gray-200',
  premium: 'border-amber-300',
  vip: 'border-vip-gold',
  default: 'border-gray-200',
};

const cardBadge: Record<string, string> = {
  free: '',
  premium: 'الأكثر شيوعاً',
  vip: 'الأفضل',
};

const cardBadgeEn: Record<string, string> = {
  free: '',
  premium: 'Most Popular',
  vip: 'Best Value',
};

export default function PackagesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userPkg, setUserPkg] = useState<string | null>(null);

  useEffect(() => {
    initializeStore();
    setPackages(getAll<Package>('packages'));
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const doctors = getAll<any>('doctors');
      const hospitals = getAll<any>('hospitals');
      if (user.role === 'doctor') {
        const doc = doctors.find((d: any) => d.user_id === user.id);
        if (doc) setUserPkg(doc.package_id);
      } else if (user.role === 'hospital') {
        const hosp = hospitals.find((h: any) => h.user_id === user.id);
        if (hosp) setUserPkg(hosp.package_id);
      }
    }
  }, []);

  const doctorPkgs = packages.filter(p => p.type === 'doctor' && p.is_active);
  const hospitalPkgs = packages.filter(p => p.type === 'hospital' && p.is_active);

  const renderPackageCard = (pkg: Package, index: number) => {
    const isDoctor = pkg.type === 'doctor';
    const pkgKey = pkg.name.toLowerCase().replace(/\s+/g, '');
    const isCurrent = userPkg === pkg.id;
    const isPopular = pkg.name.toLowerCase().includes('premium');
    const isVip = pkg.name.toLowerCase().includes('vip');

    return (
      <div
        key={pkg.id}
        className={cn(
          'card relative flex flex-col p-6 border-2 transition-all hover:shadow-lg',
          cardBorders[pkgKey] || cardBorders.default,
          isVip && 'ring-2 ring-vip-gold/20'
        )}
      >
        {/* Badge */}
        {(isPopular || isVip) && (
          <span className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white',
            isVip ? 'bg-vip-gold' : 'bg-primary'
          )}>
            {locale === 'ar' ? cardBadge[pkgKey] || cardBadgeEn[pkgKey] : cardBadgeEn[pkgKey] || cardBadge[pkgKey]}
          </span>
        )}

        {/* Current badge */}
        {isCurrent && (
          <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
            {t('package.current')}
          </span>
        )}

        {/* Header */}
        <div className="text-center mb-6 mt-2">
          <div className="flex justify-center mb-3">
            {isVip ? <Crown className="w-10 h-10 text-vip-gold" /> : isPopular ? <Star className="w-10 h-10 text-amber-500" /> : <Zap className="w-10 h-10 text-gray-400" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{locale === 'ar' ? pkg.name_ar : pkg.name}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900">{pkg.price === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : formatCurrency(pkg.price)}</span>
            {pkg.price > 0 && <span className="text-sm text-gray-400">{t('package.per_month')}</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('package.monthly_contacts')}: {pkg.monthly_contacts_limit === 999 ? (locale === 'ar' ? 'غير محدود' : 'Unlimited') : pkg.monthly_contacts_limit}
          </p>
        </div>

        {/* Features */}
        <div className="flex-1 space-y-2 mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('package.features')}</p>
          {pkg.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isDoctor && (
          <button
            className={cn(
              'btn w-full',
              isCurrent ? 'btn-outline' : isVip ? 'btn bg-vip-gold text-white hover:bg-amber-600' : 'btn-primary'
            )}
            disabled={isCurrent}
          >
            {isCurrent ? (locale === 'ar' ? 'باقتك الحالية' : 'Current Package') : (userPkg ? t('package.upgrade') : t('package.select'))}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.packages')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          {locale === 'ar' ? 'اختر الباقة المناسبة لك وابدأ في استقبال المرضى من داخل الأردن وخارجه' : 'Choose the right package and start receiving patients from Jordan and abroad'}
        </p>
      </div>

      {/* Doctor Packages */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          <Stethoscope className="w-6 h-6 inline-block text-primary ml-2" />
          {locale === 'ar' ? 'باقات الأطباء' : 'Doctor Packages'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {doctorPkgs.map((pkg, i) => renderPackageCard(pkg, i))}
        </div>
      </div>

      {/* Hospital Packages */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          <Building2 className="w-6 h-6 inline-block text-green-600 ml-2" />
          {locale === 'ar' ? 'باقات المستشفيات' : 'Hospital Packages'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {hospitalPkgs.map((pkg, i) => renderPackageCard(pkg, i))}
        </div>
      </div>
    </div>
  );
}


