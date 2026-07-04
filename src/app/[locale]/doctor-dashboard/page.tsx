'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  LayoutDashboard, UserCircle, Calendar, MessageSquare, BarChart3,
  Package as PackageIcon, TrendingUp, Menu, X, ChevronLeft,
  ChevronRight, Eye, Phone, MessageCircle, CalendarCheck,
  Clock, User, Star, Mail, Shield, Award, CheckCircle2,
  AlertCircle, DollarSign, Edit3, Save, Reply, Filter,
  ExternalLink, FileText, Info, CreditCard, Building2,
  Wallet, PlusCircle, ArrowUpCircle, Loader2, ChevronDown,
  ChevronUp, Search
} from 'lucide-react';
import {
  initializeStore, getAll, getById, add, update,
  getCurrentUser, isAuthenticated, hasRole, getStats
} from '@/lib/store';
import { cn, formatCurrency, getBookingStatusLabel, getConsultationStatusLabel, generateId } from '@/lib/utils';
import type { Doctor, Booking, Consultation, Package as PackageType, DashboardStats } from '@/types';

const sidebarSections = [
  { key: 'overview', icon: LayoutDashboard },
  { key: 'profile', icon: UserCircle },
  { key: 'bookings', icon: Calendar },
  { key: 'consultations', icon: MessageSquare },
  { key: 'stats', icon: BarChart3 },
  { key: 'package', icon: PackageIcon },
  { key: 'upgrade', icon: TrendingUp },
] as const;

const bookingStatuses = ['all', 'new', 'confirmed', 'rejected', 'completed', 'cancelled'] as const;

