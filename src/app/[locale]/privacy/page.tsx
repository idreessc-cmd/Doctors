'use client';

import { useLocale } from 'next-intl';
import { Shield, Lock, Eye, Cookie, Phone, Mail } from 'lucide-react';

const content = {
  ar: {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: يوليو 2026',
    intro: 'نحن في "طبّك" نلتزم بحماية خصوصية مستخدمينا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام منصتنا.',
    sections: [
      {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: 'المعلومات التي نجمعها',
        items: [
          'المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، الدولة.',
          'المعلومات الطبية: التقارير الطبية، وصف الحالة، التشخيصات السابقة (عند تقديم طلب علاج دولي).',
          'معلومات الاستخدام: الصفحات التي تزورها، مدة الزيارة، نوع الجهاز والمتصفح.',
          'معلومات الحجز: تواريخ وأوقات الحجوزات والاستشارات.',
        ],
      },
      {
        icon: <Eye className="w-6 h-6 text-primary" />,
        title: 'كيف نستخدم معلوماتك',
        items: [
          'تقديم الخدمات الطبية المطلوبة (حجوزات، استشارات، طلبات علاج دولي).',
          'تحسين تجربة المستخدم وتطوير المنصة.',
          'التواصل معك بخصوص طلباتك واستفساراتك.',
          'إرسال تنبيهات وتحديثات متعلقة بالخدمة.',
          'تحليل البيانات لتحسين جودة الخدمات المقدمة.',
        ],
      },
      {
        icon: <Lock className="w-6 h-6 text-primary" />,
        title: 'مشاركة المعلومات',
        items: [
          'نشارك معلوماتك مع الأطباء والمستشفيات فقط لغرض تقديم الخدمة التي طلبتها.',
          'لا نبيع معلوماتك الشخصية لأطراف ثالثة.',
          'قد نشارك معلومات مجمعة غير شخصية لأغراض تحليلية وإحصائية.',
          'نلتزم بالامتثال للقوانين والأنظمة المحلية والدولية لحماية البيانات.',
        ],
      },
      {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: 'حقوق المرضى',
        items: [
          'حق الوصول إلى معلوماتك الشخصية وتحديثها.',
          'حق طلب حذف معلوماتك الشخصية (مع مراعاة المتطلبات القانونية).',
          'حق الاعتراض على معالجة بياناتك لأغراض التسويق.',
          'حق سحب الموافقة على معالجة البيانات في أي وقت.',
          'حق تقديم شكوى للجهات الرقابية المختصة.',
        ],
      },
      {
        icon: <Cookie className="w-6 h-6 text-primary" />,
        title: 'ملفات تعريف الارتباط (Cookies)',
        items: [
          'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتك.',
          'يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.',
          'نستخدم ملفات تحليلية لفهم كيفية استخدام المنصة وتحسين أدائها.',
        ],
      },
      {
        icon: <Lock className="w-6 h-6 text-primary" />,
        title: 'الإجراءات الأمنية',
        items: [
          'نستخدم تشفير SSL لحماية بياناتك أثناء النقل.',
          'نطبق إجراءات أمنية صارمة للوصول إلى قواعد البيانات.',
          'نقوم بتحديث إجراءاتنا الأمنية بشكل دوري.',
          'نحدد الوصول إلى المعلومات الشخصية للموظفين المصرح لهم فقط.',
        ],
      },
      {
        icon: <Phone className="w-6 h-6 text-primary" />,
        title: 'اتصل بنا',
        items: [
          'للاستفسارات المتعلقة بسياسة الخصوصية، يرجى التواصل معنا عبر:',
          'البريد الإلكتروني: privacy@tabibak.jo',
          'الهاتف: +962 7 0000 0000',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last Updated: July 2026',
    intro: 'At Tabibak, we are committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, and protect the personal information you provide when using our platform.',
    sections: [
      {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: 'Information We Collect',
        items: [
          'Personal information: name, email, phone number, country.',
          'Medical information: medical reports, condition descriptions, previous diagnoses (when submitting international treatment requests).',
          'Usage information: pages visited, visit duration, device and browser type.',
          'Booking information: appointment dates and times, consultation details.',
        ],
      },
      {
        icon: <Eye className="w-6 h-6 text-primary" />,
        title: 'How We Use Your Information',
        items: [
          'Providing requested medical services (bookings, consultations, international treatment requests).',
          'Improving user experience and platform development.',
          'Communicating with you regarding your requests and inquiries.',
          'Sending service-related notifications and updates.',
          'Data analysis to improve the quality of services provided.',
        ],
      },
      {
        icon: <Lock className="w-6 h-6 text-primary" />,
        title: 'Information Sharing',
        items: [
          'We share your information with doctors and hospitals solely for the purpose of providing the service you requested.',
          'We do not sell your personal information to third parties.',
          'We may share aggregated, non-personal information for analytical and statistical purposes.',
          'We comply with local and international data protection laws and regulations.',
        ],
      },
      {
        icon: <Shield className="w-6 h-6 text-primary" />,
        title: 'Patient Rights',
        items: [
          'Right to access and update your personal information.',
          'Right to request deletion of your personal information (subject to legal requirements).',
          'Right to object to processing of your data for marketing purposes.',
          'Right to withdraw consent for data processing at any time.',
          'Right to file a complaint with the relevant regulatory authorities.',
        ],
      },
      {
        icon: <Cookie className="w-6 h-6 text-primary" />,
        title: 'Cookies',
        items: [
          'We use cookies to enhance your browsing experience and remember your preferences.',
          'You can control cookie settings through your browser.',
          'We use analytical cookies to understand how the platform is used and improve performance.',
        ],
      },
      {
        icon: <Lock className="w-6 h-6 text-primary" />,
        title: 'Security Measures',
        items: [
          'We use SSL encryption to protect your data during transmission.',
          'We implement strict security measures for database access.',
          'We periodically update our security procedures.',
          'We limit access to personal information to authorized personnel only.',
        ],
      },
      {
        icon: <Phone className="w-6 h-6 text-primary" />,
        title: 'Contact Us',
        items: [
          'For privacy policy inquiries, please contact us at:',
          'Email: privacy@tabibak.jo',
          'Phone: +962 7 0000 0000',
        ],
      },
    ],
  },
};

export default function PrivacyPage() {
  const locale = useLocale();
  const c = content[locale as 'ar' | 'en'];

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{c.title}</h1>
          <p className="text-sm text-gray-400">{c.updated}</p>
        </div>

        <div className="card p-8 mb-8">
          <p className="text-gray-600 leading-relaxed">{c.intro}</p>
        </div>

        <div className="space-y-6">
          {c.sections.map((section, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
