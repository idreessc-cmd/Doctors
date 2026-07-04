'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-primary/20 select-none mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-gray-500 mb-8 text-lg">
          {locale === 'ar'
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها'
            : 'Sorry, the page you are looking for does not exist or has been moved'}
        </p>
        <Link
          href="/"
          className="btn btn-primary btn-lg inline-flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          {locale === 'ar' ? 'العودة إلى الرئيسية' : 'Go Home'}
        </Link>
      </div>
    </div>
  );
}
