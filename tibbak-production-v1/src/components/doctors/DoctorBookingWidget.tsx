'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createBooking } from '@/lib/repositories/bookings';
import { Calendar, Clock, User, Phone, CheckCircle, Stethoscope } from 'lucide-react';

interface BookingWidgetProps {
  doctorId: string;
}

export default function DoctorBookingWidget({ doctorId }: BookingWidgetProps) {
  const t = useTranslations('forms');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time || !consent) return;

    setIsLoading(true);
    try {
      const res = await createBooking({
        target_type: 'doctor',
        doctor_id: doctorId,
        hospital_id: null,
        patient_name: name,
        patient_phone: phone,
        patient_whatsapp: null,
        preferred_date: date,
        preferred_time: time,
        notes: notes || null
      });

      if (res.ok) {
        setSuccessMsg(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Stethoscope className="h-5 w-5 text-teal-600" />
        {t('booking_title')}
      </h3>

      {successMsg ? (
        <div className="bg-teal-50 border border-teal-200/50 rounded-xl p-6 text-center space-y-3">
          <CheckCircle className="h-12 w-12 text-teal-600 mx-auto" />
          <h4 className="font-bold text-teal-800 text-lg">{isRtl ? 'تم استلام طلبك' : 'Request Received'}</h4>
          <p className="text-sm text-teal-800 leading-relaxed font-cairo">
            {successMsg}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('patient_name')}</label>
            <div className="relative">
              <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRtl ? 'مثال: محمد أحمد' : 'e.g. John Doe'}
                className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
              />
            </div>
          </div>

          {/* Patient Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('patient_phone')}</label>
            <div className="relative">
              <Phone className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400`} />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isRtl ? 'مثال: 962791234567+' : 'e.g. +962791234567'}
                className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('preferred_date')}</label>
              <div className="relative">
                <Calendar className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`} />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('preferred_time')}</label>
              <div className="relative">
                <Clock className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none`} />
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800`}
                >
                  <option value="">--:--</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">{t('notes')}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isRtl ? 'تفاصيل الأعراض أو تشخيص سابق...' : 'Details of symptoms or previous diagnosis...'}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800"
            />
          </div>

          {/* Consent */}
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-500 font-medium">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="text-teal-600 focus:ring-teal-500 rounded mt-0.5"
            />
            <span className="leading-tight">{t('consent')}</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !consent}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <span>{isLoading ? t('submitting') : t('submit')}</span>
          </button>

        </form>
      )}
    </div>
  );
}
