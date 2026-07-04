import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'JOD'): string {
  return `${amount.toFixed(2)} ${currency === 'JOD' ? 'د.أ' : currency}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function getRankLabel(rank: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    normal: { ar: 'عادي', en: 'Standard' },
    verified: { ar: 'موثق', en: 'Verified' },
    premium: { ar: 'مميز', en: 'Premium' },
    vip: { ar: 'VIP', en: 'VIP' },
  };
  return labels[rank]?.[locale] || rank;
}

export function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    normal: 'text-gray-500',
    verified: 'text-blue-500',
    premium: 'text-amber-500',
    vip: 'text-yellow-500',
  };
  return colors[rank] || 'text-gray-500';
}

export function getBookingStatusLabel(status: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    new: { ar: 'جديد', en: 'New' },
    confirmed: { ar: 'مؤكد', en: 'Confirmed' },
    rejected: { ar: 'مرفوض', en: 'Rejected' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
  };
  return labels[status]?.[locale] || status;
}

export function getConsultationStatusLabel(status: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    new: { ar: 'جديدة', en: 'New' },
    answered: { ar: 'تمت الإجابة', en: 'Answered' },
    closed: { ar: 'مغلقة', en: 'Closed' },
  };
  return labels[status]?.[locale] || status;
}

export function getInternationalStatusLabel(status: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    new: { ar: 'جديد', en: 'New' },
    under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
    contacted: { ar: 'تم التواصل', en: 'Contacted' },
    sent_to_doctor: { ar: 'تم التحويل لطبيب', en: 'Sent to Doctor' },
    sent_to_hospital: { ar: 'تم التحويل لمستشفى', en: 'Sent to Hospital' },
    waiting_reply: { ar: 'بانتظار الرد', en: 'Waiting Reply' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    closed: { ar: 'مغلق', en: 'Closed' },
  };
  return labels[status]?.[locale] || status;
}
