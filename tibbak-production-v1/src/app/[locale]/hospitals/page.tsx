import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllHospitals } from '@/lib/repositories/hospitals';
import { mockCities } from '@/data/mock/cities';
import HospitalsFilterPanel from '@/components/hospitals/HospitalsFilterPanel';
import { MapPin, CheckCircle, SearchX, Building } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  return {
    title: isRtl ? 'أفضل المستشفيات والمراكز الطبية بالأردن - منصة طبّك' : 'Top Hospitals & Medical Centers in Jordan - Tabibak',
    description: isRtl
      ? 'تصفح وقارن بين المستشفيات والمدن والمراكز الطبية الرائدة في الأردن المعتمدة دولياً للسياحة العلاجية.'
      : 'Browse and compare leading internationally accredited hospitals and medical centers in Jordan for medical tourism.',
  };
}

interface HospitalsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    city?: string;
  }>;
}

export default async function HospitalsPage({ params, searchParams }: HospitalsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRtl = locale === 'ar';

  const tDocs = await getTranslations('doctors');

  const queries = await searchParams;
  const filter = {
    searchQuery: queries.search,
    citySlug: queries.city,
  };

  const hospitals = await getAllHospitals(filter);

  return (
    <div className="py-10 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-right">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {isRtl ? 'المستشفيات والمراكز الطبية بالأردن' : 'Hospitals & Medical Centers in Jordan'}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2 font-cairo">
            {isRtl
              ? 'تصفح أفضل وجهات الاستشفاء والمستشفيات المعتمدة وخدماتها للمرضى المحليين والدوليين.'
              : 'Explore the best medical tourism destinations, accredited hospitals, and international patient care.'}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <HospitalsFilterPanel cities={mockCities} />
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-6">
            {hospitals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <SearchX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">
                  {isRtl ? 'لم يتم العثور على مستشفيات' : 'No Hospitals Found'}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {isRtl 
                    ? 'جرب البحث باسم آخر أو محافظة أخرى.'
                    : 'Try checking other search queries or cities.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {hospitals.map((hosp) => {
                  const city = mockCities.find(c => c.id === hosp.city_id);

                  return (
                    <div key={hosp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row relative">
                      
                      {/* Left Block with cover theme */}
                      <div className="md:w-56 bg-gradient-to-br from-teal-500 to-cyan-700 flex flex-col items-center justify-center p-6 text-white text-center flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                          <Building className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                          {hosp.rank.toUpperCase()}
                        </span>
                      </div>

                      {/* Content Block */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <h2 className="font-bold text-slate-800 text-xl hover:text-teal-600 transition-colors">
                              {isRtl ? hosp.name_ar : hosp.name_en}
                            </h2>
                            {hosp.is_verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-4">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span>{city ? (isRtl ? city.name_ar : city.name_en) : ''}</span>
                          </div>

                          <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed font-cairo">
                            {isRtl ? hosp.description_ar : hosp.description_en}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                          {hosp.accepts_international_patients && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/50">
                              {tDocs('international_badge')}
                            </span>
                          )}
                          <Link
                            href={`/hospitals/${hosp.slug}`}
                            className="bg-teal-50/50 text-teal-700 font-bold py-2 px-5 rounded-xl hover:bg-teal-600 hover:text-white transition-all text-sm border border-teal-50 ml-auto"
                          >
                            {isRtl ? 'عرض ملف المستشفى' : 'View Profile'}
                          </Link>
                        </div>
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
