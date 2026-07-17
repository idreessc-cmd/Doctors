'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('forms');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !notes) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(
        isRtl
          ? 'تم استلام رسالتك بنجاح! هذا نموذج تجريبي في المرحلة الأولى، وسيقوم فريق الدعم بالرد عليك عبر البريد الإلكتروني في أقرب وقت.'
          : 'Your inquiry has been successfully received! This is a mock/MVP demonstration model, and our support team will reply to your email shortly.'
      );
    }, 600);
  };

  return (
    <div className="py-12 bg-slate-50/50 flex-1">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {t('contact_title')}
          </h1>
          <p className="text-slate-500 mt-2 font-cairo">
            {isRtl ? 'يسعدنا دائماً الإجابة على استفساراتكم وتقديم الدعم الفني.' : 'We are always happy to answer your inquiries and provide technical assistance.'}
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Support Info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Email card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
              <Mail className="h-6 w-6 text-teal-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{isRtl ? 'البريد الإلكتروني' : 'Email Support'}</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono">support@tabibak.jordan</p>
              </div>
            </div>

            {/* Phone card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
              <Phone className="h-6 w-6 text-teal-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{isRtl ? 'مركز الاتصال' : 'Call Center'}</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono">+96265000000</p>
              </div>
            </div>

            {/* Address card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
              <MapPin className="h-6 w-6 text-teal-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{isRtl ? 'الموقع الرئيسي' : 'Headquarters'}</h4>
                <p className="text-xs text-slate-500 mt-1 font-cairo">عمان، الأردن - العبدلي</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
            {successMsg ? (
              <div className="text-center space-y-4 py-8">
                <CheckCircle className="h-16 w-16 text-teal-600 mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-teal-800">{isRtl ? 'تم إرسال الرسالة' : 'Message Sent'}</h3>
                <p className="text-sm text-teal-800 leading-relaxed font-cairo">
                  {successMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('patient_name')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRtl ? 'أدخل اسمك الكامل...' : 'Enter your full name...'}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('patient_email')}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('patient_phone')}</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+962791234567"
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{isRtl ? 'محتوى الرسالة أو الاستفسار' : 'Message or Inquiry'}</label>
                  <textarea
                    required
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isRtl ? 'اكتب تفاصيل استفسارك هنا...' : 'Write details of your inquiry here...'}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <Send className="h-4.5 w-4.5" />
                  <span>{isLoading ? t('submitting') : t('submit')}</span>
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
