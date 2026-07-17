'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { City, Specialty } from '@/types';

interface FilterPanelProps {
  specialties: Specialty[];
  cities: City[];
}

export default function DoctorsFilterPanel({ specialties, cities }: FilterPanelProps) {
  const t = useTranslations('doctors');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load initial values from searchParams
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [selectedFees, setSelectedFees] = useState(searchParams.get('fees') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'ranking');

  const applyFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 shadow-sm">
      
      {/* Search Input */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-teal-600" />
          {locale === 'ar' ? 'البحث بالاسم' : 'Search by Name'}
        </h3>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search_doctor_placeholder')}
            className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
          />
          <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            {locale === 'ar' ? 'بحث' : 'Search'}
          </button>
        </form>
      </div>

      {/* Specialty Filter */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2">{t('specialty')}</h3>
        <select
          value={selectedSpecialty}
          onChange={(e) => {
            setSelectedSpecialty(e.target.value);
            applyFilters({ specialty: e.target.value });
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
        >
          <option value="">{t('filter_all_specialties')}</option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.slug}>
              {locale === 'ar' ? spec.name_ar : spec.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* City Filter */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2">{t('city')}</h3>
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            applyFilters({ city: e.target.value });
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
        >
          <option value="">{t('filter_all_cities')}</option>
          {cities.map((city) => (
            <option key={city.id} value={city.slug}>
              {locale === 'ar' ? city.name_ar : city.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Filter */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2">{t('filter_gender')}</h3>
        <div className="flex flex-col gap-2">
          {['', 'male', 'female'].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-slate-600 font-medium cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={selectedGender === g}
                onChange={() => {
                  setSelectedGender(g);
                  applyFilters({ gender: g });
                }}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span>
                {g === '' 
                  ? (locale === 'ar' ? 'الكل' : 'All')
                  : (g === 'male' ? t('gender_male') : t('gender_female'))
                }
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Fee Range Filter */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2">{t('filter_fees')}</h3>
        <select
          value={selectedFees}
          onChange={(e) => {
            setSelectedFees(e.target.value);
            applyFilters({ fees: e.target.value });
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
        >
          <option value="">{t('fees_any')}</option>
          <option value="under_20">{t('fees_under_20')}</option>
          <option value="20_40">{t('fees_20_40')}</option>
          <option value="above_40">{t('fees_above_40')}</option>
        </select>
      </div>

      {/* Sort Option */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <ArrowUpDown className="h-4 w-4 text-teal-600" />
          {t('sort_by')}
        </h3>
        <select
          value={selectedSort}
          onChange={(e) => {
            setSelectedSort(e.target.value);
            applyFilters({ sort: e.target.value });
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
        >
          <option value="ranking">{t('sort_ranking')}</option>
          <option value="rating">{t('sort_rating')}</option>
          <option value="experience">{t('sort_experience')}</option>
          <option value="fees_asc">{t('sort_fees_asc')}</option>
          <option value="fees_desc">{t('sort_fees_desc')}</option>
        </select>
      </div>

    </div>
  );
}
