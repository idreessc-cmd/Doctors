'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Shield, Eye, Target, Heart } from 'lucide-react';

const content = {
  ar: {
    title: 'من نحن',
    subtitle: 'منصتك الطبية الموثوقة الأولى في الأردن لربط المرضى بأفضل الأطباء والمستشفيات',
    intro: 'طبّك هي منصة أردنية رائدة في مجال السياحة العلاجية والخدمات الطبية الرقمية، تأسست بهدف تسهيل وصول المرضى من داخل الأردن ومن جميع أنحاء العالم إلى أفضل الخدمات الطبية في المملكة. نحن نؤمن بأن الرعاية الصحية الجيدة يجب أن تكون متاحة للجميع، وأن التكنولوجيا يمكن أن تلعب دوراً محورياً في تحويل تجربة البحث عن الرعاية الصحية وجعلها أكثر شفافية وكفاءة.',
    mission: {
      title: 'رسالتنا',
      text: 'تمكين المرضى من اتخاذ قرارات مستنيرة بشأن رحلتهم العلاجية من خلال توفير معلومات شاملة وشفافة عن الأطباء والمستشفيات في الأردن، مع تسهيل عملية الحجز والتواصل والاستشارات الطبية عن بعد.',
    },
    vision: {
      title: 'رؤيتنا',
      text: 'أن نكون المنصة الرقمية الأولى في العالم العربي للسياحة العلاجية، وأن نجعل الأردن الوجهة الأولى للمرضى من جميع أنحاء العالم الباحثين عن رعاية صحية عالية الجودة وبأسعار تنافسية.',
    },
    values: [
      { title: 'الشفافية', text: 'نقدم معلومات دقيقة وواضحة عن الأطباء والمستشفيات والأسعار والتقييمات لتمكين المريض من اتخاذ القرار الصحيح.' },
      { title: 'الجودة', text: 'نحرص على أن تكون جميع الخدمات الطبية المقدمة عبر منصتنا وفق أعلى معايير الجودة والاعتمادات الدولية.' },
      { title: 'الثقة', text: 'نبني جسور الثقة بين المرضى ومقدمي الخدمات الطبية من خلال التحقق من المؤهلات والاعتمادات.' },
      { title: 'الابتكار', text: 'نستخدم أحدث التقنيات الرقمية لتسهيل رحلة المريض من البحث الأولي إلى المتابعة بعد العلاج.' },
      { title: 'الرعاية', text: 'نضع المريض في قلب كل ما نقوم به، ونقدم الدعم الكامل طوال رحلته العلاجية.' },
    ],
    team: 'فريقنا',
    teamText: 'يتكون فريق طبّك من نخبة من الخبراء في المجال الطبي وتقنية المعلومات والتسويق الرقمي، يجمعهم شغف مشترك بتطوير قطاع الرعاية الصحية في الأردن وجعله في متناول الجميع.',
  },
  en: {
    title: 'About Us',
    subtitle: 'Your trusted medical platform in Jordan connecting patients with the best doctors and hospitals',
    intro: 'Tabibak is a leading Jordanian platform in medical tourism and digital health services, established to facilitate access for patients from Jordan and around the world to the best medical services in the Kingdom. We believe that good healthcare should be accessible to everyone, and that technology can play a pivotal role in transforming the healthcare search experience, making it more transparent and efficient.',
    mission: {
      title: 'Our Mission',
      text: 'Empowering patients to make informed decisions about their treatment journey by providing comprehensive and transparent information about doctors and hospitals in Jordan, while facilitating booking, communication, and telemedicine consultations.',
    },
    vision: {
      title: 'Our Vision',
      text: 'To be the leading digital platform for medical tourism in the Arab world, and to make Jordan the top destination for patients from around the world seeking high-quality healthcare at competitive prices.',
    },
    values: [
      { title: 'Transparency', text: 'We provide accurate and clear information about doctors, hospitals, prices, and ratings to empower patients to make the right decision.' },
      { title: 'Quality', text: 'We ensure that all medical services offered through our platform meet the highest quality standards and international accreditations.' },
      { title: 'Trust', text: 'We build bridges of trust between patients and healthcare providers by verifying qualifications and accreditations.' },
      { title: 'Innovation', text: 'We use the latest digital technologies to facilitate the patient journey from initial search to post-treatment follow-up.' },
      { title: 'Care', text: 'We put the patient at the heart of everything we do, providing full support throughout their treatment journey.' },
    ],
    team: 'Our Team',
    teamText: 'The Tabibak team consists of elite experts in the medical field, information technology, and digital marketing, united by a shared passion for advancing healthcare in Jordan and making it accessible to all.',
  },
};

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();
  const c = content[locale as 'ar' | 'en'];

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{c.title}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{c.subtitle}</p>
      </div>

      {/* Intro */}
      <div className="card p-8 mb-8">
        <p className="text-gray-600 leading-relaxed text-lg">{c.intro}</p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-8 border-t-4 border-t-primary">
          <Target className="w-8 h-8 text-primary mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{c.mission.title}</h2>
          <p className="text-gray-600 leading-relaxed">{c.mission.text}</p>
        </div>
        <div className="card p-8 border-t-4 border-t-secondary">
          <Eye className="w-8 h-8 text-secondary mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{c.vision.title}</h2>
          <p className="text-gray-600 leading-relaxed">{c.vision.text}</p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{locale === 'ar' ? 'قيمنا' : 'Our Values'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {c.values.map((v, i) => (
            <div key={i} className="card p-6 hover:shadow-md">
              <Heart className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="card p-8 bg-gradient-to-br from-primary-light to-white">
        <Shield className="w-8 h-8 text-primary mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{c.team}</h2>
        <p className="text-gray-600 leading-relaxed">{c.teamText}</p>
      </div>
    </div>
  );
}
