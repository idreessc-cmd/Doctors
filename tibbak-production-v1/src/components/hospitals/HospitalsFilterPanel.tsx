'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { City } from '@/types';

interface FilterPanelProps {
  cities: City[];
}

export default function HospitalsFilterPanel({ cities }: FilterPanelProps) {
  const t = useTranslations('doctors');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6 shadow-sm">
      
      {/* Search Input */}
      <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === 'ar' ? 'ابحث باسم المستشفى...' : 'Search by hospital name...'}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
            />
          </div>
          <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            {locale === 'ar' ? 'بحث' : 'Search'}
          </button>
        </form>
      </div>

      {/* City Filter */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-teal-600" />
          {t('city')}
        </h3>
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

    </div>
  );
}
