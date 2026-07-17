import { setRequestLocale, getTranslations } from 'next-intl/server';
import InternationalForm from '@/components/international/InternationalForm';
import { Plane, HeartHandshake, ShieldCheck, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  return {
    title: isRtl ? 'طلب علاج وتنسيق طبي في الأردن - منصة طبّك' : 'Request Medical Treatment & Coordination in Jordan - Tabibak',
    description: isRtl
      ? 'اطلب خطة علاجية متكاملة وسياحة استشفائية في الأردن مجاناً. تنسيق الاستقبال والمترجمين وحجوزات المستشفيات.'
      : 'Request a free medical treatment plan and health coordination in Jordan. Complete coordination for international patients.',
  };
}

interface InternationalPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InternationalPage({ params }: InternationalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRtl = locale === 'ar';

  const t = await getTranslations('forms');

  return (
    <div className="py-12 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100/50 mb-4">
            <Plane className="h-3.5 w-3.5 animate-bounce" />
            {isRtl ? 'بوابة المرضى الدوليين' : 'International Patient Portal'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {t('intl_title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-3 font-cairo leading-relaxed">
            {isRtl
              ? 'احصل على استشارة مجانية وعروض تكلفة علاجية تقديرية من كبار الاستشاريين والمستشفيات المعتمدة بالأردن قبل السفر.'
              : 'Get a free medical consultation and estimated treatment cost plan from top consultants and accredited hospitals in Jordan before traveling.'}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-sm">
            <ShieldCheck className="h-6 w-6 text-teal-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{isRtl ? 'تنسيق مجاني بالكامل' : '100% Free Coordination'}</h4>
              <p className="text-xs text-slate-500 mt-1 font-cairo">{isRtl ? 'لا نتقاضى أي رسوم أو عمولات من المرضى الدوليين.' : 'We do not charge any fees or commissions from international patients.'}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-sm">
            <HeartHandshake className="h-6 w-6 text-teal-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{isRtl ? 'مستشفيات معتمدة' : 'Accredited Hospitals'}</h4>
              <p className="text-xs text-slate-500 mt-1 font-cairo">{isRtl ? 'نتعامل مع المستشفيات الحاصلة على شهادة JCI العالمية.' : 'We partner exclusively with JCI internationally accredited hospitals.'}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-sm">
            <Compass className="h-6 w-6 text-teal-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{isRtl ? 'استقبال وخدمات لوجستية' : 'Airport & Translation'}</h4>
              <p className="text-xs text-slate-500 mt-1 font-cairo">{isRtl ? 'توفير المترجمين، حجز الفنادق وتأمين المواصلات.' : 'Arranging medical interpreters, hotels, and airport pick-ups.'}</p>
            </div>
          </div>
        </div>

        <InternationalForm />

      </div>
    </div>
  );
}
