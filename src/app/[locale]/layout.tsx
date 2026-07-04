import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MedicalDisclaimer from '@/components/layout/MedicalDisclaimer';
import arMessages from '../../../messages/ar.json';
import enMessages from '../../../messages/en.json';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return {
    title: {
      default: `${t('name')} | ${t('tagline')}`,
      template: `%s | ${t('name')}`,
    },
    description: t('description'),
    icons: { icon: '/favicon.ico' },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound();
  }

  const messages = locale === 'ar' ? arMessages : enMessages;

  return (
    <html dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <MedicalDisclaimer />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
