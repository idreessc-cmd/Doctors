import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getHospitalBySlug, getHospitalDoctors } from '@/lib/repositories/hospitals';
import { mockCities } from '@/data/mock/cities';
import { mockPackages } from '@/data/mock/packages';
import HospitalContactWidget from '@/components/hospitals/HospitalContactWidget';
import HospitalBookingWidget from '@/components/hospitals/HospitalBookingWidget';
import { MapPin, CheckCircle, ArrowLeft, Building2, HeartHandshake } from 'lucide-react';
import type { Metadata } from 'next';

interface HospitalDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: HospitalDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const hosp = await getHospitalBySlug(slug);
  const isRtl = locale === 'ar';

  if (!hosp) {
    return {
      title: isRtl ? 'مستشفى غير موجود' : 'Hospital Not Found',
    };
  }

  const name = isRtl ? hosp.name_ar : hosp.name_en;

  return {
    title: `${name} | طبّك الأردن`,
    description: isRtl 
      ? `${hosp.description_ar}`
      : `${hosp.description_en}`,
  };
}

export default async function HospitalDetailPage({ params }: HospitalDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRtl = locale === 'ar';

  const hosp = await getHospitalBySlug(slug);
  if (!hosp) {
    notFound();
  }

  const city = mockCities.find(c => c.id === hosp.city_id);
  const pkg = mockPackages.find(p => p.id === hosp.package_id);
  const affiliatedDoctors = await getHospitalDoctors(hosp.id);

  const isDirectAllowed = pkg ? pkg.allow_direct_contact : false;

  const tHosp = await getTranslations('hospitals');

  // Hardcoded departments and accreditations matching hospital schema
  const departments = isRtl
    ? ['قسم القلب والشرايين', 'قسم العظام والمفاصل', 'قسم النسائية والتوليد', 'قسم الأطفال', 'الجراحة العامة والمناظير']
    : ['Cardiology Department', 'Orthopedics & Joints', 'Gynecology & Obstetrics', 'Pediatrics', 'General & Laparoscopic Surgery'];

  const services = isRtl
    ? ['طوارئ 24 ساعة', 'مختبرات متكاملة', 'أشعة ورنين مغناطيسي', 'صيدلية داخلية', 'قسم خاص للمرضى الدوليين']
    : ['24/7 Emergency Care', 'Fully-equipped Laboratories', 'MRI & Medical Imaging', 'In-hospital Pharmacy', 'Dedicated International Patients Lounge'];

  const accreditations = isRtl
    ? ['اعتماد اللجنة الدولية المشتركة (JCI)', 'شهادة مجلس اعتماد المؤسسات الصحية الوطني (HCAC)']
    : ['Joint Commission International (JCI) Accreditation', 'Health Care Accreditation Council (HCAC) Certification'];

  return (
    <div className="py-10 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/hospitals"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-teal-600 mb-8 transition-colors"
        >
          <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{isRtl ? 'العودة للمستشفيات' : 'Back to Hospitals'}</span>
        </Link>

        {/* Hospital Header Banner */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
          
          {/* International Partner Badge */}
          {hosp.package_id === 'e5e3966e-21ef-42f3-a7bb-4e9df6666666' && (
            <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
              <HeartHandshake className="h-4 w-4" />
              {isRtl ? 'شريك علاج دولي معتمد' : 'International Partner'}
            </span>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Visual Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0 shadow-inner">
              <Building2 className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>

            <div className="text-center md:text-right flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  {isRtl ? hosp.name_ar : hosp.name_en}
                </h1>
                {hosp.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full mx-auto md:mx-0">
                    <CheckCircle className="h-3.5 w-3.5 fill-blue-50 text-blue-500" />
                    {isRtl ? 'معتمد' : 'Accredited'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-3 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{city ? (isRtl ? city.name_ar : city.name_en) : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{isRtl ? hosp.address_ar : hosp.address_en}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Detail Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About / Bio */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {tHosp('about')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-cairo">
                {isRtl ? hosp.description_ar : hosp.description_en}
              </p>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {tHosp('departments')}
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {departments.map((dept, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-sm font-semibold font-cairo">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {tHosp('services')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-600 font-cairo">
                {services.map((srv, i) => (
                  <li key={i}>{srv}</li>
                ))}
              </ul>
            </div>

            {/* Accreditations */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4 font-cairo">
                {tHosp('accreditations')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-600 font-cairo">
                {accreditations.map((acc, i) => (
                  <li key={i} className="text-teal-700 font-semibold">{acc}</li>
                ))}
              </ul>
            </div>

            {/* Affiliated Doctors tab */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-3 mb-6 font-cairo">
                {tHosp('doctors_tab')}
              </h2>
              
              {affiliatedDoctors.length === 0 ? (
                <p className="text-sm text-slate-500 font-cairo">
                  {isRtl ? 'لا يوجد أطباء مرتبطون حالياً.' : 'No affiliated doctors currently linked.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {affiliatedDoctors.map((doc) => (
                    <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 flex flex-col justify-between">
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-800 text-sm">
                            {isRtl ? doc.full_name_ar : doc.full_name_en}
                          </h4>
                          {doc.is_verified && (
                            <CheckCircle className="h-3.5 w-3.5 text-blue-500 fill-blue-50" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-tight mt-1 line-clamp-1">
                          {isRtl ? doc.title_ar : doc.title_en}
                        </p>
                      </div>
                      <Link
                        href={`/doctors/${doc.slug}`}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 mt-2 block"
                      >
                        {isRtl ? 'عرض ملف الطبيب 🡒' : 'View Profile 🡒'}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right/Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Direct Contact widget */}
            <HospitalContactWidget
              hospitalId={hosp.id}
              isDirectAllowed={isDirectAllowed}
              initialWebsite={isRtl ? 'https://www.jordan-hospital.com' : 'https://www.jordan-hospital.com'}
            />

            {/* Appointment visit booking widget */}
            <HospitalBookingWidget hospitalId={hosp.id} />

          </div>

        </div>

      </div>
    </div>
  );
}
