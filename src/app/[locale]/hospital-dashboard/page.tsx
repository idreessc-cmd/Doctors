'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  LayoutDashboard, Building2, Calendar, MessageSquare, Globe,
  BarChart3, Stethoscope, Award, TrendingUp, Menu, X,
  Phone, Mail, MapPin, Check, ChevronDown, ExternalLink,
  Users, Eye, FileText, Star, LogOut, Settings,
} from 'lucide-react';
import {
  getAll, getById, add, update, initializeStore,
  getCurrentUser, hasRole, getStats, incrementStat,
} from '@/lib/store';
import { cn } from '@/lib/utils';

type PageSection = 'overview' | 'profile' | 'bookings' | 'consultations' | 'international' | 'stats' | 'doctors' | 'package' | 'upgrade';

export default function HospitalDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<PageSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    initializeStore();
    const currentUser = getCurrentUser();
    if (!currentUser || !hasRole('hospital')) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    const hospitals = getAll<any>('hospitals');
    const found = hospitals.find((h: any) => h.user_id === currentUser.id);
    if (found) setHospital(found);
    setLoading(false);
  }, []);

  useEffect(() => { if (hospital) incrementStat('hospital', hospital.id, 'profile_views'); }, [hospital]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="skeleton w-16 h-16 rounded-full" /></div>;

  if (!hospital) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <Building2 className="w-16 h-16 text-gray-300" />
      <p className="text-lg text-gray-500">{locale === 'ar' ? 'لم يتم العثور على ملف المستشفى' : 'Hospital profile not found'}</p>
    </div>
  );

  const stats = getStats('hospital', hospital.id);
  const doctors = getAll<any>('doctors').filter((d: any) => d.hospital_affiliation === hospital.name || d.hospital_affiliation === hospital.name_ar);
  const bookings = getAll<any>('bookings').filter((b: any) => b.hospital_id === hospital.id);
  const consultations = getAll<any>('consultations').filter((c: any) => c.hospital_id === hospital.id);
  const intlRequests = getAll<any>('international_requests').filter((r: any) => r.preferred_hospital_id === hospital.id);
  const allPackages = getAll<any>('packages');
  const hospitalPkgs = allPackages.filter((p: any) => p.type === 'hospital');
  const currentPkg = allPackages.find((p: any) => p.id === hospital.package_id);
  const subscriptions = getAll<any>('subscriptions');

  const sidebarItems: { id: PageSection; label: string; icon: any }[] = [
    { id: 'overview', label: locale === 'ar' ? 'الرئيسية' : 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: locale === 'ar' ? 'صفحة المستشفى' : 'Hospital Profile', icon: Building2 },
    { id: 'bookings', label: locale === 'ar' ? 'الحجوزات' : 'Bookings', icon: Calendar },
    { id: 'consultations', label: locale === 'ar' ? 'الاستشارات' : 'Consultations', icon: MessageSquare },
    { id: 'international', label: locale === 'ar' ? 'الطلبات الدولية' : 'International', icon: Globe },
    { id: 'stats', label: locale === 'ar' ? 'الإحصائيات' : 'Statistics', icon: BarChart3 },
    { id: 'doctors', label: locale === 'ar' ? 'الأطباء' : 'Doctors', icon: Stethoscope },
    { id: 'package', label: locale === 'ar' ? 'الباقة' : 'Package', icon: Award },
    { id: 'upgrade', label: locale === 'ar' ? 'ترقية' : 'Upgrade', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mobile sidebar toggle */}
      <button className="lg:hidden fixed top-20 right-4 z-50 btn btn-ghost p-2 bg-white shadow-lg rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-20 lg:top-20 z-40 w-64 h-[calc(100vh-5rem)] bg-white border-l border-gray-200 transition-transform duration-300 overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : locale === 'ar' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-lg text-primary">{hospital.name_ar || hospital.name}</h2>
            <p className="text-sm text-gray-500">{t('hospital_dashboard.title')}</p>
          </div>
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }}
                className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  section === item.id ? 'bg-primary-light text-primary' : 'text-gray-600 hover:bg-gray-50'
                )}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <hr className="my-2" />
            <button onClick={() => { localStorage.removeItem('tabibak_current_user'); router.push('/'); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
              {t('auth.logout')}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto">
          {section === 'overview' && <OverviewSection t={t} locale={locale} hospital={hospital} stats={stats} bookings={bookings} consultations={consultations} intlRequests={intlRequests} doctors={doctors} currentPkg={currentPkg} />}
          {section === 'profile' && <ProfileSection t={t} locale={locale} hospital={hospital} setHospital={setHospital} />}
          {section === 'bookings' && <BookingsSection t={t} locale={locale} bookings={bookings} />}
          {section === 'consultations' && <ConsultationsSection t={t} locale={locale} consultations={consultations} />}
          {section === 'international' && <InternationalSection t={t} locale={locale} requests={intlRequests} />}
          {section === 'stats' && <StatsSection t={t} locale={locale} stats={stats} />}
          {section === 'doctors' && <DoctorsSection t={t} locale={locale} doctors={doctors} />}
          {section === 'package' && <PackageSection t={t} locale={locale} currentPkg={currentPkg} />}
          {section === 'upgrade' && <UpgradeSection t={t} locale={locale} hospital={hospital} packages={hospitalPkgs} currentPkg={currentPkg} />}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function OverviewSection({ t, locale, hospital, stats, bookings, consultations, intlRequests, doctors, currentPkg }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{locale === 'ar' ? 'مرحباً' : 'Welcome'}, {hospital.name_ar || hospital.name}</h1>
        <p className="text-gray-500">{locale === 'ar' ? 'نظرة عامة على مستشفاك' : 'Hospital overview'}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Eye} label={locale === 'ar' ? 'مشاهدات الملف' : 'Profile Views'} value={stats.profile_views || 0} color="bg-blue-500" />
        <StatCard icon={Calendar} label={locale === 'ar' ? 'الحجوزات' : 'Bookings'} value={bookings.length} color="bg-green-500" />
        <StatCard icon={MessageSquare} label={locale === 'ar' ? 'الاستشارات' : 'Consultations'} value={consultations.length} color="bg-purple-500" />
        <StatCard icon={Globe} label={locale === 'ar' ? 'الطلبات الدولية' : 'Intl Requests'} value={intlRequests.length} color="bg-amber-500" />
        <StatCard icon={Stethoscope} label={locale === 'ar' ? 'الأطباء' : 'Doctors'} value={doctors.length} color="bg-indigo-500" />
        <StatCard icon={Award} label={locale === 'ar' ? 'الباقة' : 'Package'} value={currentPkg?.name_ar || currentPkg?.name || '-'} color="bg-teal-500" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold mb-4">{locale === 'ar' ? 'آخر الطلبات الدولية' : 'Latest International Requests'}</h3>
          {intlRequests.slice(0, 5).length > 0 ? intlRequests.slice(0, 5).map((r: any) => (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium">{r.patient_name}</p>
                <p className="text-sm text-gray-500">{r.country} - {r.condition_description?.slice(0, 30)}...</p>
              </div>
              <span className="badge text-xs">{r.status}</span>
            </div>
          )) : <p className="text-gray-400 text-sm">{locale === 'ar' ? 'لا توجد طلبات' : 'No requests'}</p>}
        </div>
        <div className="card">
          <h3 className="font-bold mb-4">{locale === 'ar' ? 'آخر الحجوزات' : 'Latest Bookings'}</h3>
          {bookings.slice(0, 5).length > 0 ? bookings.slice(0, 5).map((b: any) => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium">{b.patient_name}</p>
                <p className="text-sm text-gray-500">{b.date} - {b.time}</p>
              </div>
              <span className="badge text-xs">{b.status}</span>
            </div>
          )) : <p className="text-gray-400 text-sm">{locale === 'ar' ? 'لا توجد حجوزات' : 'No bookings'}</p>}
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ t, locale, hospital, setHospital }: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...hospital });

  const handleSave = () => {
    const { update } = require('@/lib/store');
    update('hospitals', hospital.id, form);
    setHospital(form);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{locale === 'ar' ? 'صفحة المستشفى' : 'Hospital Profile'}</h2>
        <button onClick={() => setEditing(true)} className="btn btn-primary btn-sm"><Settings className="w-4 h-4" /> {locale === 'ar' ? 'تعديل' : 'Edit'}</button>
      </div>
      <div className="card space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-primary-light flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{hospital.name_ar || hospital.name}</h3>
            <p className="text-gray-500">{hospital.city_id}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-500">{locale === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</label><p>{hospital.name_ar}</p></div>
          <div><label className="text-sm text-gray-500">{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</label><p>{hospital.name}</p></div>
          <div className="md:col-span-2"><label className="text-sm text-gray-500">{locale === 'ar' ? 'نبذة' : 'About'}</label><p>{hospital.about_ar || hospital.about}</p></div>
          <div><label className="text-sm text-gray-500">{locale === 'ar' ? 'الهاتف' : 'Phone'}</label><p>{hospital.phone}</p></div>
          <div><label className="text-sm text-gray-500">{locale === 'ar' ? 'العنوان' : 'Address'}</label><p>{hospital.address}</p></div>
          <div><label className="text-sm text-gray-500">{locale === 'ar' ? 'الاعتمادات' : 'Accreditations'}</label><p>{hospital.accreditations}</p></div>
          <div><label className="text-sm text-gray-500">{locale === 'ar' ? 'الأقسام' : 'Departments'}</label><p>{hospital.departments}</p></div>
        </div>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{locale === 'ar' ? 'تعديل المستشفى' : 'Edit Hospital'}</h3>
            <div className="space-y-4">
              <input className="input" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} placeholder="Name (Arabic)" />
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name (English)" />
              <textarea className="input min-h-[100px]" value={form.about_ar} onChange={e => setForm({...form, about_ar: e.target.value})} placeholder="About (Arabic)" />
              <textarea className="input min-h-[100px]" value={form.about} onChange={e => setForm({...form, about: e.target.value})} placeholder="About (English)" />
              <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" />
              <input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Address" />
              <input className="input" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="Website" />
              <input className="input" value={form.accreditations} onChange={e => setForm({...form, accreditations: e.target.value})} placeholder="Accreditations" />
              <textarea className="input min-h-[80px]" value={form.departments} onChange={e => setForm({...form, departments: e.target.value})} placeholder="Departments" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="btn btn-primary flex-1"><Check className="w-4 h-4" /> {locale === 'ar' ? 'حفظ' : 'Save'}</button>
              <button onClick={() => setEditing(false)} className="btn btn-ghost">{locale === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsSection({ t, locale, bookings }: any) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? bookings : bookings.filter((b: any) => b.status === filter);

  const changeStatus = (id: string, status: string) => {
    const { update } = require('@/lib/store');
    update('bookings', id, { status });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'الحجوزات' : 'Bookings'}</h2>
      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'confirmed', 'rejected', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3 py-1 rounded-full text-sm font-medium transition-colors',
              filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}>{locale === 'ar' ? { all: 'الكل', new: 'جديد', confirmed: 'مؤكد', rejected: 'مرفوض', completed: 'مكتمل', cancelled: 'ملغي' }[s] : s}</button>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-gray-200">
            <th className="text-right p-3 text-sm font-medium text-gray-500">{locale === 'ar' ? 'المريض' : 'Patient'}</th>
            <th className="text-right p-3 text-sm font-medium text-gray-500">{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
            <th className="text-right p-3 text-sm font-medium text-gray-500">{locale === 'ar' ? 'الوقت' : 'Time'}</th>
            <th className="text-right p-3 text-sm font-medium text-gray-500">{locale === 'ar' ? 'الحالة' : 'Status'}</th>
            <th className="text-right p-3 text-sm font-medium text-gray-500">{locale === 'ar' ? 'إجراء' : 'Action'}</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">{locale === 'ar' ? 'لا توجد حجوزات' : 'No bookings'}</td></tr>}
            {filtered.map((b: any) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-3">{b.patient_name}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.time}</td>
                <td className="p-3"><span className="badge">{b.status}</span></td>
                <td className="p-3">
                  <select className="select text-sm py-1" value={b.status} onChange={e => changeStatus(b.id, e.target.value)}>
                    <option value="new">{locale === 'ar' ? 'جديد' : 'New'}</option>
                    <option value="confirmed">{locale === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
                    <option value="rejected">{locale === 'ar' ? 'مرفوض' : 'Rejected'}</option>
                    <option value="completed">{locale === 'ar' ? 'مكتمل' : 'Completed'}</option>
                    <option value="cancelled">{locale === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConsultationsSection({ t, locale, consultations }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyId, setReplyId] = useState<string | null>(null);

  const submitReply = () => {
    if (!replyId || !replyText.trim()) return;
    const { update } = require('@/lib/store');
    update('consultations', replyId, { reply: replyText, status: 'answered' });
    setReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'الاستشارات' : 'Consultations'}</h2>
      <div className="space-y-3">
        {consultations.length === 0 && <div className="card text-center text-gray-400 py-8">{locale === 'ar' ? 'لا توجد استشارات' : 'No consultations'}</div>}
        {consultations.map((c: any) => (
          <div key={c.id} className="card">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              <div>
                <p className="font-medium">{c.patient_name}</p>
                <p className="text-sm text-gray-500">{c.message?.slice(0, 60)}...</p>
              </div>
              <span className="badge">{c.status}</span>
            </div>
            {expanded === c.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <p className="text-gray-700">{c.message}</p>
                {c.reply && <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-500">{locale === 'ar' ? 'الرد:' : 'Reply:'}</p><p>{c.reply}</p></div>}
                {c.status === 'new' && (
                  <div className="space-y-2">
                    <textarea className="input min-h-[80px]" value={replyId === c.id ? replyText : ''} onChange={e => { setReplyId(c.id); setReplyText(e.target.value); }} placeholder={locale === 'ar' ? 'اكتب ردك...' : 'Write your reply...'} />
                    <button onClick={submitReply} className="btn btn-primary btn-sm"><MessageSquare className="w-4 h-4" /> {locale === 'ar' ? 'إرسال الرد' : 'Send Reply'}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InternationalSection({ t, locale, requests }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const changeStatus = (id: string, status: string) => {
    const { update } = require('@/lib/store');
    update('international_requests', id, { status });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'طلبات العلاج الدولية' : 'International Treatment Requests'}</h2>
      <div className="space-y-3">
        {requests.length === 0 && <div className="card text-center text-gray-400 py-8">{locale === 'ar' ? 'لا توجد طلبات' : 'No requests'}</div>}
        {requests.map((r: any) => (
          <div key={r.id} className="card">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{r.patient_name}</p>
                  <p className="text-sm text-gray-500">{r.country} - {r.specialty_id}</p>
                </div>
              </div>
              <span className="badge">{r.status}</span>
            </div>
            {expanded === r.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">{locale === 'ar' ? 'العمر:' : 'Age:'}</span> {r.age}</div>
                  <div><span className="text-gray-500">{locale === 'ar' ? 'الجنس:' : 'Gender:'}</span> {r.gender}</div>
                  <div><span className="text-gray-500">{locale === 'ar' ? 'الهاتف:' : 'Phone:'}</span> {r.phone}</div>
                  <div><span className="text-gray-500">WhatsApp:</span> {r.whatsapp || '-'}</div>
                  <div><span className="text-gray-500">{locale === 'ar' ? 'تاريخ السفر:' : 'Travel Date:'}</span> {r.travel_date || '-'}</div>
                  <div><span className="text-gray-500">{locale === 'ar' ? 'الميزانية:' : 'Budget:'}</span> {r.budget || '-'}</div>
                  <div className="md:col-span-2"><span className="text-gray-500">{locale === 'ar' ? 'الحالة:' : 'Condition:'}</span> {r.condition_description}</div>
                  {r.notes && <div className="md:col-span-2"><span className="text-gray-500">{locale === 'ar' ? 'ملاحظات:' : 'Notes:'}</span> {r.notes}</div>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">{locale === 'ar' ? 'تغيير الحالة:' : 'Change Status:'}</span>
                  <select className="select text-sm py-1 w-auto" value={r.status} onChange={e => changeStatus(r.id, e.target.value)}>
                    {['new', 'under_review', 'contacted', 'sent_to_hospital', 'waiting_reply', 'completed', 'closed'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  {r.phone && <a href={`tel:${r.phone}`} className="btn btn-outline btn-sm"><Phone className="w-4 h-4" /> {locale === 'ar' ? 'اتصال' : 'Call'}</a>}
                  {r.whatsapp && <a href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="btn btn-secondary btn-sm"><ExternalLink className="w-4 h-4" /> WhatsApp</a>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSection({ t, locale, stats }: any) {
  const items = [
    { label: locale === 'ar' ? 'مشاهدات الملف' : 'Profile Views', value: stats.profile_views || 0, color: 'bg-blue-500', max: Math.max(stats.profile_views || 1, 1) },
    { label: locale === 'ar' ? 'نقرات الاتصال' : 'Contact Clicks', value: stats.contact_clicks || 0, color: 'bg-green-500', max: Math.max(stats.profile_views || 1, 1) },
    { label: locale === 'ar' ? 'نقرات واتساب' : 'WhatsApp Clicks', value: stats.whatsapp_clicks || 0, color: 'bg-purple-500', max: Math.max(stats.profile_views || 1, 1) },
    { label: locale === 'ar' ? 'الحجوزات' : 'Bookings', value: stats.bookings_count || 0, color: 'bg-amber-500', max: Math.max(stats.profile_views || 1, 1) },
    { label: locale === 'ar' ? 'الاستشارات' : 'Consultations', value: stats.consultations_count || 0, color: 'bg-indigo-500', max: Math.max(stats.profile_views || 1, 1) },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'الإحصائيات' : 'Statistics'}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500">{item.label}</span>
              <span className="text-2xl font-bold">{item.value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className={`${item.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DoctorsSection({ t, locale, doctors }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'الأطباء المرتبطون' : 'Affiliated Doctors'}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.length === 0 && <div className="card col-span-full text-center text-gray-400 py-8">{locale === 'ar' ? 'لا يوجد أطباء مرتبطون' : 'No affiliated doctors'}</div>}
        {doctors.map((d: any) => (
          <div key={d.id} className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{d.name_ar || d.name}</p>
              <p className="text-sm text-gray-500">{d.specialty_id}</p>
              <span className="badge text-xs">{d.rank}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackageSection({ t, locale, currentPkg }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'الباقة الحالية' : 'Current Package'}</h2>
      {currentPkg ? (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{currentPkg.name_ar || currentPkg.name}</h3>
              <p className="text-2xl text-primary font-bold mt-1">{currentPkg.price > 0 ? `${currentPkg.price} ${currentPkg.currency}/${locale === 'ar' ? 'شهر' : 'month'}` : locale === 'ar' ? 'مجاني' : 'Free'}</p>
            </div>
            <Award className="w-12 h-12 text-primary-light" />
          </div>
          <div className="space-y-2">
            <p className="font-medium">{locale === 'ar' ? 'المميزات:' : 'Features:'}</p>
            {currentPkg.features?.map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" /> {f}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {locale === 'ar' ? `حد التواصل الشهري: ${currentPkg.monthly_contacts_limit}` : `Monthly contact limit: ${currentPkg.monthly_contacts_limit}`}
          </p>
        </div>
      ) : <div className="card text-center text-gray-400">{locale === 'ar' ? 'لا توجد باقة نشطة' : 'No active package'}</div>}
    </div>
  );
}

function UpgradeSection({ t, locale, hospital, packages, currentPkg }: any) {
  const [selectedPkg, setSelectedPkg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpgrade = () => {
    if (!selectedPkg) return;
    const { add } = require('@/lib/store');
    add('subscriptions', {
      id: `sub-${Date.now()}`,
      user_id: hospital.user_id,
      package_id: selectedPkg,
      payment_method: paymentMethod,
      payment_status: 'pending',
      admin_confirmed: false,
      notes,
      created_at: new Date().toISOString(),
    });
    setSuccess(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{locale === 'ar' ? 'ترقية الباقة' : 'Upgrade Package'}</h2>
      {success ? (
        <div className="card text-center py-8">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-bold text-green-600">{locale === 'ar' ? 'تم إرسال طلب الترقية بنجاح' : 'Upgrade request sent successfully'}</p>
          <p className="text-gray-500 mt-2">{locale === 'ar' ? 'سيتم مراجعة طلبك من قبل الإدارة وتأكيد الدفع' : 'Your request will be reviewed by admin'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {packages.map((pkg: any) => {
            const isCurrent = currentPkg?.id === pkg.id;
            return (
              <div key={pkg.id} className={cn('card border-2 transition-all', isCurrent ? 'border-primary' : selectedPkg === pkg.id ? 'border-primary' : 'border-gray-200')}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">{pkg.name_ar || pkg.name}</h3>
                  {isCurrent && <span className="badge bg-primary text-white">{locale === 'ar' ? 'حالية' : 'Current'}</span>}
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{pkg.price > 0 ? `${pkg.price} ${pkg.currency}/${locale === 'ar' ? 'شهر' : 'mo'}` : locale === 'ar' ? 'مجاني' : 'Free'}</p>
                <div className="space-y-1 mb-4">
                  {pkg.features?.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm"><Check className="w-3 h-3 text-green-500" /> {f}</div>
                  ))}
                </div>
                {!isCurrent && (
                  <button onClick={() => setSelectedPkg(pkg.id)} className={cn('btn w-full', selectedPkg === pkg.id ? 'btn-primary' : 'btn-outline')}>
                    {locale === 'ar' ? 'اختيار' : 'Select'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {selectedPkg && !success && (
        <div className="card space-y-4">
          <h3 className="font-bold">{locale === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}</h3>
          <select className="select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="">{locale === 'ar' ? 'اختر طريقة الدفع' : 'Select payment method'}</option>
            <option value="cash">{locale === 'ar' ? 'كاش' : 'Cash'}</option>
            <option value="cliq">CliQ</option>
            <option value="bank_transfer">{locale === 'ar' ? 'تحويل بنكي' : 'Bank Transfer'}</option>
            <option value="wallet">{locale === 'ar' ? 'محفظة إلكترونية' : 'E-Wallet'}</option>
          </select>
          <textarea className="input min-h-[60px]" value={notes} onChange={e => setNotes(e.target.value)} placeholder={locale === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)'} />
          <button onClick={handleUpgrade} disabled={!paymentMethod} className="btn btn-primary w-full">
            <TrendingUp className="w-4 h-4" /> {locale === 'ar' ? 'إرسال طلب الترقية' : 'Send Upgrade Request'}
          </button>
        </div>
      )}
    </div>
  );
}
