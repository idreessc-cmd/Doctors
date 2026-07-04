'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { initializeStore, getAll } from '@/lib/store';
import type { Specialty } from '@/types';
import {
  HeartPulse, Activity, Bone, Eye, Ear, Baby, Brain, Microscope, Stethoscope, Search
} from 'lucide-react';

const specialtyIcons: Record<string, React.ReactNode> = {
  heart: <HeartPulse className="w-10 h-10" />,
  skin: <Activity className="w-10 h-10" />,
  bone: <Bone className="w-10 h-10" />,
  eye: <Eye className="w-10 h-10" />,
  ear: <Ear className="w-10 h-10" />,
  baby: <Baby className="w-10 h-10" />,
  brain: <Brain className="w-10 h-10" />,
  tooth: <Brain className="w-10 h-10" />,
  lung: <Activity className="w-10 h-10" />,
  medical: <Stethoscope className="w-10 h-10" />,
  default: <Microscope className="w-10 h-10" />,
};

export default function SpecialtiesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    initializeStore();
    setSpecialties(getAll<Specialty>('specialties'));
  }, []);

  const filtered = specialties.filter(s => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.name_ar.includes(q);
  });

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.specialties')}</h1>
        <p className="text-gray-500">{locale === 'ar' ? 'تصفح جميع التخصصات الطبية المتاحة' : 'Browse all available medical specialties'}</p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={locale === 'ar' ? 'ابحث عن تخصص...' : 'Search for a specialty...'}
          className="input pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">{t('common.no_results')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(spec => (
            <Link
              key={spec.id}
              href={`/doctors?specialty=${spec.id}`}
              className="card flex flex-col items-center text-center gap-4 py-8 px-4 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="p-4 rounded-2xl bg-primary-light text-primary">
                {specialtyIcons[spec.icon || 'default']}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{locale === 'ar' ? spec.name_ar : spec.name}</p>
                <p className="text-xs text-gray-400 mt-1">{locale === 'ar' ? spec.name : spec.name_ar}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
