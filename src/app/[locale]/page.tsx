'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import {
  Search, Stethoscope, Building2, Globe, FileText, Users, ChevronDown,
  Star, MapPin, Shield, HeartPulse, UserPlus, Building,
  ArrowLeft, ArrowRight, Activity, Brain, Baby, Bone, Eye, Ear, Microscope, ClipboardList, CalendarCheck
} from 'lucide-react';
import { initializeStore, getAll, getCurrentUser } from '@/lib/store';
import { getInitials, cn, getRankLabel, getRankColor, formatCurrency } from '@/lib/utils';
import type { Doctor, Hospital, Specialty } from '@/types';

const searchOptions = ['doctor', 'specialty', 'city', 'hospital'] as const;

const specialtyIcons: Record<string, React.ReactNode> = {
  heart: <HeartPulse className="w-8 h-8" />,
  skin: <Activity className="w-8 h-8" />,
  bone: <Bone className="w-8 h-8" />,
  eye: <Eye className="w-8 h-8" />,
  ear: <Ear className="w-8 h-8" />,
  baby: <Baby className="w-8 h-8" />,
  brain: <Brain className="w-8 h-8" />,
  tooth: <Brain className="w-8 h-8" />,
  lung: <Activity className="w-8 h-8" />,
  medical: <Stethoscope className="w-8 h-8" />,
  default: <Microscope className="w-8 h-8" />,
};

