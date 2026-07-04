'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { generateId } from '@/lib/utils';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    const contactMsg: ContactMessage = {
      id: generateId(),
      ...formData,
      created_at: new Date().toISOString(),
    };

    const stored = JSON.parse(localStorage.getItem('tabibak_contact_messages') || '[]');
    stored.push(contactMsg);
    localStorage.setItem('tabibak_contact_messages', JSON.stringify(stored));

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('common.contact_us')}</h1>
          <p className="text-gray-500">
            {locale === 'ar' ? 'نرحب باستفساراتكم وملاحظاتكم' : 'We welcome your inquiries and feedback'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="card p-6 flex items-start gap-4">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                <p className="text-sm text-gray-500">info@tabibak.jo</p>
              </div>
            </div>
            <div className="card p-6 flex items-start gap-4">
              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{locale === 'ar' ? 'الهاتف' : 'Phone'}</p>
                <p className="text-sm text-gray-500">+962 7 0000 0000</p>
              </div>
            </div>
            <div className="card p-6 flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{locale === 'ar' ? 'العنوان' : 'Address'}</p>
                <p className="text-sm text-gray-500">Amman, Jordan</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="card p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {locale === 'ar' ? 'تم إرسال رسالتك' : 'Message Sent'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {locale === 'ar' ? 'سنقوم بالرد عليك في أقرب وقت ممكن' : 'We will get back to you as soon as possible'}
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-outline btn-sm">
                  {locale === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">{error}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ar' ? 'الاسم' : 'Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      dir="auto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {locale === 'ar' ? 'الرسالة' : 'Message'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="input resize-none"
                    dir="auto"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Send className="w-4 h-4" />
                  {t('common.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
