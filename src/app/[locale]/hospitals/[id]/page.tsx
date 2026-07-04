'use client';

import { useEffect, useState, useMemo } from 'react';
import { use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft, Star, Shield, Crown, Calendar, Phone,
  MapPin, Globe, CheckCircle, Award, Building2,
  Languages, Stethoscope, ExternalLink, FileText, DollarSign,
  HeartPulse, BadgeCheck, Mail, ChevronRight
} from 'lucide-react';
import { getAll, getById, initializeStore, incrementStat } from '@/lib/store';
import { formatCurrency, getInitials, getRankLabel, getRankColor, cn } from '@/lib/utils';
import type { Hospital, City, Area, Doctor, Specialty } from '@/types';

const rankConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  verified: { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
  premium: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  vip: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50' },
};

const logoColors = [
  'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600',
  'bg-amber-100 text-amber-600', 'bg-rose-100 text-rose-600', 'bg-cyan-100 text-cyan-600',
  'bg-indigo-100 text-indigo-600', 'bg-teal-100 text-teal-600', 'bg-orange-100 text-orange-600',
];

function getLogoColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return logoColors[Math.abs(hash) % logoColors.length];
}

export default function HospitalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStore();

    const h = getById<Hospital>('hospitals', id);
    const allCities = getAll<City>('cities');
    const allAreas = getAll<Area>('areas');
    const allDoctors = getAll<Doctor>('doctors');
    const allSpecialties = getAll<Specialty>('specialties');

    if (h) {
      incrementStat('hospital', id, 'profile_views');
    }

    setHospital(h || null);
    setCities(allCities);
    setAreas(allAreas);
    setDoctors(allDoctors);
    setSpecialties(allSpecialties);
    setLoading(false);
  }, [id]);

  const city = useMemo(() =>
    cities.find(c => c.id === hospital?.city_id),
    [cities, hospital]
  );

  const area = useMemo(() =>
    areas.find(a => a.id === hospital?.area_id),
    [areas, hospital]
  );

  const affiliatedDoctors = useMemo(() => {
    if (!hospital) return [];
    return doctors
      .filter(d => d.hospital_affiliation?.includes(hospital.name) || d.hospital_affiliation?.includes(hospital.name_ar))
      .slice(0, 8);
  }, [doctors, hospital]);

  const displayName = hospital
    ? (locale === 'ar' && hospital.name_ar ? hospital.name_ar : hospital.name)
    : '';

  const logoColor = hospital ? getLogoColor(hospital.id) : '';
  const rankCfg = hospital && hospital.rank !== 'normal' ? rankConfig[hospital.rank] : null;
  const RankIcon = rankCfg?.icon;

  const departments = hospital?.departments?.split('，').filter(Boolean) || [];

  const handleUploadReport = () => {
    alert(locale === 'ar' ? 'سيتم تفعيل هذه الميزة قريبًا' : 'This feature will be available soon');
  };

  const handleRequestCost = () => {
    alert(locale === 'ar' ? 'سيتم تفعيل هذه الميزة قريبًا' : 'This feature will be available soon');
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="skeleton h-48 w-full mb-8 rounded-xl" />
        <div className="skeleton h-8 w-48 mb-4" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="container-custom py-16 text-center">
        <Building2 className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600 mb-2">
          {locale === 'ar' ? 'المستشفى غير موجود' : 'Hospital Not Found'}
        </h1>
        <p className="text-gray-400 mb-6">
          {locale === 'ar' ? 'قد يكون قد تم حذف هذا المستشفى أو أن الرابط غير صحيح' : 'This hospital may have been removed or the link is invalid'}
        </p>
        <Link href="/hospitals" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          {locale === 'ar' ? 'العودة للمستشفيات' : 'Back to Hospitals'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 md:py-8">
      <Link href="/hospitals" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        {locale === 'ar' ? 'العودة للمستشفيات' : 'Back to Hospitals'}
      </Link>

      <div className="rounded-xl overflow-hidden mb-8">
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary to-primary-dark relative">
          {hospital.cover_url && (
            <img src={hospital.cover_url} alt={displayName} className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card -mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className={cn('w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 border-4 border-white shadow-md', logoColor)}>
                {hospital.logo_url ? (
                  <img src={hospital.logo_url} alt={displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(displayName)
                )}
              </div>
              <div className="flex-1 min-w-0 pt-2 sm:pt-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{displayName}</h1>
                  {hospital.verified && (
                    <span className="badge badge-verified">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t('doctor.verified')}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {city ? (locale === 'ar' ? city.name_ar : city.name) : ''}{area ? `, ${locale === 'ar' ? area.name_ar : area.name}` : ''}
                </p>
                {RankIcon && rankCfg && (
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-2', rankCfg.bg, rankCfg.color)}>
                    <RankIcon className="w-3.5 h-3.5" />
                    {getRankLabel(hospital.rank, locale)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <Link href={`/booking/hospital/${hospital.id}`} className="btn btn-primary btn-sm justify-center">
                <Calendar className="w-4 h-4" />
                {t('hospital.book_visit')}
              </Link>
              <Link href={`/international-treatment?hospital=${hospital.id}`} className="btn btn-secondary btn-sm justify-center">
                <Globe className="w-4 h-4" />
                {t('hospital.request_treatment')}
              </Link>
              <button onClick={handleUploadReport} className="btn btn-outline btn-sm justify-center">
                <FileText className="w-4 h-4" />
                {t('hospital.upload_report')}
              </button>
              <button onClick={handleRequestCost} className="btn btn-outline btn-sm justify-center">
                <DollarSign className="w-4 h-4" />
                {t('hospital.request_cost')}
              </button>
            </div>
          </div>

          {(hospital.about || hospital.about_ar) && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {locale === 'ar' ? 'عن المستشفى' : 'About'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {locale === 'ar' && hospital.about_ar ? hospital.about_ar : hospital.about || ''}
              </p>
            </div>
          )}

          {departments.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-primary" />
                {t('hospital.departments')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {affiliatedDoctors.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                {t('hospital.doctors')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {affiliatedDoctors.map((doc) => {
                  const docName = locale === 'ar' && doc.name_ar ? doc.name_ar : doc.name;
                  const docSpec = specialties.find(s => s.id === doc.specialty_id);
                  return (
                    <Link
                      key={doc.id}
                      href={`/doctors/${doc.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    >
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0', logoColors[Math.abs(doc.id.charCodeAt(0)) % logoColors.length])}>
                        {getInitials(docName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{docName}</p>
                        <p className="text-xs text-gray-500">{docSpec ? (locale === 'ar' ? docSpec.name_ar : docSpec.name) : ''}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {hospital.accreditations && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {t('hospital.accreditations')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {hospital.accreditations.split('，').filter(Boolean).map((acc, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hospital.address && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t('doctor.address')}
              </h2>
              <p className="text-gray-600 mb-3">{hospital.address}</p>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 text-sm">
                <MapPin className="w-6 h-6 mr-1" />
                {hospital.latitude && hospital.longitude
                  ? (locale === 'ar' ? 'خريطة الموقع' : 'Location Map')
                  : (locale === 'ar' ? 'الموقع غير متاح' : 'Location not available')}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {hospital.phone && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                {locale === 'ar' ? 'اتصال' : 'Contact'}
              </h3>
              <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-primary">
                <Phone className="w-4 h-4" />
                {hospital.phone}
              </a>
              {hospital.website && (
                <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-primary mt-2">
                  <Globe className="w-4 h-4" />
                  {locale === 'ar' ? 'الموقع الإلكتروني' : 'Website'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {hospital.languages && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" />
                {t('doctor.languages')}
              </h3>
              <p className="text-gray-600">{hospital.languages}</p>
            </div>
          )}

          {departments.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">{t('hospital.departments')}</h3>
              <ul className="space-y-1.5">
                {departments.slice(0, 5).map((dept, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {dept}
                  </li>
                ))}
                {departments.length > 5 && (
                  <li className="text-sm text-gray-400">
                    {locale === 'ar' ? `و ${departments.length - 5} أقسام أخرى` : `+${departments.length - 5} more`}
                  </li>
                )}
              </ul>
            </div>
          )}

          {hospital.accreditations && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                {t('hospital.accreditations')}
              </h3>
              <div className="space-y-1.5">
                {hospital.accreditations.split('，').filter(Boolean).slice(0, 3).map((acc, i) => (
                  <p key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
                    {acc}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">{t('hospital.international_department')}</h3>
            <Link href={`/international-treatment?hospital=${hospital.id}`} className="btn btn-primary btn-sm w-full justify-center">
              <Globe className="w-4 h-4" />
              {t('hospital.request_treatment')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