const faqData = {
  ar: [
    { q: 'كيف يمكنني البحث عن طبيب؟', a: 'يمكنك استخدام شريط البحث في الصفحة الرئيسية للبحث باسم الطبيب أو التخصص أو المدينة أو المستشفى، كما يمكنك تصفح الأطباء حسب التخصص من صفحة التخصصات.' },
    { q: 'هل يمكنني حجز موعد عبر المنصة؟', a: 'نعم، يمكنك حجز موعد مع أي طبيب من خلال ملفه الشخصي. سيتم إرسال طلب الحجز للطبيب للتواصل معك لتأكيد الموعد.' },
    { q: 'كيف يمكنني الحصول على استشارة طبية؟', a: 'يمكنك إرسال استشارة طبية لأي طبيب عبر المنصة. سيقرأ الطبيب رسالتك ويقدم لك استشارته. هذه الخدمة متاحة للأطباء الذين يقبلون الاستشارات.' },
    { q: 'هل يمكن لمرضى من خارج الأردن استخدام المنصة؟', a: 'بالتأكيد! المنصة مصممة خصيصًا للمرضى الدوليين. يمكنك تقديم طلب علاج دولي وسنقوم بتوصيلك بأفضل الأطباء والمستشفيات في الأردن.' },
    { q: 'كيف يمكنني الانضمام كطبيب إلى المنصة؟', a: 'يمكنك الضغط على زر "انضم كطبيب" في أعلى الصفحة وملء نموذج التسجيل. بعد المراجعة، سيتم تفعيل حسابك ويمكنك البدء في استقبال المرضى.' },
  ],
  en: [
    { q: 'How can I search for a doctor?', a: 'You can use the search bar on the homepage to search by doctor name, specialty, city, or hospital. You can also browse doctors by specialty from the specialties page.' },
    { q: 'Can I book an appointment through the platform?', a: 'Yes, you can book an appointment with any doctor through their profile. The booking request will be sent to the doctor who will contact you to confirm the appointment.' },
    { q: 'How can I get a medical consultation?', a: 'You can send a medical consultation to any doctor through the platform. The doctor will read your message and provide their consultation. This service is available for doctors who accept consultations.' },
    { q: 'Can patients from outside Jordan use the platform?', a: 'Absolutely! The platform is specifically designed for international patients. You can submit an international treatment request and we will connect you with the best doctors and hospitals in Jordan.' },
    { q: 'How can I join the platform as a doctor?', a: 'Click the "Join as Doctor" button at the top of the page and fill out the registration form. After review, your account will be activated and you can start receiving patients.' },
  ],
};

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const LeftArrow = isRtl ? ArrowLeft : ArrowRight;
  const RightArrow = isRtl ? ArrowRight : ArrowLeft;

  const [searchType, setSearchType] = useState<string>('doctor');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const docScrollRef = useRef<HTMLDivElement>(null);
  const hospScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeStore();
    setDoctors(getAll<Doctor>('doctors'));
    setHospitals(getAll<Hospital>('hospitals'));
    setSpecialties(getAll<Specialty>('specialties'));
    setCurrentUser(getCurrentUser());
  }, []);

  const featuredDoctors = doctors.filter(d => d.rank === 'vip' || d.rank === 'premium').slice(0, 12);
  const featuredHospitals = hospitals.filter(h => h.rank === 'vip' || h.rank === 'premium').slice(0, 8);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams();
    if (searchType === 'doctor') params.set('name', searchQuery);
    else if (searchType === 'specialty') params.set('specialty', searchQuery);
    else if (searchType === 'city') params.set('city', searchQuery);
    else if (searchType === 'hospital') params.set('name', searchQuery);
    const basePath = searchType === 'hospital' ? '/hospitals' : '/doctors';
    router.push(`${basePath}?${params.toString()}`);
  };

  const getSearchPlaceholder = () => {
    const keys: Record<string, string> = {
      doctor: t('home.search_placeholder_doctor'),
      specialty: t('home.search_placeholder_specialty'),
      city: t('home.search_placeholder_city'),
      hospital: t('home.search_placeholder_hospital'),
    };
    return keys[searchType] || t('home.search_placeholder_doctor');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a6bb3 0%, #0d4f8a 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="container-custom relative py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {t('home.hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('home.hero_desc')}
            </p>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2 sm:gap-0">
                <select
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 flex-shrink-0"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <option value="doctor">{t('doctor.title')}</option>
                  <option value="specialty">{t('doctor.filter_specialty')}</option>
                  <option value="city">{t('doctor.filter_city')}</option>
                  <option value="hospital">{t('hospital.title')}</option>
                </select>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                dir="auto"
              />
              <button type="submit" className="btn btn-primary btn-sm rounded-lg px-6">
                <Search className="w-4 h-4" />
                {t('home.search_button')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-8 -mt-6 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              { href: '/doctors', icon: <Stethoscope className="w-6 h-6" />, label: t('home.quick_section_doctors'), color: 'text-blue-600 bg-blue-50' },
              { href: '/hospitals', icon: <Building2 className="w-6 h-6" />, label: t('home.quick_section_hospitals'), color: 'text-green-600 bg-green-50' },
              { href: '/international-treatment', icon: <Globe className="w-6 h-6" />, label: t('home.quick_section_treatment'), color: 'text-purple-600 bg-purple-50' },
              { href: '/international-treatment', icon: <FileText className="w-6 h-6" />, label: t('home.quick_section_plan'), color: 'text-amber-600 bg-amber-50' },
              { href: '/doctors?international=true', icon: <Users className="w-6 h-6" />, label: t('home.quick_section_international'), color: 'text-rose-600 bg-rose-50' },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="card flex flex-col items-center text-center gap-2 py-5 px-3 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className={`p-2.5 rounded-full ${item.color}`}>{item.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      {featuredDoctors.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('home.featured_doctors')}</h2>
              <div className="flex gap-2">
                <button onClick={() => scroll(docScrollRef, 'left')} className="btn btn-ghost btn-sm p-2 rounded-full"><LeftArrow className="w-5 h-5" /></button>
                <button onClick={() => scroll(docScrollRef, 'right')} className="btn btn-ghost btn-sm p-2 rounded-full"><RightArrow className="w-5 h-5" /></button>
              </div>
            </div>
            <div ref={docScrollRef} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {featuredDoctors.map(doc => (
                <Link key={doc.id} href={`/doctors/${doc.id}`} className="card shrink-0 w-64 p-4 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {getInitials(doc.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{locale === 'ar' ? doc.name_ar : doc.name}</p>
                      <p className="text-xs text-gray-500 truncate">{doc.specialty?.name || doc.specialty_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{doc.city?.name_ar || doc.city_id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{formatCurrency(doc.fees)}</span>
                    <span className={cn('badge', getRankColor(doc.rank))}>
                      <Star className="w-3 h-3" />
                      {getRankLabel(doc.rank, locale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Hospitals */}
      {featuredHospitals.length > 0 && (
        <section className="py-12">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('home.featured_hospitals')}</h2>
              <div className="flex gap-2">
                <button onClick={() => scroll(hospScrollRef, 'left')} className="btn btn-ghost btn-sm p-2 rounded-full"><LeftArrow className="w-5 h-5" /></button>
                <button onClick={() => scroll(hospScrollRef, 'right')} className="btn btn-ghost btn-sm p-2 rounded-full"><RightArrow className="w-5 h-5" /></button>
              </div>
            </div>
            <div ref={hospScrollRef} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {featuredHospitals.map(h => (
                <Link key={h.id} href={`/hospitals/${h.id}`} className="card shrink-0 w-72 p-4 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm shrink-0">
                      {getInitials(h.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{locale === 'ar' ? h.name_ar : h.name}</p>
                      <p className="text-xs text-gray-500 truncate">{h.departments?.split('،').slice(0, 2).join('، ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{h.city?.name_ar || h.city_id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{h.accreditations?.split('،').slice(0, 2).join(' | ')}</span>
                    <span className={cn('badge', getRankColor(h.rank))}>
                      <Star className="w-3 h-3" />
                      {getRankLabel(h.rank, locale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Specialties */}
      {specialties.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('home.popular_specialties')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {specialties.slice(0, 15).map(spec => (
                <Link
                  key={spec.id}
                  href={`/doctors?specialty=${spec.id}`}
                  className="card flex flex-col items-center text-center gap-3 py-6 px-4 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="p-3 rounded-full bg-primary-light text-primary">
                    {specialtyIcons[spec.icon || 'default']}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{locale === 'ar' ? spec.name_ar : spec.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('home.how_it_works')}</h2>
            <p className="text-gray-500">{t('home.how_it_works_desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Search className="w-8 h-8" />, title: t('home.step_1_title'), desc: t('home.step_1_desc'), color: 'bg-blue-50 text-blue-600' },
              { icon: <ClipboardList className="w-8 h-8" />, title: t('home.step_2_title'), desc: t('home.step_2_desc'), color: 'bg-green-50 text-green-600' },
              { icon: <CalendarCheck className="w-8 h-8" />, title: t('home.step_3_title'), desc: t('home.step_3_desc'), color: 'bg-purple-50 text-purple-600' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-flex mb-4">
                  <span className={`p-4 rounded-2xl ${step.color}`}>{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Jordan */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e8f0fe 100%)' }}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.why_jordan_title')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{t('home.why_jordan_desc')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: locale === 'ar' ? 'كوادر طبية متميزة' : 'Qualified Medical Staff', value: '5000+' },
                { label: locale === 'ar' ? 'مستشفيات معتمدة' : 'Accredited Hospitals', value: '70+' },
                { label: locale === 'ar' ? 'تخصص طبي' : 'Medical Specialties', value: '40+' },
                { label: locale === 'ar' ? 'مريض دولي سنوياً' : 'International Patients/Year', value: '250K+' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8 bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <UserPlus className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.join_doctors_title')}</h3>
              <p className="text-sm text-gray-500 mb-6">{t('home.join_doctors_desc')}</p>
              <Link href="/join-doctor" className="btn btn-primary">{t('nav.join_doctor')}</Link>
            </div>
            <div className="card p-8 bg-gradient-to-br from-green-50 to-white border-green-100">
              <Building className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.join_hospitals_title')}</h3>
              <p className="text-sm text-gray-500 mb-6">{t('home.join_hospitals_desc')}</p>
              <Link href="/join-hospital" className="btn btn-secondary">{t('nav.join_hospital')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('home.faq_title')}</h2>
          <div className="space-y-3">
            {faqData[locale as 'ar' | 'en'].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card p-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium text-gray-900 text-sm">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
