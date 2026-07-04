'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  ArrowLeft, Star, Shield, Crown, Calendar, MessageSquare, Phone,
  MapPin, Clock, Globe, CheckCircle, Award, HeartPulse, Building2,
  Languages, GraduationCap, Stethoscope, ChevronLeft, ChevronRight,
  Share2, ExternalLink, MessageCircle
} from 'lucide-react';
import { getAll, getById, initializeStore, incrementStat } from '@/lib/store';
import { formatCurrency, getInitials, getRankLabel, getRankColor, cn } from '@/lib/utils';
import type { Doctor, Specialty, City, Area } from '@/types';

const rankConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  verified: { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
  premium: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  vip: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50' },
};

const avatarColors = [
  'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600',
  'bg-amber-100 text-amber-600', 'bg-rose-100 text-rose-600', 'bg-cyan-100 text-cyan-600',
  'bg-indigo-100 text-indigo-600', 'bg-teal-100 text-teal-600', 'bg-orange-100 text-orange-600',
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function StarRating({ rating = 0, size = 'md' }: { rating?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizes[size],
            star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
    </div>
  );
}

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations();
  const locale = useLocale();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [relatedDoctors, setRelatedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    initializeStore();

    const doc = getById<Doctor>('doctors', id);
    const allSpecialties = getAll<Specialty>('specialties');
    const allCities = getAll<City>('cities');
    const allAreas = getAll<Area>('areas');
    const allDoctors = getAll<Doctor>('doctors');

    if (doc) {
      incrementStat('doctor', id, 'profile_views');
    }

    setDoctor(doc || null);
    setSpecialties(allSpecialties);
    setCities(allCities);
    setAreas(allAreas);

    if (doc) {
      const related = allDoctors
        .filter(d => d.id !== doc.id && d.specialty_id === doc.specialty_id && d.is_active)
        .sort((a, b) => b.ranking_score - a.ranking_score)
        .slice(0, 4);
      setRelatedDoctors(related);
    }

    setLoading(false);
  }, [id]);

  const specialty = useMemo(() =>
    specialties.find(s => s.id === doctor?.specialty_id),
    [specialties, doctor]
  );

  const city = useMemo(() =>
    cities.find(c => c.id === doctor?.city_id),
    [cities, doctor]
  );

  const area = useMemo(() =>
    areas.find(a => a.id === doctor?.area_id),
    [areas, doctor]
  );

  const displayName = doctor
    ? (locale === 'ar' && doctor.name_ar ? doctor.name_ar : doctor.name)
    : '';

  const avatarColor = doctor ? getAvatarColor(doctor.id) : '';

  const rankCfg = doctor && doctor.rank !== 'normal' ? rankConfig[doctor.rank] : null;
  const RankIcon = rankCfg?.icon;

  const workingHours = doctor?.working_hours || '';

  const handleCallClick = () => {
    if (doctor) incrementStat('doctor', doctor.id, 'contact_clicks');
    setShowPhone(true);
  };

  const handleWhatsAppClick = () => {
    if (doctor) incrementStat('doctor', doctor.id, 'whatsapp_clicks');
    window.open(`https://wa.me/962${doctor?.address?.split(' ')[0] || ''}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="skeleton h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-64 w-full" />
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-32 w-full" />
          </div>
          <div className="skeleton h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="container-custom py-16 text-center">
        <Stethoscope className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600 mb-2">
          {locale === 'ar' ? 'الطبيب غير موجود' : 'Doctor Not Found'}
        </h1>
        <p className="text-gray-400 mb-6">
          {locale === 'ar' ? 'قد يكون قد تم حذف هذا الطبيب أو أن الرابط غير صحيح' : 'This doctor may have been removed or the link is invalid'}
        </p>
        <Link href="/doctors" className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          {locale === 'ar' ? 'العودة للأطباء' : 'Back to Doctors'}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 md:py-8">
      <Link href="/doctors" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        {locale === 'ar' ? 'العودة للأطباء' : 'Back to Doctors'}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className={cn('w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0', avatarColor)}>
                {doctor.image_url ? (
                  <img src={doctor.image_url} alt={displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(displayName)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{displayName}</h1>
                  {doctor.verified && (
                    <span className="badge badge-verified">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t('doctor.verified')}
                    </span>
                  )}
                </div>
                <p className="text-lg text-primary mt-1">
                  {specialty ? (locale === 'ar' ? specialty.name_ar : specialty.name) : ''}
                  {doctor.sub_specialty && <span className="text-gray-400 text-sm"> | {doctor.sub_specialty}</span>}
                </p>
                {doctor.degree && (
                  <p className="text-sm text-gray-500 mt-0.5">{doctor.degree}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    {doctor.years_experience} {t('doctor.years_exp')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {city ? (locale === 'ar' ? city.name_ar : city.name) : ''}{area ? `, ${locale === 'ar' ? area.name_ar : area.name}` : ''}
                  </span>
                  {RankIcon && rankCfg && (
                    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', rankCfg.bg, rankCfg.color)}>
                      <RankIcon className="w-3.5 h-3.5" />
                      {getRankLabel(doctor.rank, locale)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(doctor.fees)}</p>
                  <p className="text-xs text-gray-500">{t('doctor.fees')}</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{doctor.years_experience}</p>
                  <p className="text-xs text-gray-500">{t('doctor.years_exp')}</p>
                </div>
                <div>
                  <StarRating rating={0} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">{locale === 'ar' ? 'تقييم' : 'Rating'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {doctor.accepts_booking && (
                <Link href={`/booking/doctor/${doctor.id}`} className="btn btn-primary btn-sm justify-center">
                  <Calendar className="w-4 h-4" />
                  {t('doctor.booking')}
                </Link>
              )}
              {doctor.accepts_consultation && (
                <Link href={`/consultation/doctor/${doctor.id}`} className="btn btn-secondary btn-sm justify-center">
                  <MessageSquare className="w-4 h-4" />
                  {t('doctor.consultation')}
                </Link>
              )}
              <button onClick={handleCallClick} className="btn btn-outline btn-sm justify-center">
                <Phone className="w-4 h-4" />
                {showPhone && doctor.address ? doctor.address.split(' ')[0] : t('doctor.call')}
              </button>
              <button onClick={handleWhatsAppClick} className="btn btn-outline btn-sm justify-center text-secondary border-secondary hover:bg-secondary hover:text-white">
                <MessageCircle className="w-4 h-4" />
                {t('doctor.whatsapp')}
              </button>
            </div>

            {doctor.accepts_international && (
              <Link
                href={`/international-treatment?doctor=${doctor.id}`}
                className="btn btn-ghost btn-sm w-full mt-2 text-vip border border-vip/30 hover:bg-vip/5 justify-center"
              >
                <Globe className="w-4 h-4" />
                {t('doctor.international_request')}
              </Link>
            )}
          </div>

          {(doctor.bio || doctor.bio_ar) && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {locale === 'ar' ? 'نبذة عن' : 'About'} {displayName}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {locale === 'ar' && doctor.bio_ar ? doctor.bio_ar : doctor.bio || ''}
              </p>
            </div>
          )}

          {doctor.qualifications && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                {t('doctor.qualifications')}
              </h2>
              <p className="text-gray-600">{doctor.qualifications}</p>
            </div>
          )}

          {doctor.hospital_affiliation && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {t('doctor.affiliated_hospital')}
              </h2>
              <p className="text-gray-600">{doctor.hospital_affiliation}</p>
            </div>
          )}

          {doctor.accepts_international && (
            <div className="card border-secondary/30 bg-secondary/5">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-secondary" />
                <div>
                  <h3 className="font-semibold text-secondary">{t('doctor.accepts_international')}</h3>
                  <p className="text-sm text-gray-500">
                    {locale === 'ar' ? 'هذا الطبيب يستقبل مرضى دوليين' : 'This doctor accepts international patients'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {workingHours && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t('doctor.working_hours')}
              </h2>
              <p className="text-gray-600">{workingHours}</p>
            </div>
          )}

          {(doctor.address || doctor.latitude) && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t('doctor.address')}
              </h2>
              <p className="text-gray-600 mb-3">{doctor.address || `${city?.name || ''}, ${area?.name || ''}`}</p>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 text-sm">
                <MapPin className="w-6 h-6 mr-1" />
                {doctor.latitude && doctor.longitude
                  ? (locale === 'ar' ? 'خريطة الموقع' : 'Location Map')
                  : (locale === 'ar' ? 'الموقع غير متاح' : 'Location not available')}
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              {t('doctor.reviews')}
            </h2>
            <div className="text-center py-8 text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p>{locale === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">{t('doctor.languages')}</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Languages className="w-4 h-4 text-primary" />
              <span>{doctor.languages || locale === 'ar' ? 'العربية' : 'Arabic'}</span>
            </div>
          </div>

          {workingHours && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {t('doctor.working_hours')}
              </h3>
              <p className="text-sm text-gray-600">{workingHours}</p>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">{t('doctor.fees')}</h3>
            <p className="text-2xl font-bold text-primary">{formatCurrency(doctor.fees)}</p>
            <p className="text-xs text-gray-500">{locale === 'ar' ? 'سعر الكشفية' : 'Consultation fee'}</p>
          </div>

          {relatedDoctors.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">
                {locale === 'ar' ? 'أطباء مشابهون' : 'Related Doctors'}
              </h3>
              <div className="space-y-3">
                {relatedDoctors.map((relDoc) => {
                  const relName = locale === 'ar' && relDoc.name_ar ? relDoc.name_ar : relDoc.name;
                  const relSpec = specialties.find(s => s.id === relDoc.specialty_id);
                  const relCity = cities.find(c => c.id === relDoc.city_id);
                  return (
                    <Link
                      key={relDoc.id}
                      href={`/doctors/${relDoc.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0', getAvatarColor(relDoc.id))}>
                        {getInitials(relName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{relName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {relSpec ? (locale === 'ar' ? relSpec.name_ar : relSpec.name) : ''}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link href={`/doctors?specialty=${doctor.specialty_id}`} className="btn btn-ghost btn-sm w-full mt-3 text-primary">
                {locale === 'ar' ? 'عرض الكل' : 'View All'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
