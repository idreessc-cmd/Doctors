'use client';

import { useLocale } from 'next-intl';
import { FileText, AlertTriangle, Scale, UserCheck, Ban, Gavel } from 'lucide-react';

const content = {
  ar: {
    title: 'شروط الاستخدام',
    updated: 'آخر تحديث: يوليو 2026',
    intro: 'يرجى قراءة شروط الاستخدام التالية بعناية قبل استخدام منصة "طبّك". باستخدامك للمنصة، فإنك توافق على هذه الشروط بشكل كامل.',
    sections: [
      {
        icon: <FileText className="w-6 h-6 text-primary" />,
        title: 'القبول بالشروط',
        items: [
          'باستخدامك لمنصة طبّك، فإنك تقر وتوافق على الالتزام بهذه الشروط.',
          'إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام المنصة.',
          'نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إبلاغ المستخدمين بأي تغييرات جوهرية.',
        ],
      },
      {
        icon: <Scale className="w-6 h-6 text-primary" />,
        title: 'دور المنصة',
        items: [
          'طبّك هي منصة وسيطة تربط بين المرضى والأطباء والمستشفيات.',
          'المنصة لا تقدم خدمات طبية مباشرة ولا تعوض عن الاستشارة الطبية المباشرة.',
          'المعلومات المعروضة على المنصة مقدمة من الأطباء والمستشفيات، ولا تتحمل المنصة مسؤولية دقتها الكاملة.',
          'المنصة تسهل عملية التواصل والحجز ولكنها ليست طرفاً في العلاقة العلاجية بين المريض والطبيب.',
        ],
      },
      {
        icon: <UserCheck className="w-6 h-6 text-primary" />,
        title: 'التزامات المستخدم',
        items: [
          'تقديم معلومات دقيقة وكاملة عند التسجيل أو حجز المواعيد.',
          'عدم استخدام المنصة لأغراض غير قانونية.',
          'احترام مواعيد الحجوزات وإلغاؤها مسبقاً في حال عدم التمكن من الحضور.',
          'عدم إساءة استخدام خاصية التواصل أو إرسال رسائل غير لائقة.',
          'المحافظة على سرية معلومات حسابك وكلمة المرور.',
        ],
      },
      {
        icon: <AlertTriangle className="w-6 h-6 text-primary" />,
        title: 'إخلاء المسؤولية',
        items: [
          'المنصة لا تقدم تشخيصاً طبياً أو توصيات علاجية.',
          'المعلومات المنشورة على المنصة للأغراض المعلوماتية فقط ولا تغني عن الاستشارة الطبية المباشرة.',
          'في الحالات الطارئة، يجب التوجه فوراً إلى أقرب مركز طوارئ.',
          'الأسعار المعروضة قد تتغير ويجب تأكيدها مع الطبيب أو المستشفى.',
          'التقييمات تعبر عن رأي المستخدمين ولا تعتبر حكماً طبياً نهائياً.',
        ],
      },
      {
        icon: <Ban className="w-6 h-6 text-primary" />,
        title: 'حدود المسؤولية',
        items: [
          'لا تتحمل المنصة مسؤولية أي ضرر ناتج عن استخدام أو عدم القدرة على استخدام المنصة.',
          'مسؤولية المنصة تقتصر على تسهيل التواصل بين الأطراف.',
          'لا نضمن توفر جميع الأطباء والمستشفيات في جميع الأوقات.',
          'المنصة غير مسؤولة عن أي تصرفات أو إهمال من قبل مقدمي الخدمات الطبية.',
        ],
      },
      {
        icon: <Gavel className="w-6 h-6 text-primary" />,
        title: 'القانون المطبق',
        items: [
          'تخضع هذه الشروط للقوانين الأردنية.',
          'يتم فض أي نزاعات عن طريق التفاوض الودي، وفي حال تعذر ذلك يتم اللجوء إلى القضاء الأردني المختص.',
          'هذه الاتفاقية تمثل الاتفاق الكامل بين المستخدم والمنصة فيما يتعلق باستخدام الخدمات.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    updated: 'Last Updated: July 2026',
    intro: 'Please read the following Terms of Use carefully before using Tabibak platform. By using the platform, you agree to be bound by these terms in full.',
    sections: [
      {
        icon: <FileText className="w-6 h-6 text-primary" />,
        title: 'Acceptance of Terms',
        items: [
          'By using Tabibak platform, you acknowledge and agree to be bound by these terms.',
          'If you do not agree to any part of these terms, you must not use the platform.',
          'We reserve the right to modify these terms at any time, and users will be notified of any material changes.',
        ],
      },
      {
        icon: <Scale className="w-6 h-6 text-primary" />,
        title: 'Platform Role',
        items: [
          'Tabibak is an intermediary platform connecting patients with doctors and hospitals.',
          'The platform does not provide direct medical services and does not replace direct medical consultation.',
          'Information displayed on the platform is provided by doctors and hospitals, and the platform does not guarantee its complete accuracy.',
          'The platform facilitates communication and booking but is not a party to the treatment relationship between patient and doctor.',
        ],
      },
      {
        icon: <UserCheck className="w-6 h-6 text-primary" />,
        title: 'User Obligations',
        items: [
          'Provide accurate and complete information when registering or booking appointments.',
          'Not use the platform for any illegal purposes.',
          'Respect appointment times and cancel in advance if unable to attend.',
          'Not misuse communication features or send inappropriate messages.',
          'Maintain the confidentiality of your account information and password.',
        ],
      },
      {
        icon: <AlertTriangle className="w-6 h-6 text-primary" />,
        title: 'Disclaimer',
        items: [
          'The platform does not provide medical diagnosis or treatment recommendations.',
          'Information published on the platform is for informational purposes only and does not replace direct medical consultation.',
          'In emergency cases, immediately go to the nearest emergency center.',
          'Listed prices may change and must be confirmed with the doctor or hospital.',
          'Reviews reflect user opinions and are not final medical judgments.',
        ],
      },
      {
        icon: <Ban className="w-6 h-6 text-primary" />,
        title: 'Limitation of Liability',
        items: [
          'The platform is not liable for any damages resulting from the use or inability to use the platform.',
          'The platform\'s responsibility is limited to facilitating communication between parties.',
          'We do not guarantee the availability of all doctors and hospitals at all times.',
          'The platform is not responsible for any actions or negligence by healthcare providers.',
        ],
      },
      {
        icon: <Gavel className="w-6 h-6 text-primary" />,
        title: 'Governing Law',
        items: [
          'These terms are subject to Jordanian laws.',
          'Any disputes shall be resolved through amicable negotiation, and if not possible, through the competent Jordanian courts.',
          'This agreement constitutes the entire agreement between the user and the platform regarding the use of services.',
        ],
      },
    ],
  },
};

export default function TermsPage() {
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
