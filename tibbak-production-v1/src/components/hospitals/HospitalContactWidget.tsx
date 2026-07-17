'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getHospitalContact } from '@/lib/repositories/hospitals';
import { Phone, MessageSquare, Globe, HeartHandshake, CheckCircle } from 'lucide-react';

interface ContactWidgetProps {
  hospitalId: string;
  isDirectAllowed: boolean;
  initialWebsite: string | null;
}

export default function HospitalContactWidget({ hospitalId, isDirectAllowed, initialWebsite }: ContactWidgetProps) {
  const tDocs = useTranslations('doctors');
  const tForms = useTranslations('forms');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  const handleContactRequest = async (action: 'phone' | 'whatsapp') => {
    setIsLoading(true);
    try {
      const res = await getHospitalContact(hospitalId, action, 'Hospital Visitor', '+962790000000');
      
      if (res.isDirectAllowed) {
        setPhone(res.phone);
        setWhatsapp(res.whatsapp);
      } else {
        setShowSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-2">
        <HeartHandshake className="h-5 w-5 text-teal-600 animate-pulse" />
        {isRtl ? 'اتصال وحجز زيارة بالمستشفى' : 'Contact & Book Hospital Visit'}
      </h3>

      {showSuccess ? (
        <div className="bg-teal-50 border border-teal-200/50 rounded-xl p-4 text-center space-y-2">
          <CheckCircle className="h-10 w-10 text-teal-600 mx-auto" />
          <p className="text-sm font-semibold text-teal-800 font-cairo">
            {tForms('success_message')}
          </p>
        </div>
      ) : (
        <>
          {/* Phone reveal / Click */}
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-between w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-3 rounded-xl border border-gray-100 font-semibold transition-all text-sm sm:text-base"
            >
              <span className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-teal-600" />
                <span>{phone}</span>
              </span>
              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                {isRtl ? 'اتصل الآن' : 'Call Now'}
              </span>
            </a>
          ) : (
            <button
              onClick={() => handleContactRequest('phone')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base shadow-sm disabled:opacity-50"
            >
              <Phone className="h-5 w-5" />
              <span>{isDirectAllowed ? (isRtl ? 'عرض رقم الهاتف' : 'Show Phone Number') : tDocs('contact_request_btn')}</span>
            </button>
          )}

          {/* WhatsApp reveal / Click */}
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 px-4 py-3 rounded-xl border border-emerald-100/50 font-semibold transition-all text-sm sm:text-base"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <span>{whatsapp}</span>
              </span>
              <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                {isRtl ? 'دردشة' : 'Chat'}
              </span>
            </a>
          ) : (
            <button
              onClick={() => handleContactRequest('whatsapp')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base shadow-sm disabled:opacity-50"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{isDirectAllowed ? (isRtl ? 'محادثة واتساب' : 'WhatsApp Chat') : (isRtl ? 'طلب تواصل واتساب' : 'Request WhatsApp Contact')}</span>
            </button>
          )}

          {/* Website Link */}
          {initialWebsite && (
            <a
              href={initialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl border border-gray-200 font-semibold transition-all text-sm sm:text-base"
            >
              <Globe className="h-4.5 w-4.5 text-gray-400" />
              <span>{isRtl ? 'الموقع الإلكتروني الرسمي' : 'Official Website'}</span>
            </a>
          )}
        </>
      )}
    </div>
  );
}
