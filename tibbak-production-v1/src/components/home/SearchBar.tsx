'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Search, Stethoscope, Building2 } from 'lucide-react';

export default function SearchBar() {
  const t = useTranslations('home');
  const locale = useLocale();
  const router = useRouter();
  const [searchType, setSearchType] = useState<'doctor' | 'hospital'>('doctor');
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (searchType === 'doctor') {
      router.push(`/doctors?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/hospitals?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 glassmorphism">
      {/* Search Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-100 pb-3">
        <button
          onClick={() => setSearchType('doctor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            searchType === 'doctor'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          {t('find_doctor')}
        </button>
        <button
          onClick={() => setSearchType('hospital')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            searchType === 'hospital'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-4 w-4" />
          {t('find_hospital')}
        </button>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === 'doctor'
                ? t('search_doctor_placeholder')
                : t('search_hospital_placeholder')
            }
            className={`w-full ${
              locale === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'
            } py-3.5 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 text-sm sm:text-base transition-all`}
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Search className="h-4.5 w-4.5" />
          <span>{locale === 'ar' ? 'بحث' : 'Search'}</span>
        </button>
      </form>
    </div>
  );
}
