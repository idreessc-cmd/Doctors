'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const STORAGE_KEY = 'medical_disclaimer_dismissed_v1';

export default function MedicalDisclaimer() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-amber-50 border-t border-amber-200">
        <div className="container-custom py-3 flex items-start justify-between gap-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>{t('medical.disclaimer_title')}: </strong>
            {t('medical.disclaimer_text')}
          </p>
          <button
            onClick={dismiss}
            className="shrink-0 p-1 rounded-md hover:bg-amber-100 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
