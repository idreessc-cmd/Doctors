import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllDoctors } from '@/lib/repositories/doctors';
import { mockSpecialties } from '@/data/mock/specialties';
import { mockCities } from '@/data/mock/cities';
import DoctorsFilterPanel from '@/components/doctors/DoctorsFilterPanel';
import { MapPin, Award, CheckCircle, SearchX } from 'lucide-react';
import type { Metadata } from 'next';

// Dynamic SEO metadata loading
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  return {
    title: isRtl ? 'دليل الأطباء والاستشاريين بالأردن - منصة طبّك' : 'Doctors & Consultants Directory in Jordan - Tabibak',
    description: isRtl
      ? 'ابحث وقارن بين نخبة من الأطباء والاستشاريين في الأردن. تصفح الكشفية، الخبرات، والتقييم واحجز موعدك.'
      : 'Find and compare top accredited doctors and consultants in Jordan. Browse experience, consultation fees, and ratings.',
  };
}

interface DoctorsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    specialty?: string;
    city?: string;
    gender?: string;
    fees?: string;
    sort?: string;
  }>;
}

export default async function DoctorsPage({ params, searchParams }: DoctorsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRtl = locale === 'ar';

  const t = await getTranslations('doctors');
  const tCommon = await getTranslations('common');

  // Resolve search and sorting queries from searchParams
  const queries = await searchParams;
  
  const filter = {
    searchQuery: queries.search,
    specialtySlug: queries.specialty,
    citySlug: queries.city,
    gender: queries.gender as 'male' | 'female',
    feesRange: queries.fees as 'under_20' | '20_40' | 'above_40' | undefined,
  };

  const sort = {
    sortBy: queries.sort as 'ranking' | 'rating' | 'experience' | 'fees_asc' | 'fees_desc' | undefined,
  };

  const doctors = await getAllDoctors(filter, sort);

  return (
    <div className="py-10 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-right">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Search Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <DoctorsFilterPanel specialties={mockSpecialties} cities={mockCities} />
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-6">
            {doctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <SearchX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">{t('no_doctors')}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {isRtl 
                    ? 'جرب تغيير فلاتر البحث أو استخدام كلمات مفتاحية أخرى.'
                    : 'Try clearing your filters or searching for something else.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doc) => {
                  const spec = mockSpecialties.find(s => s.id === doc.specialty_id);
                  const city = mockCities.find(c => c.id === doc.city_id);

                  return (
                    <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between relative">
                      
                      {/* VIP Badge */}
                      {doc.rank === 'vip' && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm gold-crown-glow">
                          ★ {isRtl ? 'VIP أولوية' : 'VIP Priority'}
                        </span>
                      )}
                      {doc.rank === 'premium' && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500 text-white shadow-sm">
                          {isRtl ? 'مميز' : 'Premium'}
                        </span>
                      )}

                      <div className="p-6 flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Avatar representation */}
                          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 text-2xl font-bold flex-shrink-0">
                            {doc.full_name_en.split(' ').pop()?.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-slate-800 text-lg hover:text-teal-600 transition-colors">
                                {isRtl ? doc.full_name_ar : doc.full_name_en}
                              </h3>
                              {doc.is_verified && (
                                <span title={tCommon('verified')}>
                                  <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-teal-600">
                              {spec ? (isRtl ? spec.name_ar : spec.name_en) : ''}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              {isRtl ? doc.title_ar : doc.title_en}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 py-4 border-y border-gray-100 text-sm font-medium mb-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{city ? (isRtl ? city.name_ar : city.name_en) : ''}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Award className="h-4 w-4 text-gray-400" />
                            <span>{t('experience_years', { years: doc.experience_years })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                            <span className="text-gray-400 font-semibold">{t('fees_label')}</span>
                            <span className="text-teal-600 font-bold">{doc.consultation_fee_jod} {tCommon('jod')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        {doc.accepts_international_patients && (
                          <div className="mb-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/50">
                              {t('international_badge')}
                            </span>
                          </div>
                        )}
                        <Link
                          href={`/doctors/${doc.slug}`}
                          className="block w-full text-center bg-slate-50 hover:bg-teal-600 hover:text-white text-teal-700 font-bold py-2.5 rounded-xl transition-all text-sm border border-teal-50"
                        >
                          {t('details_btn')}
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
