import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllDoctors } from '@/lib/repositories/doctors';
import { getAllHospitals } from '@/lib/repositories/hospitals';
import { mockSpecialties } from '@/data/mock/specialties';
import { mockCities } from '@/data/mock/cities';
import SearchBar from '@/components/home/SearchBar';
import {
  Heart, MapPin, Award, CheckCircle,
  ArrowUpRight, ArrowLeftRight, HeartHandshake, ShieldCheck, ChevronRight
} from 'lucide-react';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRtl = locale === 'ar';

  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tDocs = await getTranslations('doctors');

  // Load featured content from repositories
  const allDoctors = await getAllDoctors();
  const featuredDoctors = allDoctors.slice(0, 3); // VIP and Premium doctors

  const allHospitals = await getAllHospitals();
  const featuredHospitals = allHospitals.slice(0, 2); // Accredited hospitals

  return (
    <div className="flex flex-col w-full pb-20">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-50/50 via-white to-transparent pt-12 pb-20 border-b border-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100/50 mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isRtl ? 'منصة السياحة العلاجية الرسمية بالأردن' : 'Official Medical Tourism Platform in Jordan'}
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            {t('hero_title')}
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            {t('hero_subtitle')}
          </p>

          <SearchBar />

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/international-treatment"
              className="flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-md text-sm sm:text-base"
            >
              <span>{t('request_treatment')}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/packages"
              className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition-colors shadow-sm text-sm sm:text-base"
            >
              <span>{isRtl ? 'تصفح الباقات والأسعار' : 'Browse Packages & Prices'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {t('popular_specialties')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            {t('popular_specialties_sub')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {mockSpecialties.slice(0, 5).map((spec) => (
            <Link
              key={spec.id}
              href={`/doctors?specialty=${spec.slug}`}
              className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-gray-100 hover:border-teal-500/30 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                {isRtl ? spec.name_ar : spec.name_en}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 bg-slate-50/50 border-y border-slate-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                {t('featured_doctors')}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                {t('featured_doctors_sub')}
              </p>
            </div>
            <Link
              href="/doctors"
              className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              <span>{isRtl ? 'تصفح كافة الأطباء' : 'View All Doctors'}</span>
              <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDoctors.map((doc) => {
              const spec = mockSpecialties.find(s => s.id === doc.specialty_id);
              const city = mockCities.find(c => c.id === doc.city_id);

              return (
                <div key={doc.id} className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all relative">
                  
                  {/* VIP / Premium badge */}
                  {doc.rank === 'vip' && (
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm gold-crown-glow">
                      ★ {isRtl ? 'VIP أولوية' : 'VIP Priority'}
                    </span>
                  )}
                  {doc.rank === 'premium' && (
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500 text-white shadow-sm">
                      {isRtl ? 'مميز' : 'Premium'}
                    </span>
                  )}

                  {/* Doctor Info Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar Mock */}
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

                    <div className="grid grid-cols-2 gap-2 py-4 border-y border-gray-100 text-sm font-medium mb-4 flex-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{city ? (isRtl ? city.name_ar : city.name_en) : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span>{tDocs('experience_years', { years: doc.experience_years })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
                        <span className="text-gray-400 font-semibold">{tDocs('fees_label')}</span>
                        <span className="text-teal-600 font-bold">{doc.consultation_fee_jod} {tCommon('jod')}</span>
                      </div>
                    </div>

                    <Link
                      href={`/doctors/${doc.slug}`}
                      className="block w-full text-center bg-slate-50 hover:bg-teal-600 hover:text-white text-teal-700 font-bold py-2.5 rounded-xl transition-all text-sm border border-teal-50"
                    >
                      {tDocs('details_btn')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Hospitals Section */}
      <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {t('featured_hospitals')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              {t('featured_hospitals_sub')}
            </p>
          </div>
          <Link
            href="/hospitals"
            className="flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline"
          >
            <span>{isRtl ? 'تصفح كافة المستشفيات' : 'View All Hospitals'}</span>
            <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredHospitals.map((hosp) => {
            const city = mockCities.find(c => c.id === hosp.city_id);

            return (
              <div key={hosp.id} className="flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                {/* Visual Cover Mock */}
                <div className="sm:w-48 bg-gradient-to-br from-teal-500 to-cyan-700 flex flex-col items-center justify-center p-6 text-white text-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                    <Award className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
                    {hosp.rank.toUpperCase()}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <h3 className="font-bold text-slate-800 text-lg hover:text-teal-600 transition-colors">
                        {isRtl ? hosp.name_ar : hosp.name_en}
                      </h3>
                      {hosp.is_verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-3">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      <span>{city ? (isRtl ? city.name_ar : city.name_en) : ''}</span>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed font-cairo">
                      {isRtl ? hosp.description_ar : hosp.description_en}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {hosp.accepts_international_patients && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100/50">
                        {tDocs('international_badge')}
                      </span>
                    )}
                    <Link
                      href={`/hospitals/${hosp.slug}`}
                      className="sm:ml-auto w-full sm:w-auto text-center text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50/50 px-4 py-2 rounded-xl transition-all"
                    >
                      {isRtl ? 'عرض ملف المستشفى' : 'View Profile'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Jordan Info Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle Background Art */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <Heart className="w-[400px] h-[400px] text-teal-400" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white font-cairo">
              {t('why_jordan')}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 font-cairo">
              {isRtl 
                ? 'يعد الأردن الوجهة الأولى للسياحة العلاجية في المنطقة بفضل كفاءاته الطبية ومؤسساته المعتمدة.'
                : 'Jordan stands as the premier medical tourism destination in the region, driven by elite clinical competencies and accredited facilities.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 border border-slate-700/30 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why_jordan_1_title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-cairo">{t('why_jordan_1_desc')}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/30 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why_jordan_2_title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-cairo">{t('why_jordan_2_desc')}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/30 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <ArrowLeftRight className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why_jordan_3_title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-cairo">{t('why_jordan_3_desc')}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/30 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('why_jordan_4_title')}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-cairo">{t('why_jordan_4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stepper Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {t('how_it_works')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg border border-teal-100 mb-4">1</div>
              <p className="text-slate-700 font-semibold max-w-xs">{t('how_it_works_1')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg border border-teal-100 mb-4">2</div>
              <p className="text-slate-700 font-semibold max-w-xs">{t('how_it_works_2')}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center font-bold text-lg border border-teal-100 mb-4">3</div>
              <p className="text-slate-700 font-semibold max-w-xs">{t('how_it_works_3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider CTA Banner */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-cairo">
              {t('cta_title')}
            </h2>
            <p className="text-sm sm:text-base text-teal-100 leading-relaxed font-cairo">
              {t('cta_desc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/join-doctor"
              className="bg-white hover:bg-slate-50 text-teal-800 font-bold px-6 py-3 rounded-xl transition-all shadow-md text-center text-sm sm:text-base"
            >
              {t('cta_btn_doctor')}
            </Link>
            <Link
              href="/join-hospital"
              className="bg-teal-700 hover:bg-teal-600 text-white font-bold px-6 py-3 rounded-xl border border-teal-600 hover:border-teal-500 transition-all shadow-md text-center text-sm sm:text-base"
            >
              {t('cta_btn_hospital')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
