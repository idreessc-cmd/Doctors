'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import {
  BarChart3, Stethoscope, Building2, Tags, MapPin, Box, Calendar,
  MessageSquare, Globe, Menu, X, ChevronDown, Plus, Edit2,
  Trash2, Check, AlertTriangle, Star, Search, Filter, Mail, Phone,
  User, Shield, ToggleLeft, ToggleRight, Save, ExternalLink,
  Loader2, Reply, ChevronUp, MessageCircle
} from 'lucide-react';
import {
  initializeStore, getAll, add, update, remove,
  getCurrentUser, hasRole
} from '@/lib/store';
import {
  cn, getRankLabel, getRankColor, getBookingStatusLabel,
  getConsultationStatusLabel, getInternationalStatusLabel,
  generateId
} from '@/lib/utils';
import type {
  Doctor, Hospital, Specialty, City, Package,
  Booking, Consultation, InternationalRequest
} from '@/types';

// ─── Modal ──────────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Confirm Dialog ─────────────────────────────────────────────────────────

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string
}) {
  const locale = useLocale();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 z-10 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn btn-ghost btn-sm">{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-sm bg-red-600 text-white hover:bg-red-700">
            {locale === 'ar' ? 'تأكيد' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

const sections = [
  { key: 'dashboard', icon: BarChart3 },
  { key: 'doctors', icon: Stethoscope },
  { key: 'hospitals', icon: Building2 },
  { key: 'specialties', icon: Tags },
  { key: 'cities', icon: MapPin },
  { key: 'packages', icon: Box },
  { key: 'bookings', icon: Calendar },
  { key: 'consultations', icon: MessageSquare },
  { key: 'international_requests', icon: Globe },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const t_common = (key: string) => t(`common.${key}`);
  const t_admin = (key: string) => t(`admin.${key}`);

  // Auth
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [intlRequests, setIntlRequests] = useState<InternationalRequest[]>([]);

  // UI
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedIntl, setExpandedIntl] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState('');

  // Modals
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [editHospital, setEditHospital] = useState<Hospital | null>(null);
  const [replyConsult, setReplyConsult] = useState<Consultation | null>(null);
  const [replyText, setReplyText] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    initializeStore();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsAdmin(hasRole('admin'));
    loadData();
    setAuthLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadData() {
    setDoctors(getAll<Doctor>('doctors'));
    setHospitals(getAll<Hospital>('hospitals'));
    setSpecialties(getAll<Specialty>('specialties'));
    setCities(getAll<City>('cities'));
    setPackages(getAll<Package>('packages'));
    setBookings(getAll<Booking>('bookings'));
    setConsultations(getAll<Consultation>('consultations'));
    setIntlRequests(getAll<InternationalRequest>('international_requests'));
  }

  function refreshData() {
    loadData();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function getDoctorName(id?: string) {
    if (!id) return '-';
    const doc = doctors.find(d => d.id === id);
    return doc ? (locale === 'ar' ? doc.name_ar : doc.name) : id;
  }

  function getHospitalName(id?: string) {
    if (!id) return '-';
    const h = hospitals.find(hosp => hosp.id === id);
    return h ? (locale === 'ar' ? h.name_ar : h.name) : id;
  }

  function getSpecialtyName(id?: string) {
    if (!id) return '-';
    const s = specialties.find(sp => sp.id === id);
    return s ? (locale === 'ar' ? s.name_ar : s.name) : id;
  }

  function getCityName(id?: string) {
    if (!id) return '-';
    const c = cities.find(ct => ct.id === id);
    return c ? (locale === 'ar' ? c.name_ar : c.name) : id;
  }

  function statusBadge(status: string, type: 'booking' | 'consult' | 'intl' | 'active' | 'rank') {
    const colorMap: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
      answered: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
      under_review: 'bg-amber-100 text-amber-700',
      contacted: 'bg-purple-100 text-purple-700',
      sent_to_doctor: 'bg-indigo-100 text-indigo-700',
      sent_to_hospital: 'bg-indigo-100 text-indigo-700',
      waiting_reply: 'bg-amber-100 text-amber-700',
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-red-100 text-red-700',
      verified: 'bg-blue-100 text-blue-700',
    };
    const labelMap: Record<string, string> = {
      new: locale === 'ar' ? 'جديد' : 'New',
      confirmed: locale === 'ar' ? 'مؤكد' : 'Confirmed',
      rejected: locale === 'ar' ? 'مرفوض' : 'Rejected',
      completed: locale === 'ar' ? 'مكتمل' : 'Completed',
      cancelled: locale === 'ar' ? 'ملغي' : 'Cancelled',
      answered: locale === 'ar' ? 'تمت الإجابة' : 'Answered',
      closed: locale === 'ar' ? 'مغلق' : 'Closed',
      under_review: locale === 'ar' ? 'قيد المراجعة' : 'Under Review',
      contacted: locale === 'ar' ? 'تم التواصل' : 'Contacted',
      sent_to_doctor: locale === 'ar' ? 'أُرسل لطبيب' : 'Sent to Doctor',
      sent_to_hospital: locale === 'ar' ? 'أُرسل لمستشفى' : 'Sent to Hospital',
      waiting_reply: locale === 'ar' ? 'بانتظار الرد' : 'Waiting Reply',
      true: locale === 'ar' ? 'نشط' : 'Active',
      false: locale === 'ar' ? 'غير نشط' : 'Inactive',
    };
    const color = colorMap[status] || 'bg-gray-100 text-gray-700';
    const label = labelMap[status] || status;
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  }

  function getBookingStatusColor(s: string) {
    const m: Record<string, string> = { new: 'bg-blue-100 text-blue-700', confirmed: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', completed: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700' };
    return m[s] || 'bg-gray-100 text-gray-700';
  }

  function getConsultStatusColor(s: string) {
    const m: Record<string, string> = { new: 'bg-blue-100 text-blue-700', answered: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700' };
    return m[s] || 'bg-gray-100 text-gray-700';
  }

  function getIntlStatusColor(s: string) {
    const m: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700', under_review: 'bg-amber-100 text-amber-700',
      contacted: 'bg-purple-100 text-purple-700', sent_to_doctor: 'bg-indigo-100 text-indigo-700',
      sent_to_hospital: 'bg-indigo-100 text-indigo-700', waiting_reply: 'bg-amber-100 text-amber-700',
      completed: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700'
    };
    return m[s] || 'bg-gray-100 text-gray-700';
  }

  function confirmAction(title: string, message: string, onConfirm: () => void) {
    setConfirmDialog({ title, message, onConfirm });
  }

  // ─── Auth Guard ───────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card max-w-md w-full text-center py-12">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'ar' ? 'رفض الوصول' : 'Access Denied'}
          </h1>
          <p className="text-gray-500 mb-6">
            {locale === 'ar' ? 'ليس لديك صلاحية الوصول إلى لوحة الإدارة.' : 'You do not have permission to access the admin panel.'}
          </p>
          <Link href={user ? '/' : '/login'} className="btn btn-primary">
            {user ? (locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home') : (locale === 'ar' ? 'تسجيل الدخول' : 'Login')}
          </Link>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 z-50 w-64 bg-white border-gray-200 shadow-sm transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto flex flex-col',
        isRtl ? 'right-0 border-l' : 'left-0 border-r',
        sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')
      )}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">{t('site.name')}</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {sections.map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.key}
                onClick={() => { setActiveSection(sec.key); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors',
                  activeSection === sec.key
                    ? 'text-primary bg-primary-light border-r-2 border-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{t_admin(sec.key)}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span className="truncate">{user?.name || user?.email}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'flex-1 min-w-0 flex flex-col',
        isRtl ? 'lg:mr-64' : 'lg:ml-64'
      )}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate">{t_admin('title')}</h1>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn btn-ghost btn-sm text-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              {locale === 'ar' ? 'الموقع' : 'Site'}
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'doctors' && <DoctorsSection />}
          {activeSection === 'hospitals' && <HospitalsSection />}
          {activeSection === 'specialties' && <SpecialtiesSection />}
          {activeSection === 'cities' && <CitiesSection />}
          {activeSection === 'packages' && <PackagesSection />}
          {activeSection === 'bookings' && <BookingsSection />}
          {activeSection === 'consultations' && <ConsultationsSection />}
          {activeSection === 'international_requests' && <InternationalSection />}
        </div>
      </div>

      {/* ─── Modals ─────────────────────────────────────────────────────── */}

      <Modal isOpen={showAddDoctor} onClose={() => setShowAddDoctor(false)} title={t_admin('add_doctor')}>
        <DoctorForm onSave={(data) => {
          const newDoc: Doctor = { ...data, id: generateId(), user_id: `user-${generateId()}`, ranking_score: 0, created_at: new Date().toISOString() };
          add('doctors', newDoc);
          add('users', { id: newDoc.user_id, email: data.email, password: data.password, name: data.name, role: 'doctor', phone: '', is_active: true, created_at: new Date().toISOString() });
          refreshData();
          setShowAddDoctor(false);
        }} specialties={specialties} cities={cities} onCancel={() => setShowAddDoctor(false)} includeAuth includeRank />
      </Modal>

      <Modal isOpen={!!editDoctor} onClose={() => setEditDoctor(null)} title={t_admin('edit_doctor')}>
        {editDoctor && (
          <DoctorForm
            initial={editDoctor}
            onSave={(data) => {
              update('doctors', editDoctor.id, data);
              refreshData();
              setEditDoctor(null);
            }}
            specialties={specialties}
            cities={cities}
            onCancel={() => setEditDoctor(null)}
            includeRank
          />
        )}
      </Modal>

      <Modal isOpen={showAddHospital} onClose={() => setShowAddHospital(false)} title={t_admin('add_hospital')}>
        <HospitalForm onSave={(data) => {
          const newHosp: Hospital = { ...data, id: generateId(), user_id: `user-${generateId()}`, ranking_score: 0, created_at: new Date().toISOString() };
          add('hospitals', newHosp);
          add('users', { id: newHosp.user_id, email: data.email, password: data.password, name: data.name, role: 'hospital', phone: '', is_active: true, created_at: new Date().toISOString() });
          refreshData();
          setShowAddHospital(false);
        }} cities={cities} onCancel={() => setShowAddHospital(false)} includeAuth includeRank />
      </Modal>

      <Modal isOpen={!!editHospital} onClose={() => setEditHospital(null)} title={t_admin('edit_hospital')}>
        {editHospital && (
          <HospitalForm
            initial={editHospital}
            onSave={(data) => {
              update('hospitals', editHospital.id, data);
              refreshData();
              setEditHospital(null);
            }}
            cities={cities}
            onCancel={() => setEditHospital(null)}
            includeRank
          />
        )}
      </Modal>

      <Modal isOpen={!!replyConsult} onClose={() => { setReplyConsult(null); setReplyText(''); }} title={locale === 'ar' ? 'رد على الاستشارة' : 'Reply to Consultation'}>
        {replyConsult && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-semibold text-gray-900 mb-1">{replyConsult.patient_name}</p>
              <p className="text-gray-600">{replyConsult.message}</p>
            </div>
            {replyConsult.reply && (
              <div className="bg-green-50 rounded-lg p-4 text-sm">
                <p className="font-semibold text-gray-900 mb-1">{locale === 'ar' ? 'الرد السابق' : 'Previous Reply'}</p>
                <p className="text-gray-600">{replyConsult.reply}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'ar' ? 'نص الرد' : 'Reply Text'}
              </label>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="input min-h-[120px] resize-y"
                dir="auto"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setReplyConsult(null); setReplyText(''); }} className="btn btn-ghost btn-sm">{t_common('cancel')}</button>
              <button
                onClick={() => {
                  if (!replyText.trim()) return;
                  (update as any)('consultations', replyConsult.id, { reply: replyText, status: 'answered' });
                  refreshData();
                  setReplyConsult(null);
                  setReplyText('');
                }}
                className="btn btn-primary btn-sm"
                disabled={!replyText.trim()}
              >
                <Reply className="w-4 h-4" />
                {locale === 'ar' ? 'إرسال الرد' : 'Send Reply'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        title={confirmDialog?.title || ''}
        message={confirmDialog?.message || ''}
        onConfirm={() => confirmDialog?.onConfirm()}
      />
    </div>
  );

  // ─── Dashboard Section ────────────────────────────────────────────────────

  function DashboardSection() {
    const totalDoctors = doctors.length;
    const totalHospitals = hospitals.length;
    const totalBookings = bookings.length;
    const totalConsultations = consultations.length;
    const pendingIntl = intlRequests.filter(r => r.status === 'new' || r.status === 'under_review').length;
    const activeDoctors = doctors.filter(d => d.is_active).length;
    const activeHospitals = hospitals.filter(h => h.is_active).length;

    const stats = [
      { label: locale === 'ar' ? 'إجمالي الأطباء' : 'Total Doctors', value: totalDoctors, sub: `${activeDoctors} ${locale === 'ar' ? 'نشط' : 'active'}`, icon: Stethoscope, color: 'text-blue-600 bg-blue-50' },
      { label: locale === 'ar' ? 'إجمالي المستشفيات' : 'Total Hospitals', value: totalHospitals, sub: `${activeHospitals} ${locale === 'ar' ? 'نشط' : 'active'}`, icon: Building2, color: 'text-green-600 bg-green-50' },
      { label: locale === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings', value: totalBookings, icon: Calendar, color: 'text-purple-600 bg-purple-50' },
      { label: locale === 'ar' ? 'إجمالي الاستشارات' : 'Total Consultations', value: totalConsultations, icon: MessageSquare, color: 'text-amber-600 bg-amber-50' },
      { label: locale === 'ar' ? 'طلبات دولية معلقة' : 'Pending Intl. Requests', value: pendingIntl, icon: Globe, color: 'text-rose-600 bg-rose-50' },
    ];

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t_admin('dashboard')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`p-2.5 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                {stat.sub && <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {locale === 'ar' ? 'أحدث الحجوزات' : 'Recent Bookings'}
            </h3>
            {bookings.slice(0, 5).length === 0 ? (
              <p className="text-sm text-gray-400">{t_common('no_results')}</p>
            ) : (
              <div className="space-y-2">
                {bookings.slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="font-medium text-gray-900">{b.patient_name}</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="text-gray-500">{getDoctorName(b.doctor_id)}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBookingStatusColor(b.status)}`}>
                      {getBookingStatusLabel(b.status, locale)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {locale === 'ar' ? 'أحدث الطلبات الدولية' : 'Recent Intl. Requests'}
            </h3>
            {intlRequests.slice(0, 5).length === 0 ? (
              <p className="text-sm text-gray-400">{t_common('no_results')}</p>
            ) : (
              <div className="space-y-2">
                {intlRequests.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="font-medium text-gray-900">{r.patient_name}</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="text-gray-500">{r.country}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getIntlStatusColor(r.status)}`}>
                      {getInternationalStatusLabel(r.status, locale)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Doctors Section ──────────────────────────────────────────────────────

  function DoctorsSection() {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = searchTerm
      ? doctors.filter(d =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.name_ar.includes(searchTerm) ||
          getSpecialtyName(d.specialty_id).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : doctors;

    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t_admin('doctors')} ({doctors.length})</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={locale === 'ar' ? 'بحث...' : 'Search...'}
                className="input pl-9 py-2 text-sm w-48"
              />
            </div>
            <button onClick={() => setShowAddDoctor(true)} className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              {t_admin('add_doctor')}
            </button>
          </div>
        </div>

        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'التخصص' : 'Specialty'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'المدينة' : 'City'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الرتبة' : 'Rank'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الباقة' : 'Package'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'موثق' : 'Verified'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'نشط' : 'Active'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">{t_common('no_results')}</td></tr>
              )}
              {filtered.map((doc, i) => (
                <tr key={doc.id} className={cn('border-b border-gray-100', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                  <td className="px-4 py-3 font-medium text-gray-900">{locale === 'ar' ? doc.name_ar : doc.name}</td>
                  <td className="px-4 py-3 text-gray-600">{getSpecialtyName(doc.specialty_id)}</td>
                  <td className="px-4 py-3 text-gray-600">{getCityName(doc.city_id)}</td>
                  <td className="px-4 py-3"><span className={`badge ${getRankColor(doc.rank)}`}><Star className="w-3 h-3" />{getRankLabel(doc.rank, locale)}</span></td>
                  <td className="px-4 py-3 text-gray-600">{doc.package_id ? packages.find(p => p.id === doc.package_id)?.name || doc.package_id : '-'}</td>
                  <td className="px-4 py-3 text-center">{doc.verified ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{statusBadge(doc.is_active ? 'true' : 'false', 'active')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setEditDoctor(doc)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title={t_common('edit')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newActive = !doc.is_active;
                          confirmAction(
                            newActive ? (locale === 'ar' ? 'تفعيل الطبيب' : 'Activate Doctor') : (locale === 'ar' ? 'تعطيل الطبيب' : 'Deactivate Doctor'),
                            newActive
                              ? (locale === 'ar' ? `هل تريد تفعيل ${doc.name_ar}؟` : `Activate ${doc.name}?`)
                              : (locale === 'ar' ? `هل تريد تعطيل ${doc.name_ar}؟` : `Deactivate ${doc.name}?`),
                            () => { update('doctors', doc.id, { is_active: newActive }); refreshData(); }
                          );
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                        title={t_admin('toggle_active')}
                      >
                        {doc.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <select
                        value={doc.rank}
                        onChange={e => { update('doctors', doc.id, { rank: e.target.value as any }); refreshData(); }}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                        title={t_admin('change_rank')}
                      >
                        <option value="normal">{locale === 'ar' ? 'عادي' : 'Normal'}</option>
                        <option value="verified">{locale === 'ar' ? 'موثق' : 'Verified'}</option>
                        <option value="premium">{locale === 'ar' ? 'مميز' : 'Premium'}</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Hospitals Section ────────────────────────────────────────────────────

  function HospitalsSection() {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = searchTerm
      ? hospitals.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.name_ar.includes(searchTerm))
      : hospitals;

    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t_admin('hospitals')} ({hospitals.length})</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={locale === 'ar' ? 'بحث...' : 'Search...'}
                className="input pl-9 py-2 text-sm w-48"
              />
            </div>
            <button onClick={() => setShowAddHospital(true)} className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              {t_admin('add_hospital')}
            </button>
          </div>
        </div>

        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الاسم' : 'Name'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'المدينة' : 'City'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الرتبة' : 'Rank'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'موثق' : 'Verified'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'نشط' : 'Active'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">{t_common('no_results')}</td></tr>
              )}
              {filtered.map((h, i) => (
                <tr key={h.id} className={cn('border-b border-gray-100', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                  <td className="px-4 py-3 font-medium text-gray-900">{locale === 'ar' ? h.name_ar : h.name}</td>
                  <td className="px-4 py-3 text-gray-600">{getCityName(h.city_id)}</td>
                  <td className="px-4 py-3"><span className={`badge ${getRankColor(h.rank)}`}><Star className="w-3 h-3" />{getRankLabel(h.rank, locale)}</span></td>
                  <td className="px-4 py-3 text-center">{h.verified ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{statusBadge(h.is_active ? 'true' : 'false', 'active')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setEditHospital(h)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title={t_common('edit')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newActive = !h.is_active;
                          confirmAction(
                            newActive ? (locale === 'ar' ? 'تفعيل المستشفى' : 'Activate Hospital') : (locale === 'ar' ? 'تعطيل المستشفى' : 'Deactivate Hospital'),
                            newActive ? (locale === 'ar' ? `هل تريد تفعيل ${h.name_ar}؟` : `Activate ${h.name}?`) : (locale === 'ar' ? `هل تريد تعطيل ${h.name_ar}؟` : `Deactivate ${h.name}?`),
                            () => { update('hospitals', h.id, { is_active: newActive }); refreshData(); }
                          );
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                        title={t_admin('toggle_active')}
                      >
                        {h.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <select
                        value={h.rank}
                        onChange={e => { update('hospitals', h.id, { rank: e.target.value as any }); refreshData(); }}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                        title={t_admin('change_rank')}
                      >
                        <option value="normal">{locale === 'ar' ? 'عادي' : 'Normal'}</option>
                        <option value="verified">{locale === 'ar' ? 'موثق' : 'Verified'}</option>
                        <option value="premium">{locale === 'ar' ? 'مميز' : 'Premium'}</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Specialties Section ──────────────────────────────────────────────────

  function SpecialtiesSection() {
    const [name, setName] = useState('');
    const [nameAr, setNameAr] = useState('');

    function handleAdd() {
      if (!name.trim() || !nameAr.trim()) return;
      add('specialties', {
        id: generateId(), name: name.trim(), name_ar: nameAr.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-'), icon: 'default', is_active: true
      });
      refreshData();
      setName('');
      setNameAr('');
    }

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t_admin('specialties')} ({specialties.length})</h2>

        <div className="card mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {locale === 'ar' ? 'إضافة تخصص جديد' : 'Add New Specialty'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input py-2 text-sm" placeholder="Cardiology" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input value={nameAr} onChange={e => setNameAr(e.target.value)} className="input py-2 text-sm" placeholder="قلب وأوعية دموية" />
            </div>
            <div className="flex items-end">
              <button onClick={handleAdd} disabled={!name.trim() || !nameAr.trim()} className="btn btn-primary btn-sm w-full">
                <Plus className="w-4 h-4" />
                {locale === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specialties.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full">{t_common('no_results')}</p>
          )}
          {specialties.map(spec => (
            <div key={spec.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{spec.name}</p>
                <p className="text-sm text-gray-500">{spec.name_ar}</p>
              </div>
              <button
                onClick={() => confirmAction(
                  locale === 'ar' ? 'حذف التخصص' : 'Delete Specialty',
                  locale === 'ar' ? `هل تريد حذف ${spec.name_ar}؟` : `Delete ${spec.name}?`,
                  () => { remove('specialties', spec.id); refreshData(); }
                )}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Cities Section ───────────────────────────────────────────────────────

  function CitiesSection() {
    const [name, setName] = useState('');
    const [nameAr, setNameAr] = useState('');

    function handleAdd() {
      if (!name.trim() || !nameAr.trim()) return;
      add('cities', {
        id: generateId(), name: name.trim(), name_ar: nameAr.trim(),
        slug: name.trim().toLowerCase().replace(/\s+/g, '-')
      });
      refreshData();
      setName('');
      setNameAr('');
    }

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t_admin('cities')} ({cities.length})</h2>

        <div className="card mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {locale === 'ar' ? 'إضافة مدينة جديدة' : 'Add New City'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input py-2 text-sm" placeholder="Amman" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label>
              <input value={nameAr} onChange={e => setNameAr(e.target.value)} className="input py-2 text-sm" placeholder="عمان" />
            </div>
            <div className="flex items-end">
              <button onClick={handleAdd} disabled={!name.trim() || !nameAr.trim()} className="btn btn-primary btn-sm w-full">
                <Plus className="w-4 h-4" />
                {locale === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cities.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full">{t_common('no_results')}</p>
          )}
          {cities.map(city => (
            <div key={city.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{city.name}</p>
                <p className="text-sm text-gray-500">{city.name_ar}</p>
              </div>
              <button
                onClick={() => confirmAction(
                  locale === 'ar' ? 'حذف المدينة' : 'Delete City',
                  locale === 'ar' ? `هل تريد حذف ${city.name_ar}؟` : `Delete ${city.name}?`,
                  () => { remove('cities', city.id); refreshData(); }
                )}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Packages Section ─────────────────────────────────────────────────────

  function PackagesSection() {
    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t_admin('packages')} ({packages.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full">{t_common('no_results')}</p>
          )}
          {packages.map(pkg => (
            <div key={pkg.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{locale === 'ar' ? pkg.name_ar : pkg.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{pkg.type === 'doctor' ? (locale === 'ar' ? 'طبيب' : 'Doctor') : (locale === 'ar' ? 'مستشفى' : 'Hospital')}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold text-primary">{pkg.price === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : `${pkg.price} ${pkg.currency}`}</span>
                {pkg.price > 0 && <span className="text-sm text-gray-400">/{locale === 'ar' ? 'شهر' : 'month'}</span>}
              </div>
              <ul className="space-y-1 mb-4">
                {pkg.features.map((f, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-green-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {locale === 'ar' ? `حد التواصل: ${pkg.monthly_contacts_limit === 999 ? 'غير محدود' : pkg.monthly_contacts_limit}` : `Contact limit: ${pkg.monthly_contacts_limit === 999 ? 'Unlimited' : pkg.monthly_contacts_limit}`}
                </span>
                <button
                  onClick={() => {
                    update('packages', pkg.id, { is_active: !pkg.is_active });
                    refreshData();
                  }}
                  className={cn(
                    'btn btn-sm text-xs px-3',
                    pkg.is_active ? 'btn-ghost text-green-600' : 'btn-ghost text-red-500'
                  )}
                >
                  {pkg.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {pkg.is_active ? (locale === 'ar' ? 'نشط' : 'Active') : (locale === 'ar' ? 'غير نشط' : 'Inactive')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Bookings Section ─────────────────────────────────────────────────────

  function BookingsSection() {
    const bookingStatuses: Booking['status'][] = ['new', 'confirmed', 'rejected', 'completed', 'cancelled'];
    const filtered = bookingFilter
      ? bookings.filter(b => b.status === bookingFilter)
      : bookings;

    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t_admin('bookings')} ({bookings.length})</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={bookingFilter}
              onChange={e => setBookingFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600"
            >
              <option value="">{locale === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              {bookingStatuses.map(s => (
                <option key={s} value={s}>{getBookingStatusLabel(s, locale)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'المريض' : 'Patient'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الطبيب/المستشفى' : 'Doctor/Hospital'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الوقت' : 'Time'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t_common('no_results')}</td></tr>
              )}
              {filtered.map((b, i) => (
                <tr key={b.id} className={cn('border-b border-gray-100', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{b.patient_name}</div>
                    <div className="text-xs text-gray-400">{b.patient_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.doctor_id ? getDoctorName(b.doctor_id) : b.hospital_id ? getHospitalName(b.hospital_id) : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.date}</td>
                  <td className="px-4 py-3 text-gray-600">{b.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <select
                        value={b.status}
                        onChange={e => { update('bookings', b.id, { status: e.target.value as Booking['status'] }); refreshData(); }}
                        className={cn('text-xs border-0 rounded-lg px-2 py-1 font-medium', getBookingStatusColor(b.status))}
                      >
                        {bookingStatuses.map(s => (
                          <option key={s} value={s}>{getBookingStatusLabel(s, locale)}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── Consultations Section ────────────────────────────────────────────────

  function ConsultationsSection() {
    const consultStatuses: Consultation['status'][] = ['new', 'answered', 'closed'];

    function getConsultStatusColorLocal(s: string) {
      const m: Record<string, string> = { new: 'bg-blue-100 text-blue-700', answered: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700' };
      return m[s] || 'bg-gray-100 text-gray-700';
    }

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t_admin('consultations')} ({consultations.length})</h2>
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'المريض' : 'Patient'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الطبيب' : 'Doctor'}</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الرسالة' : 'Message'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {consultations.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t_common('no_results')}</td></tr>
              )}
              {consultations.map((c, i) => (
                <tr key={c.id} className={cn('border-b border-gray-100', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{c.patient_name}</div>
                    <div className="text-xs text-gray-400">{c.patient_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getDoctorName(c.doctor_id)}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-600 truncate max-w-[200px]">{c.message}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <select
                        value={c.status}
                        onChange={e => { update('consultations', c.id, { status: e.target.value as Consultation['status'] }); refreshData(); }}
                        className={cn('text-xs border-0 rounded-lg px-2 py-1 font-medium', getConsultStatusColorLocal(c.status))}
                      >
                        {consultStatuses.map(s => (
                          <option key={s} value={s}>{getConsultationStatusLabel(s, locale)}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => { setReplyConsult(c); setReplyText(''); }}
                        className="p-1.5 rounded-lg hover:bg-primary-light text-primary"
                        title={locale === 'ar' ? 'رد' : 'Reply'}
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── International Requests Section ────────────────────────────────────────

  function InternationalSection() {
    const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

    const intlStatuses: InternationalRequest['status'][] = [
      'new', 'under_review', 'contacted', 'sent_to_doctor', 'sent_to_hospital', 'waiting_reply', 'completed', 'closed'
    ];

    function getIntlColor(s: string) {
      const m: Record<string, string> = {
        new: 'bg-blue-100 text-blue-700', under_review: 'bg-amber-100 text-amber-700',
        contacted: 'bg-purple-100 text-purple-700', sent_to_doctor: 'bg-indigo-100 text-indigo-700',
        sent_to_hospital: 'bg-indigo-100 text-indigo-700', waiting_reply: 'bg-amber-100 text-amber-700',
        completed: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700'
      };
      return m[s] || 'bg-gray-100 text-gray-700';
    }

    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t_admin('international_requests')} ({intlRequests.length})</h2>
        <div className="space-y-3">
          {intlRequests.length === 0 && (
            <div className="card text-center py-8 text-gray-400">{t_common('no_results')}</div>
          )}
          {intlRequests.map((r, idx) => {
            const isExpanded = expandedIntl === r.id;
            return (
              <div key={r.id} className="card p-0 overflow-hidden">
                <button
                  onClick={() => setExpandedIntl(isExpanded ? null : r.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900">{r.patient_name}</span>
                      <span className="text-gray-400 mx-1.5">-</span>
                      <span className="text-sm text-gray-500">{r.country}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIntlColor(r.status)}`}>
                      {getInternationalStatusLabel(r.status, locale)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الاسم' : 'Name'}</p>
                        <p className="text-sm text-gray-900">{r.patient_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الدولة' : 'Country'}</p>
                        <p className="text-sm text-gray-900">{r.country}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'العمر' : 'Age'}</p>
                        <p className="text-sm text-gray-900">{r.age}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الجنس' : 'Gender'}</p>
                        <p className="text-sm text-gray-900">{r.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'التخصص' : 'Specialty'}</p>
                        <p className="text-sm text-gray-900">{getSpecialtyName(r.specialty_id)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الهاتف' : 'Phone'}</p>
                        <p className="text-sm text-gray-900">{r.phone}</p>
                      </div>
                      {r.email && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-0.5">Email</p>
                          <p className="text-sm text-gray-900">{r.email}</p>
                        </div>
                      )}
                      {r.budget && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الميزانية' : 'Budget'}</p>
                          <p className="text-sm text-gray-900">{r.budget}</p>
                        </div>
                      )}
                      {r.travel_date && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'تاريخ السفر' : 'Travel Date'}</p>
                          <p className="text-sm text-gray-900">{r.travel_date}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'تاريخ الطلب' : 'Created'}</p>
                        <p className="text-sm text-gray-900">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الحالة' : 'Status'}</p>
                        <select
                          value={r.status}
                          onChange={e => { update('international_requests', r.id, { status: e.target.value as InternationalRequest['status'] }); refreshData(); }}
                          className={cn('text-xs border-0 rounded-lg px-2 py-1 font-medium', getIntlColor(r.status))}
                        >
                          {intlStatuses.map(s => (
                            <option key={s} value={s}>{getInternationalStatusLabel(s, locale)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'وصف الحالة' : 'Condition Description'}</p>
                      <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">{r.condition_description}</p>
                    </div>

                    {r.notes && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-400 mb-0.5">{locale === 'ar' ? 'الملاحظات' : 'Notes'}</p>
                        <p className="text-sm text-gray-700 bg-amber-50 rounded-lg p-3 border border-amber-200">{r.notes}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-400 mb-1">
                        {locale === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}
                      </p>
                      <div className="flex gap-2">
                        <textarea
                          value={noteInputs[r.id] || ''}
                          onChange={e => setNoteInputs(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="input text-sm min-h-[60px] resize-y flex-1"
                          dir="auto"
                          placeholder={locale === 'ar' ? 'أضف ملاحظة...' : 'Add a note...'}
                        />
                        <button
                          onClick={() => {
                            const note = (noteInputs[r.id] || '').trim();
                            if (!note) return;
                            const existing = r.notes || '';
                            const updatedNotes = existing ? `${existing}\n---\n${note}` : note;
                            update('international_requests', r.id, { notes: updatedNotes });
                            refreshData();
                            setNoteInputs(prev => ({ ...prev, [r.id]: '' }));
                          }}
                          className="btn btn-primary btn-sm self-end"
                          disabled={!(noteInputs[r.id] || '').trim()}
                        >
                          <Save className="w-4 h-4" />
                          {locale === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {r.whatsapp && (
                        <a href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm text-xs text-green-600">
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      )}
                      {r.email && (
                        <a href={`mailto:${r.email}`} className="btn btn-ghost btn-sm text-xs text-blue-600">
                          <Mail className="w-3.5 h-3.5" /> Email
                        </a>
                      )}
                      <a href={`tel:${r.phone}`} className="btn btn-ghost btn-sm text-xs text-gray-600">
                        <Phone className="w-3.5 h-3.5" /> {r.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

// ─── Doctor Form ──────────────────────────────────────────────────────────

function DoctorForm({ initial, onSave, specialties, cities, onCancel, includeAuth, includeRank }: {
  initial?: Partial<Doctor>;
  onSave: (data: any) => void;
  specialties: Specialty[];
  cities: City[];
  onCancel: () => void;
  includeAuth?: boolean;
  includeRank?: boolean;
}) {
  const locale = useLocale();
  const [form, setForm] = useState({
    name: initial?.name || '',
    name_ar: initial?.name_ar || '',
    specialty_id: initial?.specialty_id || '',
    city_id: initial?.city_id || '',
    fees: initial?.fees || 50,
    years_experience: initial?.years_experience || 5,
    rank: initial?.rank || 'normal',
    verified: initial?.verified ?? false,
    is_active: initial?.is_active ?? true,
    email: '',
    password: '',
  });

  function handleChange(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  const isValid = form.name.trim() && form.name_ar.trim() && form.specialty_id && form.city_id && (!includeAuth || (form.email.trim() && form.password.trim()));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *</label>
          <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="input py-2 text-sm" placeholder="Ahmed Hassan" dir="ltr" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *</label>
          <input value={form.name_ar} onChange={e => handleChange('name_ar', e.target.value)} className="input py-2 text-sm" placeholder="أحمد حسن" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'التخصص' : 'Specialty'} *</label>
          <select value={form.specialty_id} onChange={e => handleChange('specialty_id', e.target.value)} className="input py-2 text-sm">
            <option value="">--</option>
            {specialties.map(s => <option key={s.id} value={s.id}>{locale === 'ar' ? s.name_ar : s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'المدينة' : 'City'} *</label>
          <select value={form.city_id} onChange={e => handleChange('city_id', e.target.value)} className="input py-2 text-sm">
            <option value="">--</option>
            {cities.map(c => <option key={c.id} value={c.id}>{locale === 'ar' ? c.name_ar : c.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الكشفية (JOD)' : 'Fees (JOD)'}</label>
          <input type="number" value={form.fees} onChange={e => handleChange('fees', Number(e.target.value))} className="input py-2 text-sm" min="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'سنوات الخبرة' : 'Years Exp.'}</label>
          <input type="number" value={form.years_experience} onChange={e => handleChange('years_experience', Number(e.target.value))} className="input py-2 text-sm" min="0" />
        </div>
      </div>
      {includeRank && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الرتبة' : 'Rank'}</label>
            <select value={form.rank} onChange={e => handleChange('rank', e.target.value)} className="input py-2 text-sm">
              <option value="normal">{locale === 'ar' ? 'عادي' : 'Normal'}</option>
              <option value="verified">{locale === 'ar' ? 'موثق' : 'Verified'}</option>
              <option value="premium">{locale === 'ar' ? 'مميز' : 'Premium'}</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'موثق' : 'Verified'}</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={e => handleChange('verified', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">{form.verified ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}</span>
            </label>
          </div>
        </div>
      )}
      {includeAuth && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className="input py-2 text-sm" placeholder="doctor@tabibak.com" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'كلمة المرور' : 'Password'} *</label>
            <input type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} className="input py-2 text-sm" placeholder="******" dir="ltr" />
          </div>
        </div>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={!isValid}>
          <Save className="w-4 h-4" />
          {locale === 'ar' ? 'حفظ' : 'Save'}
        </button>
      </div>
    </form>
  );
}

// ─── Hospital Form ──────────────────────────────────────────────────────────

function HospitalForm({ initial, onSave, cities, onCancel, includeAuth, includeRank }: {
  initial?: Partial<Hospital>;
  onSave: (data: any) => void;
  cities: City[];
  onCancel: () => void;
  includeAuth?: boolean;
  includeRank?: boolean;
}) {
  const locale = useLocale();
  const [form, setForm] = useState({
    name: initial?.name || '',
    name_ar: initial?.name_ar || '',
    city_id: initial?.city_id || '',
    rank: initial?.rank || 'normal',
    verified: initial?.verified ?? true,
    is_active: initial?.is_active ?? true,
    email: '',
    password: '',
  });

  function handleChange(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  const isValid = form.name.trim() && form.name_ar.trim() && form.city_id && (!includeAuth || (form.email.trim() && form.password.trim()));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *</label>
          <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="input py-2 text-sm" placeholder="Jordan Hospital" dir="ltr" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *</label>
          <input value={form.name_ar} onChange={e => handleChange('name_ar', e.target.value)} className="input py-2 text-sm" placeholder="مستشفى الأردن" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'المدينة' : 'City'} *</label>
        <select value={form.city_id} onChange={e => handleChange('city_id', e.target.value)} className="input py-2 text-sm">
          <option value="">--</option>
          {cities.map(c => <option key={c.id} value={c.id}>{locale === 'ar' ? c.name_ar : c.name}</option>)}
        </select>
      </div>
      {includeRank && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'الرتبة' : 'Rank'}</label>
            <select value={form.rank} onChange={e => handleChange('rank', e.target.value)} className="input py-2 text-sm">
              <option value="normal">{locale === 'ar' ? 'عادي' : 'Normal'}</option>
              <option value="verified">{locale === 'ar' ? 'موثق' : 'Verified'}</option>
              <option value="premium">{locale === 'ar' ? 'مميز' : 'Premium'}</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'موثق' : 'Verified'}</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={e => handleChange('verified', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">{form.verified ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}</span>
            </label>
          </div>
        </div>
      )}
      {includeAuth && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className="input py-2 text-sm" placeholder="hospital@tabibak.com" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{locale === 'ar' ? 'كلمة المرور' : 'Password'} *</label>
            <input type="password" value={form.password} onChange={e => handleChange('password', e.target.value)} className="input py-2 text-sm" placeholder="******" dir="ltr" />
          </div>
        </div>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={!isValid}>
          <Save className="w-4 h-4" />
          {locale === 'ar' ? 'حفظ' : 'Save'}
        </button>
      </div>
    </form>
  );
}
