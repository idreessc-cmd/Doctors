import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { Cairo, Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html 
      className={`${cairo.variable} ${inter.variable}`} 
      dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      lang={locale}
    >
      <body className={`min-h-screen flex flex-col antialiased ${locale === 'ar' ? 'font-cairo' : 'font-sans'}`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
