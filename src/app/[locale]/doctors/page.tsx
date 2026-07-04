'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Search, SlidersHorizontal, X, ChevronDown, Star, Shield, Crown,
  Calendar, MessageSquare, Phone, MapPin, RotateCcw, Filter,
  ArrowUpDown, Stethoscope
} from 'lucide-react';
import { getAll, getById, initializeStore } from '@/lib/store';
import { formatCurrency, getInitials, getRankLabel, getRankColor, cn } from '@/lib/utils';
import type { Doctor, Specialty, City, Area } from '@/types';

const rankIcons: Record<string, React.ElementType> = {
  verified: Shield,
  premium: Star,
  vip: Crown,
};

const rankIconColors: Record<string, string> = {
  verified: 'text-blue-500',
  premium: 'text-amber-500',
  vip: 'text-yellow-500',
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

function StarRating({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn('w-3.5 h-3.5', star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200')}
        />
      ))}
    </div>
  );
}

export default function DoctorsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    specialty: '',
    city: '',
    gender: '',
    sort: 'rank',
  });

  useEffect(() => {
    initializeStore();
    const allDoctors = getAll<Doctor>('doctors');
    const allSpecialties = getAll<Specialty>('specialties');
    const allCities = getAll<City>('cities');
    setDoctors(allDoctors);
    setSpecialties(allSpecialties);
    setCities(allCities);

    setFilters({
      search: searchParams?.get('search') || '',
      specialty: searchParams?.get('specialty') || '',
      city: searchParams?.get('city') || '',
      gender: searchParams?.get('gender') || '',
      sort: searchParams?.get('sort') || 'rank',
    });
    setReady(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : '';
    router.replace(newUrl, { scroll: false });
  }, [filters, ready]);

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', specialty: '', city: '', gender: '', sort: 'rank' });
  }, []);

  const activeFilterCount = useMemo(() =>
    Object.entries(filters).filter(([k, v]) => k !== 'sort' && v).length,
    [filters]
  );

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) || d.name_ar.includes(q)
      );
    }

    if (filters.specialty) {
      result = result.filter(d => d.specialty_id === filters.specialty);
    }

    if (filters.city) {
      result = result.filter(d => d.city_id === filters.city);
    }

    if (filters.gender) {
      result = result.filter(d => d.gender === filters.gender);
    }

    switch (filters.sort) {
      case 'fees_asc':
        result.sort((a, b) => a.fees - b.fees);
        break;
      case 'fees_desc':
        result.sort((a, b) => b.fees - a.fees);
        break;
      case 'rank':
        result.sort((a, b) => b.ranking_score - a.ranking_score);
        break;
      case 'rating':
        result.sort((a, b) => (b as any).rating || 0 - (a as any).rating || 0);
        break;
      case 'experience':
        result.sort((a, b) => b.years_experience - a.years_experience);
        break;
      default:
        result.sort((a, b) => b.ranking_score - a.ranking_score);
    }

    return result;
  }, [doctors, filters]);

  const getSpecialtyName = useCallback((specId: string) => {
    const spec = specialties.find(s => s.id === specId);
    if (!spec) return '';
    return locale === 'ar' ? spec.name_ar : spec.name;
  }, [specialties, locale]);

  const getCityName = useCallback((cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return '';
    return locale === 'ar' ? city.name_ar : city.name;
  }, [cities, locale]);

  const renderFilters = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('common.search')}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder={t('home.search_placeholder_doctor')}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('doctor.filter_specialty')}</h3>
        <select
          className="select"
          value={filters.specialty}
          onChange={(e) => updateFilter('specialty', e.target.value)}
        >
          <option value="">{t('common.no') === 'No' ? 'All Specialties' : 'جميع التخصصات'}</option>
          {specialties.map((s) => (
            <option key={s.id} value={s.id}>{locale === 'ar' ? s.name_ar : s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('doctor.filter_city')}</h3>
        <select
          className="select"
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
        >
          <option value="">{locale === 'ar' ? 'جميع المدن' : 'All Cities'}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{locale === 'ar' ? c.name_ar : c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('doctor.filter_gender')}</h3>
        <div className="flex gap-2">
          {['', 'male', 'female'].map((g) => (
            <button
              key={g}
              onClick={() => updateFilter('gender', g)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                filters.gender === g
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
              )}
            >
              {g === '' ? (locale === 'ar' ? 'الكل' : 'Any') : g === 'male' ? (locale === 'ar' ? 'ذكر' : 'Male') : (locale === 'ar' ? 'أنثى' : 'Female')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('doctor.filter_sort')}</h3>
        <select
          className="select"
          value={filters.sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
        >
          <option value="rank">{t('doctor.sort_rank')}</option>
          <option value="fees_asc">{t('doctor.sort_fees_asc')}</option>
          <option value="fees_desc">{t('doctor.sort_fees_desc')}</option>
          <option value="rating">{t('doctor.sort_rating')}</option>
          <option value="experience">{t('doctor.sort_experience')}</option>
        </select>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={resetFilters} className="btn btn-ghost btn-sm w-full text-error">
          <RotateCcw className="w-4 h-4" />
          {locale === 'ar' ? 'إعادة تعيين' : 'Reset Filters'}
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton h-12 w-12 rounded-full mb-4" />
              <div className="skeleton h-5 w-3/4 mb-2" />
              <div className="skeleton h-4 w-1/2 mb-2" />
              <div className="skeleton h-4 w-2/3 mb-1" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('doctor.title')}</h1>
          <p className="text-gray-500 mt-1">
            {locale === 'ar' ? `عرض ${filteredDoctors.length} من ${doctors.length} طبيب` : `Showing ${filteredDoctors.length} of ${doctors.length} doctors`}
          </p>
        </div>
        <button
          className="md:hidden btn btn-outline mt-3 md:mt-0"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Filter className="w-4 h-4" />
          {locale === 'ar' ? 'فلترة' : 'Filters'}
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <div className="card sticky top-24">{renderFilters()}</div>
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">{locale === 'ar' ? 'فلترة' : 'Filters'}</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">{renderFilters()}</div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'sort') return null;
                let label = value;
                if (key === 'specialty') {
                  const s = specialties.find(sp => sp.id === value);
                  label = s ? (locale === 'ar' ? s.name_ar : s.name) : value;
                }
                if (key === 'city') {
                  const c = cities.find(ci => ci.id === value);
                  label = c ? (locale === 'ar' ? c.name_ar : c.name) : value;
                }
                if (key === 'gender') {
                  label = value === 'male' ? (locale === 'ar' ? 'ذكر' : 'Male') : (locale === 'ar' ? 'أنثى' : 'Female');
                }
                return (
                  <span key={key} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-light text-primary rounded-full text-sm font-medium">
                    {label}
                    <button onClick={() => updateFilter(key, '')} className="hover:bg-primary/10 rounded-full p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
              <button onClick={resetFilters} className="text-sm text-gray-500 hover:text-error px-2 py-1">
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                {locale === 'ar' ? 'مسح الكل' : 'Clear all'}
              </button>
            </div>
          )}

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16">
              <Stethoscope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('common.no_results')}</h3>
              <p className="text-gray-400">
                {locale === 'ar' ? 'حاول تعديل معايير البحث' : 'Try adjusting your search criteria'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredDoctors.map((doctor) => {
                const specName = getSpecialtyName(doctor.specialty_id);
                const cityName = getCityName(doctor.city_id);
                const RankIcon = doctor.rank !== 'normal' ? rankIcons[doctor.rank] : null;
                const avatarColor = getAvatarColor(doctor.id);
                const displayName = locale === 'ar' && doctor.name_ar ? doctor.name_ar : doctor.name;

                return (
                  <Link key={doctor.id} href={`/doctors/${doctor.id}`} className="card block cursor-pointer hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn('w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0', avatarColor)}>
                        {doctor.image_url ? (
                          <img src={doctor.image_url} alt={displayName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          getInitials(displayName)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                          {RankIcon && (
                            <RankIcon className={cn('w-4 h-4 flex-shrink-0 fill-current', rankIconColors[doctor.rank])} />
                          )}
                        </div>
                        <p className="text-sm text-primary">{specName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {cityName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <StarRating rating={0} />
                      <span className="text-xs text-gray-400">{locale === 'ar' ? 'لا توجد تقييمات' : 'No reviews'}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-semibold text-gray-900">{formatCurrency(doctor.fees)}</span>
                        <span className="text-gray-500 text-xs"> / {locale === 'ar' ? 'كشفية' : 'visit'}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {doctor.years_experience} {t('doctor.years_exp')}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                      {doctor.accepts_booking && (
                        <span className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-white rounded-lg text-xs font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {t('doctor.booking')}
                        </span>
                      )}
                      {doctor.accepts_consultation && (
                        <span className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-secondary text-white rounded-lg text-xs font-semibold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {t('doctor.consultation')}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