export default function DoctorDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    profile_views: 0, contact_clicks: 0, whatsapp_clicks: 0,
    bookings_count: 0, consultations_count: 0, hidden_requests: 0
  });
  const [doctorPackage, setDoctorPackage] = useState<PackageType | undefined>();

  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [expandedConsultId, setExpandedConsultId] = useState<string | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [replyConsultId, setReplyConsultId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [profileForm, setProfileForm] = useState({
    fees: 0, bio: '', bio_ar: '', working_hours: '', languages: '',
    accepts_booking: false, accepts_consultation: false, accepts_international: false
  });

  const [upgradeForm, setUpgradeForm] = useState({ package_id: '', payment_method: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    initializeStore();
    const user = getCurrentUser();
    if (!user || !isAuthenticated() || !hasRole('doctor')) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    const allDoctors = getAll<Doctor>('doctors');
    const found = allDoctors.find(d => d.user_id === user.id);
    if (!found) {
      setError('Doctor profile not found');
      setLoading(false);
      return;
    }
    setDoctor(found);
    setProfileForm({
      fees: found.fees, bio: found.bio || '', bio_ar: found.bio_ar || '',
      working_hours: found.working_hours || '', languages: found.languages || '',
      accepts_booking: found.accepts_booking, accepts_consultation: found.accepts_consultation,
      accepts_international: found.accepts_international
    });

    const allBookings = getAll<Booking>('bookings').filter(b => b.doctor_id === found.id);
    const allConsultations = getAll<Consultation>('consultations').filter(c => c.doctor_id === found.id);
    const allPackages = getAll<PackageType>('packages').filter(p => p.type === 'doctor');
    const currentStats = getStats('doctor', found.id);

    setBookings(allBookings);
    setConsultations(allConsultations);
    setPackages(allPackages);
    setStats(currentStats);
    setDoctorPackage(allPackages.find(p => p.id === found.package_id));
    setLoading(false);
  }, []);

  const refreshData = () => {
    if (!doctor) return;
    const allBookings = getAll<Booking>('bookings').filter(b => b.doctor_id === doctor.id);
    const allConsultations = getAll<Consultation>('consultations').filter(c => c.doctor_id === doctor.id);
    const currentStats = getStats('doctor', doctor.id);
    setBookings(allBookings);
    setConsultations(allConsultations);
    setStats(currentStats);
  };

  const handleEditProfile = async () => {
    if (!doctor) return;
    setSaving(true);
    update('doctors', doctor.id, {
      fees: profileForm.fees,
      bio: profileForm.bio,
      bio_ar: profileForm.bio_ar,
      working_hours: profileForm.working_hours,
      languages: profileForm.languages,
      accepts_booking: profileForm.accepts_booking,
      accepts_consultation: profileForm.accepts_consultation,
      accepts_international: profileForm.accepts_international,
    });
    const updated = getById<Doctor>('doctors', doctor.id);
    if (updated) setDoctor(updated);
    setSaving(false);
    setShowProfileModal(false);
  };

  const handleBookingStatus = (bookingId: string, newStatus: string) => {
    update('bookings', bookingId, { status: newStatus } as any);
    refreshData();
  };

  const handleReplyConsultation = () => {
    if (!replyConsultId || !replyText.trim()) return;
    update('consultations', replyConsultId, { reply: replyText, status: 'answered' } as any);
    setReplyText('');
    setReplyConsultId(null);
    setShowReplyModal(false);
    refreshData();
  };

  const handleUpgradeRequest = () => {
    if (!upgradeForm.package_id || !currentUser) return;
    add('subscriptions', {
      id: generateId(),
      user_id: currentUser.id,
      package_id: upgradeForm.package_id,
      start_date: new Date().toISOString(),
      payment_method: upgradeForm.payment_method,
      payment_status: 'pending',
      admin_confirmed: false,
      notes: upgradeForm.notes || '',
      created_at: new Date().toISOString(),
    } as any);
    setUpgradeForm({ package_id: '', payment_method: '', notes: '' });
    setShowUpgradeModal(false);
  };

  const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter);
  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const recentConsultations = [...consultations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const contactUsed = stats.contact_clicks + stats.whatsapp_clicks + stats.bookings_count + stats.consultations_count;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-orange-100 text-orange-700',
    answered: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',
  };

  const statusTranslations: Record<string, string> = {
    new: locale === 'ar' ? 'جديد' : 'New',
    confirmed: locale === 'ar' ? 'مؤكد' : 'Confirmed',
    rejected: locale === 'ar' ? 'مرفوض' : 'Rejected',
    completed: locale === 'ar' ? 'مكتمل' : 'Completed',
    cancelled: locale === 'ar' ? 'ملغي' : 'Cancelled',
    answered: locale === 'ar' ? 'تمت الإجابة' : 'Answered',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{locale === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-gray-700 font-medium">{error || (locale === 'ar' ? 'لم يتم العثور على ملف الطبيب' : 'Doctor profile not found')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-0 h-screen z-50 w-64 bg-white border-l border-gray-200 shadow-sm transition-transform duration-300 flex flex-col',
          isRtl ? 'right-0 border-l' : 'left-0 border-r',
          sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full'),
          'lg:translate-x-0'
        )}>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{doctor.name_ar}</p>
                <p className="text-xs text-gray-500 truncate">{locale === 'ar' ? 'لوحة الطبيب' : 'Doctor Dashboard'}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {sidebarSections.map(section => {
              const Icon = section.icon;
              const labels: Record<string, string> = {
                overview: t('doctor_dashboard.overview'),
                profile: t('doctor_dashboard.profile'),
                bookings: t('doctor_dashboard.bookings'),
                consultations: t('doctor_dashboard.consultations'),
                stats: t('doctor_dashboard.stats'),
                package: t('doctor_dashboard.package'),
                upgrade: t('doctor_dashboard.upgrade'),
              };
              return (
                <button
                  key={section.key}
                  onClick={() => { setActiveSection(section.key); setSidebarOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeSection === section.key
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{labels[section.key] || section.key}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-800">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">{t('doctor_dashboard.title')}</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:block">{doctor.name_ar}</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* ==================== OVERVIEW ==================== */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {locale === 'ar' ? `مرحبًا، ${doctor.name_ar}` : `Welcome, ${doctor.name}`}
                  </h2>
                  <p className="text-gray-500 mt-1">{locale === 'ar' ? 'نظرة عامة على نشاطك' : 'Overview of your activity'}</p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: t('doctor_dashboard.profile_views'), value: stats.profile_views, icon: Eye, color: 'text-blue-500 bg-blue-100' },
                    { label: t('doctor_dashboard.contact_clicks'), value: stats.contact_clicks, icon: Phone, color: 'text-green-500 bg-green-100' },
                    { label: t('doctor_dashboard.whatsapp_clicks'), value: stats.whatsapp_clicks, icon: MessageCircle, color: 'text-emerald-500 bg-emerald-100' },
                    { label: locale === 'ar' ? 'حجوزات' : 'Bookings', value: stats.bookings_count, icon: CalendarCheck, color: 'text-purple-500 bg-purple-100' },
                    { label: locale === 'ar' ? 'استشارات' : 'Consultations', value: stats.consultations_count, icon: MessageSquare, color: 'text-orange-500 bg-orange-100' },
                    { label: locale === 'ar' ? 'طلبات مخفية' : 'Hidden Requests', value: stats.hidden_requests, icon: Shield, color: 'text-red-500 bg-red-100' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', item.color)}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                        </div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Hidden Requests Alert */}
                {doctorPackage?.name === 'Free' && stats.hidden_requests > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-amber-800 font-medium text-sm">
                        {locale === 'ar'
                          ? `لديك ${stats.hidden_requests} طلب تواصل مخفي هذا الشهر`
                          : `You have ${stats.hidden_requests} hidden contact requests this month`}
                      </p>
                      <p className="text-amber-600 text-sm mt-1">
                        {locale === 'ar'
                          ? 'قم بالترقية إلى الباقة المميزة لعرض هذه الطلبات'
                          : 'Upgrade to a premium package to view these requests'}
                      </p>
                      <button
                        onClick={() => setActiveSection('upgrade')}
                        className="mt-2 btn btn-sm btn-primary"
                      >
                        <TrendingUp className="w-4 h-4" />
                        {locale === 'ar' ? 'ترقية الآن' : 'Upgrade Now'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Package card */}
                <div className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">{t('doctor_dashboard.package')}</h3>
                    </div>
                    {doctorPackage && (
                      <span className={cn(
                        'badge',
                        doctorPackage.name === 'VIP' ? 'badge-vip' :
                        doctorPackage.name === 'Premium' ? 'badge-premium' : 'bg-gray-100 text-gray-600'
                      )}>
                        {locale === 'ar' ? doctorPackage.name_ar : doctorPackage.name}
                      </span>
                    )}
                  </div>
                  {doctorPackage && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">{locale === 'ar' ? 'التواصل الشهري' : 'Monthly Contacts'}</span>
                          <span className="text-gray-900 font-medium">{contactUsed} / {doctorPackage.monthly_contacts_limit === 999 ? '∞' : doctorPackage.monthly_contacts_limit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              contactUsed > doctorPackage.monthly_contacts_limit ? 'bg-error' : 'bg-primary'
                            )}
                            style={{ width: `${Math.min((contactUsed / doctorPackage.monthly_contacts_limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      {doctorPackage.name === 'Free' && (
                        <button onClick={() => setActiveSection('upgrade')} className="btn btn-primary btn-sm w-full">
                          <TrendingUp className="w-4 h-4" />
                          {locale === 'ar' ? 'ترقية إلى الباقة المميزة' : 'Upgrade to Premium'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Bookings */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{locale === 'ar' ? 'آخر الحجوزات' : 'Recent Bookings'}</h3>
                  </div>
                  {recentBookings.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">{t('common.no_results')}</p>
                  ) : (
                    <div className="space-y-3">
                      {recentBookings.map(b => (
                        <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{b.patient_name}</p>
                            <p className="text-xs text-gray-500">{b.date} • {b.time}</p>
                          </div>
                          <span className={cn('badge text-xs', statusColors[b.status] || 'bg-gray-100 text-gray-600')}>
                            {statusTranslations[b.status] || b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Consultations */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{locale === 'ar' ? 'آخر الاستشارات' : 'Recent Consultations'}</h3>
                  </div>
                  {recentConsultations.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">{t('common.no_results')}</p>
                  ) : (
                    <div className="space-y-3">
                      {recentConsultations.map(c => (
                        <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{c.patient_name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.message}</p>
                          </div>
                          <span className={cn('badge text-xs', statusColors[c.status] || 'bg-gray-100 text-gray-600')}>
                            {statusTranslations[c.status] || c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== MY PROFILE ==================== */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('doctor_dashboard.profile')}</h2>
                    <p className="text-gray-500 mt-1">{locale === 'ar' ? 'معلومات ملفك الشخصي' : 'Your profile information'}</p>
                  </div>
                  <button onClick={() => setShowProfileModal(true)} className="btn btn-primary btn-sm">
                    <Edit3 className="w-4 h-4" />
                    {t('common.edit')}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
                      {locale === 'ar' ? 'معلومات أساسية' : 'Basic Info'}
                    </h3>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'الاسم' : 'Name'}</p>
                      <p className="text-sm font-medium text-gray-900">{isRtl ? doctor.name_ar : doctor.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'الكشفية' : 'Fees'}</p>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(doctor.fees)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'سنوات الخبرة' : 'Experience'}</p>
                      <p className="text-sm font-medium text-gray-900">{doctor.years_experience} {locale === 'ar' ? 'سنوات' : 'years'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'الدرجة العلمية' : 'Degree'}</p>
                      <p className="text-sm font-medium text-gray-900">{doctor.degree || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'اللغات' : 'Languages'}</p>
                      <p className="text-sm font-medium text-gray-900">{doctor.languages || '-'}</p>
                    </div>
                  </div>

                  <div className="card space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
                      {locale === 'ar' ? 'معلومات إضافية' : 'Additional Info'}
                    </h3>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'ساعات العمل' : 'Working Hours'}</p>
                      <p className="text-sm font-medium text-gray-900">{doctor.working_hours || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{locale === 'ar' ? 'نبذة تعريفية (عربي)' : 'Bio (Arabic)'}</p>
                      <p className="text-sm text-gray-700">{doctor.bio_ar || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bio (English)</p>
                      <p className="text-sm text-gray-700">{doctor.bio || '-'}</p>
                    </div>
                  </div>

                  <div className="card space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
                      {locale === 'ar' ? 'الإعدادات' : 'Settings'}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{locale === 'ar' ? 'يقبل الحجوزات' : 'Accepts Booking'}</span>
                      <span className={doctor.accepts_booking ? 'text-success' : 'text-gray-400'}>
                        {doctor.accepts_booking ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{locale === 'ar' ? 'يقبل الاستشارات' : 'Accepts Consultation'}</span>
                      <span className={doctor.accepts_consultation ? 'text-success' : 'text-gray-400'}>
                        {doctor.accepts_consultation ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{locale === 'ar' ? 'يقبل المرضى الدوليين' : 'Accepts International'}</span>
                      <span className={doctor.accepts_international ? 'text-success' : 'text-gray-400'}>
                        {doctor.accepts_international ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== BOOKINGS ==================== */}
            {activeSection === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('doctor_dashboard.bookings')}</h2>
                  <p className="text-gray-500 mt-1">{locale === 'ar' ? 'إدارة الحجوزات' : 'Manage bookings'}</p>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2">
                  {bookingStatuses.map(s => (
                    <button
                      key={s}
                      onClick={() => setBookingFilter(s)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        bookingFilter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      {s === 'all' ? (locale === 'ar' ? 'الكل' : 'All') : statusTranslations[s] || s}
                    </button>
                  ))}
                </div>

                <div className="card overflow-x-auto p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'المريض' : 'Patient'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الوقت' : 'Time'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'ملاحظات' : 'Notes'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('common.no_results')}</td>
                        </tr>
                      ) : (
                        filteredBookings.map(b => (
                          <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-medium text-gray-900">{b.patient_name}</td>
                            <td className="px-4 py-3 text-gray-600">{b.date}</td>
                            <td className="px-4 py-3 text-gray-600">{b.time}</td>
                            <td className="px-4 py-3">
                              {b.status === 'new' ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleBookingStatus(b.id, 'confirmed')}
                                    className="badge bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                                  >
                                    {locale === 'ar' ? 'تأكيد' : 'Confirm'}
                                  </button>
                                  <button
                                    onClick={() => handleBookingStatus(b.id, 'rejected')}
                                    className="badge bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
                                  >
                                    {locale === 'ar' ? 'رفض' : 'Reject'}
                                  </button>
                                </div>
                              ) : (
                                <span className={cn('badge', statusColors[b.status] || 'bg-gray-100 text-gray-600')}>
                                  {statusTranslations[b.status] || b.status}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{b.notes || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== CONSULTATIONS ==================== */}
            {activeSection === 'consultations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('doctor_dashboard.consultations')}</h2>
                  <p className="text-gray-500 mt-1">{locale === 'ar' ? 'إدارة الاستشارات' : 'Manage consultations'}</p>
                </div>

                <div className="card overflow-x-auto p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'المريض' : 'Patient'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الرسالة' : 'Message'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                        <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'إجراء' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('common.no_results')}</td>
                        </tr>
                      ) : (
                        consultations.map(c => (
                          <>
                            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => setExpandedConsultId(expandedConsultId === c.id ? null : c.id)}>
                              <td className="px-4 py-3 font-medium text-gray-900">{c.patient_name}</td>
                              <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{c.message}</td>
                              <td className="px-4 py-3">
                                <span className={cn('badge', statusColors[c.status] || 'bg-gray-100 text-gray-600')}>
                                  {statusTranslations[c.status] || c.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                {c.status === 'new' && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setReplyConsultId(c.id); setReplyText(c.reply || ''); setShowReplyModal(true); }}
                                    className="btn btn-sm btn-outline"
                                  >
                                    <Reply className="w-3.5 h-3.5" />
                                    {locale === 'ar' ? 'رد' : 'Reply'}
                                  </button>
                                )}
                              </td>
                            </tr>
                            {expandedConsultId === c.id && (
                              <tr key={`${c.id}-expanded`}>
                                <td colSpan={5} className="px-4 py-3 bg-gray-50/50">
                                  <div className="p-3 bg-white rounded-lg border border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'الرسالة الكاملة:' : 'Full message:'}</p>
                                    <p className="text-sm text-gray-800 mb-3">{c.message}</p>
                                    {c.reply && (
                                      <>
                                        <p className="text-xs text-gray-500 mb-1">{locale === 'ar' ? 'الرد:' : 'Reply:'}</p>
                                        <p className="text-sm text-primary-dark bg-primary-light p-2 rounded-lg">{c.reply}</p>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== STATISTICS ==================== */}
            {activeSection === 'stats' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('doctor_dashboard.stats')}</h2>
                  <p className="text-gray-500 mt-1">{locale === 'ar' ? 'إحصائيات ملفك الشخصي' : 'Your profile statistics'}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: t('doctor_dashboard.profile_views'), value: stats.profile_views, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50', max: Math.max(stats.profile_views, 1) },
                    { label: t('doctor_dashboard.contact_clicks'), value: stats.contact_clicks, icon: Phone, color: 'text-green-500', bg: 'bg-green-50', max: Math.max(stats.contact_clicks, 1) },
                    { label: t('doctor_dashboard.whatsapp_clicks'), value: stats.whatsapp_clicks, icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', max: Math.max(stats.whatsapp_clicks, 1) },
                    { label: locale === 'ar' ? 'الحجوزات' : 'Bookings', value: stats.bookings_count, icon: CalendarCheck, color: 'text-purple-500', bg: 'bg-purple-50', max: Math.max(stats.bookings_count, 1) },
                    { label: locale === 'ar' ? 'الاستشارات' : 'Consultations', value: stats.consultations_count, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50', max: Math.max(stats.consultations_count, 1) },
                    { label: locale === 'ar' ? 'الطلبات المخفية' : 'Hidden Requests', value: stats.hidden_requests, icon: Shield, color: 'text-red-500', bg: 'bg-red-50', max: Math.max(stats.hidden_requests, 1) },
                  ].map(item => {
                    const Icon = item.icon;
                    const overallMax = Math.max(
                      stats.profile_views, stats.contact_clicks, stats.whatsapp_clicks,
                      stats.bookings_count, stats.consultations_count, stats.hidden_requests, 1
                    );
                    const barWidth = (item.value / overallMax) * 100;
                    return (
                      <div key={item.label} className="card">
                        <div className="flex items-center justify-between mb-3">
                          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', item.bg)}>
                            <Icon className={cn('w-5 h-5', item.color)} />
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all', item.color.replace('text-', 'bg-'))}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">{locale === 'ar' ? 'ملخص الأداء' : 'Performance Summary'}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">{locale === 'ar' ? 'إجمالي التفاعلات' : 'Total Interactions'}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {stats.profile_views + stats.contact_clicks + stats.whatsapp_clicks + stats.bookings_count + stats.consultations_count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">{locale === 'ar' ? 'نسبة التحويل للحجوزات' : 'Booking Conversion Rate'}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {stats.profile_views > 0 ? ((stats.bookings_count / stats.profile_views) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">{locale === 'ar' ? 'الطلبات المخفية' : 'Hidden Requests'}</span>
                      <span className="text-sm font-bold text-gray-900">{stats.hidden_requests}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== PACKAGE ==================== */}
            {activeSection === 'package' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('doctor_dashboard.package')}</h2>
                  <p className="text-gray-500 mt-1">{locale === 'ar' ? 'تفاصيل باقتك الحالية' : 'Your current package details'}</p>
                </div>

                <div className="card">
                  {doctorPackage ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            doctorPackage.name === 'VIP' ? 'bg-vip/10' :
                            doctorPackage.name === 'Premium' ? 'bg-amber-50' : 'bg-gray-100'
                          )}>
                            <Award className={cn(
                              'w-6 h-6',
                              doctorPackage.name === 'VIP' ? 'text-vip' :
                              doctorPackage.name === 'Premium' ? 'text-amber-500' : 'text-gray-500'
                            )} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {locale === 'ar' ? doctorPackage.name_ar : doctorPackage.name}
                            </h3>
                            <p className="text-sm text-gray-500">{t('package.current')}</p>
                          </div>
                        </div>
                        <span className={cn(
                          'text-2xl font-bold',
                          doctorPackage.price === 0 ? 'text-gray-400' : 'text-primary'
                        )}>
                          {doctorPackage.price === 0
                            ? (locale === 'ar' ? 'مجاني' : 'Free')
                            : formatCurrency(doctorPackage.price, doctorPackage.currency)}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">{t('package.monthly_contacts')}</span>
                          <span className="font-medium text-gray-900">
                            {contactUsed} / {doctorPackage.monthly_contacts_limit === 999 ? (locale === 'ar' ? 'غير محدود' : 'Unlimited') : doctorPackage.monthly_contacts_limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          {doctorPackage.monthly_contacts_limit < 999 && (
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                contactUsed > doctorPackage.monthly_contacts_limit ? 'bg-error' : 'bg-primary'
                              )}
                              style={{ width: `${Math.min((contactUsed / doctorPackage.monthly_contacts_limit) * 100, 100)}%` }}
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('package.features')}</h4>
                        <ul className="space-y-2">
                          {doctorPackage.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {doctorPackage.name === 'Free' && (
                        <button onClick={() => setActiveSection('upgrade')} className="btn btn-primary w-full">
                          <TrendingUp className="w-5 h-5" />
                          {locale === 'ar' ? 'ترقية الباقة' : 'Upgrade Package'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">{locale === 'ar' ? 'لا توجد باقة محددة' : 'No package assigned'}</p>
                  )}
                </div>
              </div>
            )}

            {/* ==================== UPGRADE ==================== */}
            {activeSection === 'upgrade' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('doctor_dashboard.upgrade')}</h2>
                  <p className="text-gray-500 mt-1">{locale === 'ar' ? 'اختر باقة مناسبة لك' : 'Choose a suitable package'}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map(pkg => {
                    const isCurrent = doctorPackage?.id === pkg.id;
                    const isHigher = !doctorPackage || packages.indexOf(pkg) > packages.indexOf(doctorPackage);
                    return (
                      <div key={pkg.id} className={cn(
                        'card relative border-2 transition-all',
                        isCurrent ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/50'
                      )}>
                        {isCurrent && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-0.5 rounded-full text-xs font-bold">
                            {locale === 'ar' ? 'الحالية' : 'Current'}
                          </div>
                        )}
                        <div className="text-center mb-4">
                          <div className={cn(
                            'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3',
                            pkg.name === 'VIP' ? 'bg-vip/10' :
                            pkg.name === 'Premium' ? 'bg-amber-50' : 'bg-gray-100'
                          )}>
                            <Award className={cn(
                              'w-7 h-7',
                              pkg.name === 'VIP' ? 'text-vip' :
                              pkg.name === 'Premium' ? 'text-amber-500' : 'text-gray-400'
                            )} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{locale === 'ar' ? pkg.name_ar : pkg.name}</h3>
                          <p className="text-2xl font-bold text-primary mt-2">
                            {pkg.price === 0
                              ? (locale === 'ar' ? 'مجاني' : 'Free')
                              : formatCurrency(pkg.price, pkg.currency)}
                            <span className="text-sm font-normal text-gray-500">{pkg.price > 0 && t('package.per_month')}</span>
                          </p>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        {!isCurrent && isHigher && (
                          <button
                            onClick={() => { setUpgradeForm({ ...upgradeForm, package_id: pkg.id }); setShowUpgradeModal(true); }}
                            className="btn btn-primary w-full"
                          >
                            <ArrowUpCircle className="w-4 h-4" />
                            {locale === 'ar' ? 'طلب ترقية' : 'Request Upgrade'}
                          </button>
                        )}
                        {isCurrent && (
                          <button disabled className="btn w-full bg-gray-100 text-gray-400 cursor-not-allowed">
                            <CheckCircle2 className="w-4 h-4" />
                            {locale === 'ar' ? 'الباقة الحالية' : 'Current Package'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ==================== EDIT PROFILE MODAL ==================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{locale === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'الكشفية' : 'Fees'} (JOD)</label>
                <input type="number" value={profileForm.fees} onChange={e => setProfileForm({ ...profileForm, fees: Number(e.target.value) })} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio (English)</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} className="input" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'نبذة تعريفية (عربي)' : 'Bio (Arabic)'}</label>
                <textarea value={profileForm.bio_ar} onChange={e => setProfileForm({ ...profileForm, bio_ar: e.target.value })} className="input" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'ساعات العمل' : 'Working Hours'}</label>
                <input value={profileForm.working_hours} onChange={e => setProfileForm({ ...profileForm, working_hours: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'اللغات' : 'Languages'}</label>
                <input value={profileForm.languages} onChange={e => setProfileForm({ ...profileForm, languages: e.target.value })} className="input" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={profileForm.accepts_booking} onChange={e => setProfileForm({ ...profileForm, accepts_booking: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm text-gray-700">{locale === 'ar' ? 'يقبل الحجوزات' : 'Accepts Booking'}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={profileForm.accepts_consultation} onChange={e => setProfileForm({ ...profileForm, accepts_consultation: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm text-gray-700">{locale === 'ar' ? 'يقبل الاستشارات' : 'Accepts Consultation'}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={profileForm.accepts_international} onChange={e => setProfileForm({ ...profileForm, accepts_international: e.target.checked })} className="w-4 h-4 text-primary rounded" />
                  <span className="text-sm text-gray-700">{locale === 'ar' ? 'يقبل المرضى الدوليين' : 'Accepts International'}</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowProfileModal(false)} className="btn btn-ghost">{t('common.cancel')}</button>
              <button onClick={handleEditProfile} disabled={saving} className="btn btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== REPLY MODAL ==================== */}
      {showReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowReplyModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{locale === 'ar' ? 'الرد على الاستشارة' : 'Reply to Consultation'}</h3>
              <button onClick={() => setShowReplyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'الرد' : 'Reply'}</label>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} className="input" rows={5} placeholder={locale === 'ar' ? 'اكتب ردك هنا...' : 'Write your reply here...'} />
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowReplyModal(false)} className="btn btn-ghost">{t('common.cancel')}</button>
              <button onClick={handleReplyConsultation} disabled={!replyText.trim()} className="btn btn-primary">
                <SendIcon className="w-4 h-4" />
                {locale === 'ar' ? 'إرسال الرد' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== UPGRADE MODAL ==================== */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{locale === 'ar' ? 'طلب ترقية الباقة' : 'Package Upgrade Request'}</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'الباقة المطلوبة' : 'Requested Package'}</label>
                <select value={upgradeForm.package_id} onChange={e => setUpgradeForm({ ...upgradeForm, package_id: e.target.value })} className="input">
                  <option value="">{locale === 'ar' ? 'اختر باقة...' : 'Select package...'}</option>
                  {packages.filter(p => !doctorPackage || packages.indexOf(p) > packages.indexOf(doctorPackage)).map(p => (
                    <option key={p.id} value={p.id}>
                      {locale === 'ar' ? p.name_ar : p.name} - {p.price === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : formatCurrency(p.price, p.currency)}{p.price > 0 ? t('package.per_month') : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{locale === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</label>
                <select value={upgradeForm.payment_method} onChange={e => setUpgradeForm({ ...upgradeForm, payment_method: e.target.value })} className="input">
                  <option value="">{locale === 'ar' ? 'اختر طريقة الدفع...' : 'Select payment method...'}</option>
                  <option value="cash">{locale === 'ar' ? 'نقدًا' : 'Cash'}</option>
                  <option value="cliq">CliQ</option>
                  <option value="bank_transfer">{locale === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</option>
                  <option value="wallet">{locale === 'ar' ? 'محفظة إلكترونية' : 'Wallet'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('international.notes')}</label>
                <textarea value={upgradeForm.notes} onChange={e => setUpgradeForm({ ...upgradeForm, notes: e.target.value })} className="input" rows={3} />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowUpgradeModal(false)} className="btn btn-ghost">{t('common.cancel')}</button>
              <button onClick={handleUpgradeRequest} disabled={!upgradeForm.package_id || !upgradeForm.payment_method} className="btn btn-primary">
                <SendIcon className="w-4 h-4" />
                {locale === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}
