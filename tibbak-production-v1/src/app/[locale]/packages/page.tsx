import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getDoctorPackages, getHospitalPackages } from '@/lib/repositories/packages';
import PackageToggle from '@/components/packages/PackageToggle';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  return {
    title: isRtl ? 'باقات الاشتراك والترقية للمزودين - منصة طبّك الأردن' : 'Subscription & Upgrade Tiers for Providers - Tabibak Jordan',
    description: isRtl
      ? 'استعرض الباقات المتاحة للأطباء والمستشفيات لفتح قنوات التواصل والظهور المتميز وزيادة جذب الحالات.'
      : 'Explore subscription tiers for clinics and hospitals to enable direct contacts, premium visibility, and boost patient acquisitions.',
  };
}

interface PackagesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PackagesPage({ params }: PackagesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('packages');

  const doctorPackages = await getDoctorPackages();
  const hospitalPackages = await getHospitalPackages();

  return (
    <div className="py-12 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-3 font-cairo">
            {t('subtitle')}
          </p>
        </div>

        <PackageToggle
          doctorPackages={doctorPackages}
          hospitalPackages={hospitalPackages}
        />

      </div>
    </div>
  );
}
