import type { Specialty, City, Area, Package } from '@/types';

export const specialties: Specialty[] = [
  { id: 'spec-1', name: 'Cardiology', name_ar: 'قلب وأوعية دموية', icon: 'heart', slug: 'cardiology', is_active: true },
  { id: 'spec-2', name: 'Dermatology', name_ar: 'جلدية', icon: 'skin', slug: 'dermatology', is_active: true },
  { id: 'spec-3', name: 'Orthopedics', name_ar: 'عظام ومفاصل', icon: 'bone', slug: 'orthopedics', is_active: true },
  { id: 'spec-4', name: 'Ophthalmology', name_ar: 'طب العيون', icon: 'eye', slug: 'ophthalmology', is_active: true },
  { id: 'spec-5', name: 'ENT', name_ar: 'أنف وأذن وحنجرة', icon: 'ear', slug: 'ent', is_active: true },
  { id: 'spec-6', name: 'Pediatrics', name_ar: 'طب أطفال', icon: 'baby', slug: 'pediatrics', is_active: true },
  { id: 'spec-7', name: 'Gynecology', name_ar: 'نسائية وتوليد', icon: 'female', slug: 'gynecology', is_active: true },
  { id: 'spec-8', name: 'Neurology', name_ar: 'طب أعصاب', icon: 'brain', slug: 'neurology', is_active: true },
  { id: 'spec-9', name: 'Psychiatry', name_ar: 'طب نفسي', icon: 'head', slug: 'psychiatry', is_active: true },
  { id: 'spec-10', name: 'General Surgery', name_ar: 'جراحة عامة', icon: 'scalpel', slug: 'general-surgery', is_active: true },
  { id: 'spec-11', name: 'Urology', name_ar: 'طب جهاز بولي', icon: 'kidney', slug: 'urology', is_active: true },
  { id: 'spec-12', name: 'Dentistry', name_ar: 'طب أسنان', icon: 'tooth', slug: 'dentistry', is_active: true },
  { id: 'spec-13', name: 'Gastroenterology', name_ar: 'جهاز هضمي', icon: 'stomach', slug: 'gastroenterology', is_active: true },
  { id: 'spec-14', name: 'Endocrinology', name_ar: 'غدد صماء', icon: 'thyroid', slug: 'endocrinology', is_active: true },
  { id: 'spec-15', name: 'Rheumatology', name_ar: 'روماتيزم', icon: 'joint', slug: 'rheumatology', is_active: true },
  { id: 'spec-16', name: 'Pulmonology', name_ar: 'طب جهاز تنفسي', icon: 'lung', slug: 'pulmonology', is_active: true },
  { id: 'spec-17', name: 'Oncology', name_ar: 'أورام', icon: 'cancer', slug: 'oncology', is_active: true },
  { id: 'spec-18', name: 'Nephrology', name_ar: 'كلى', icon: 'kidneys', slug: 'nephrology', is_active: true },
  { id: 'spec-19', name: 'Plastic Surgery', name_ar: 'جراحة تجميل', icon: 'face', slug: 'plastic-surgery', is_active: true },
  { id: 'spec-20', name: 'Internal Medicine', name_ar: 'طب باطني', icon: 'medical', slug: 'internal-medicine', is_active: true },
];

export const cities: City[] = [
  { id: 'city-1', name: 'Amman', name_ar: 'عمان', slug: 'amman' },
  { id: 'city-2', name: 'Irbid', name_ar: 'إربد', slug: 'irbid' },
  { id: 'city-3', name: 'Zarqa', name_ar: 'الزرقاء', slug: 'zarqa' },
  { id: 'city-4', name: 'Aqaba', name_ar: 'العقبة', slug: 'aqaba' },
  { id: 'city-5', name: 'Salt', name_ar: 'السلط', slug: 'salt' },
  { id: 'city-6', name: 'Madaba', name_ar: 'مادبا', slug: 'madaba' },
  { id: 'city-7', name: 'Karak', name_ar: 'الكرك', slug: 'karak' },
  { id: 'city-8', name: 'Jarash', name_ar: 'جرش', slug: 'jarash' },
  { id: 'city-9', name: 'Mafraq', name_ar: 'المفرق', slug: 'mafraq' },
  { id: 'city-10', name: 'Tafila', name_ar: 'الطفيلة', slug: 'tafila' },
];

export const areas: Area[] = [
  { id: 'area-1', city_id: 'city-1', name: 'Abdali', name_ar: 'العبدلي' },
  { id: 'area-2', city_id: 'city-1', name: 'Shmeisani', name_ar: 'الشمساني' },
  { id: 'area-3', city_id: 'city-1', name: 'Jabal Amman', name_ar: 'جبل عمان' },
  { id: 'area-4', city_id: 'city-1', name: 'Jabal Hussein', name_ar: 'جبل الحسين' },
  { id: 'area-5', city_id: 'city-1', name: 'Sweifieh', name_ar: 'الصويفية' },
  { id: 'area-6', city_id: 'city-1', name: 'Abdoun', name_ar: 'عبدون' },
  { id: 'area-7', city_id: 'city-1', name: 'Tlaa Al-Ali', name_ar: 'طلعة العلي' },
  { id: 'area-8', city_id: 'city-1', name: 'Al-Rabia', name_ar: 'الربيعية' },
  { id: 'area-9', city_id: 'city-1', name: 'Al-Jubeiha', name_ar: 'الجبيهة' },
  { id: 'area-10', city_id: 'city-1', name: 'Downtown Amman', name_ar: 'وسط البلد' },
  { id: 'area-11', city_id: 'city-2', name: 'Downtown Irbid', name_ar: 'وسط إربد' },
  { id: 'area-12', city_id: 'city-2', name: 'Barha', name_ar: 'بارحة' },
  { id: 'area-13', city_id: 'city-3', name: 'Downtown Zarqa', name_ar: 'وسط الزرقاء' },
  { id: 'area-14', city_id: 'city-1', name: 'Al-Muqableen', name_ar: 'المقابلين' },
  { id: 'area-15', city_id: 'city-4', name: 'Aqaba City Center', name_ar: 'مركز العقبة' },
];

export const packages: Package[] = [
  {
    id: 'pkg-1',
    name: 'Free',
    name_ar: 'مجاني',
    type: 'doctor',
    price: 0,
    currency: 'JOD',
    monthly_contacts_limit: 3,
    ranking_boost: 0,
    features: ['ظهور أساسي', 'صفحة طبيب', '3 تواصلات شهريًا'],
    is_active: true,
  },
  {
    id: 'pkg-2',
    name: 'Premium',
    name_ar: 'مميز',
    type: 'doctor',
    price: 29.99,
    currency: 'JOD',
    monthly_contacts_limit: 50,
    ranking_boost: 20,
    features: ['ظهور أعلى', 'شارة مميز', 'اتصال وواتساب', 'صور', 'إحصائيات', '50 تواصل شهريًا'],
    is_active: true,
  },
  {
    id: 'pkg-3',
    name: 'VIP',
    name_ar: 'VIP',
    type: 'doctor',
    price: 79.99,
    currency: 'JOD',
    monthly_contacts_limit: 999,
    ranking_boost: 50,
    features: ['ظهور أعلى', 'شارة VIP', 'الصفحة الرئيسية', 'فيديو', 'مرضى دوليين', 'إحصائيات متقدمة', 'تواصل غير محدود'],
    is_active: true,
  },
  {
    id: 'pkg-4',
    name: 'Hospital Basic',
    name_ar: 'مستشفى أساسي',
    type: 'hospital',
    price: 49.99,
    currency: 'JOD',
    monthly_contacts_limit: 100,
    ranking_boost: 10,
    features: ['صفحة مستشفى', 'أطباء مرتبطون', '100 تواصل شهريًا'],
    is_active: true,
  },
  {
    id: 'pkg-5',
    name: 'Hospital Premium',
    name_ar: 'مستشفى مميز',
    type: 'hospital',
    price: 149.99,
    currency: 'JOD',
    monthly_contacts_limit: 999,
    ranking_boost: 30,
    features: ['ظهور أعلى', 'صفحة كاملة', 'فيديو', 'طلبات دولية', 'إحصائيات', 'تواصل غير محدود'],
    is_active: true,
  },
];

// Helper function to generate mock doctors
export function generateMockDoctors() {
  const firstNames = ['أحمد', 'محمد', 'سارة', 'نورة', 'خالد', 'عمر', 'ليلى', 'هدى', 'ياسر', 'مريم', 'علي', 'حسن', 'فاطمة', 'إبراهيم', 'ديما'];
  const lastNames = ['الحسن', 'عبدالله', 'الخطيب', 'الشريف', 'المومني', 'الزبيدي', 'العدوان', 'السرحان', 'البصول', 'الداود', 'الصمادي', 'القطيش', 'العبادي', 'الهوراني', 'العمري'];
  const englishFirstNames = ['Ahmed', 'Mohammad', 'Sara', 'Noura', 'Khaled', 'Omar', 'Layla', 'Huda', 'Yaser', 'Mariam', 'Ali', 'Hassan', 'Fatima', 'Ibrahim', 'Dima'];
  const englishLastNames = ['Al-Hassan', 'Abdullah', 'Al-Khatib', 'Al-Sharif', 'Al-Momani', 'Al-Zubaidi', 'Al-Adwan', 'Al-Sarhan', 'Al-Bsoul', 'Al-Daoud', 'Al-Samadi', 'Al-Qutish', 'Al-Abbadi', 'Al-Hourani', 'Al-Omari'];
  const qualifications = ['دكتوراه في الطب', 'أخصائي', 'استشاري', 'أستاذ مشارك', 'زميل الكلية الملكية'];
  const englishQualifications = ['MD', 'Specialist', 'Consultant', 'Associate Professor', 'FRCP'];
  const degrees = ['MBBS', 'MD', 'PhD', 'FRCS', 'MRCP', 'American Board'];
  
  const doctors = [];
  for (let i = 0; i < 30; i++) {
    const firstNameIndex = i % firstNames.length;
    const lastNameIndex = Math.floor(i / 2) % lastNames.length;
    const specialtyIndex = i % specialties.length;
    const cityIndex = i % cities.length;
    const areaIndex = i % 10;
    const rankOptions: Array<'normal' | 'verified' | 'premium' | 'vip'> = ['normal', 'verified', 'premium', 'vip'];
    const rank = rankOptions[Math.floor(i / 8) % 4];
    
    doctors.push({
      id: `doctor-${i + 1}`,
      user_id: `user-doctor-${i + 1}`,
      name: `${englishFirstNames[firstNameIndex]} ${englishLastNames[lastNameIndex]}`,
      name_ar: `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`,
      specialty_id: specialties[specialtyIndex].id,
      sub_specialty: i % 3 === 0 ? (specialtyIndex % 2 === 0 ? 'قسطرة قلبية' : 'جراحة بالمنظار') : undefined,
      degree: degrees[i % degrees.length],
      years_experience: 5 + (i % 25),
      fees: 15 + (i % 5) * 10 + (rank === 'vip' ? 30 : rank === 'premium' ? 15 : 0),
      city_id: cities[cityIndex].id,
      area_id: areas[areaIndex]?.id,
      bio: i % 2 === 0 ? `متخصص في ${specialties[specialtyIndex].name_ar} مع خبرة ${5 + (i % 25)} سنوات في كبرى المستشفيات الأردنية. عضو في الجمعية الطبية الأردنية.` : undefined,
      bio_ar: i % 2 === 0 ? `متخصص في ${specialties[specialtyIndex].name_ar} مع خبرة ${5 + (i % 25)} سنوات في كبرى المستشفيات الأردنية. عضو في الجمعية الطبية الأردنية.` : undefined,
      qualifications: qualifications[i % qualifications.length],
      languages: i % 3 === 0 ? 'العربية، الإنجليزية' : i % 3 === 1 ? 'العربية' : 'العربية، الإنجليزية، الفرنسية',
      address: `شارع ${['الملك حسين', 'الملك عبدالله', 'المدينة المنورة', 'مكة المكرمة', 'الأردن'][i % 5]}، ${areas[areaIndex]?.name_ar || cities[cityIndex].name_ar}`,
      latitude: 31.95 + (i * 0.01),
      longitude: 35.91 + (i * 0.008),
      working_hours: i % 2 === 0 ? 'السبت - الخميس 9:00 صباحًا - 5:00 مساءً' : 'السبت - الأربعاء 10:00 صباحًا - 8:00 مساءً',
      accepts_booking: i % 3 !== 1,
      accepts_consultation: i % 4 !== 0,
      accepts_international: i % 2 === 0,
      rank,
      verified: rank !== 'normal',
      package_id: rank === 'vip' ? 'pkg-3' : rank === 'premium' ? 'pkg-2' : 'pkg-1',
      ranking_score: (rank === 'vip' ? 90 : rank === 'premium' ? 70 : rank === 'verified' ? 50 : 20) + (i * 2) + (i % 20),
      image_url: null,
      is_active: true,
      created_at: new Date(Date.now() - i * 86400000 * 7).toISOString(),
      hospital_affiliation: i % 4 === 0 ? ['مستشفى الأردن', 'مستشفى الجامعة الأردنية', 'مستشفى البشير', 'مستشفى الخالدي', 'مستشفى عمان الجراحي'][i % 5] : undefined,
    });
  }
  return doctors;
}

// Helper function to generate mock hospitals
export function generateMockHospitals() {
  const hospitalData = [
    { name: 'Jordan Hospital', name_ar: 'مستشفى الأردن', city: 0, area: 0 },
    { name: 'Jordan University Hospital', name_ar: 'مستشفى الجامعة الأردنية', city: 0, area: 2 },
    { name: 'Al-Bashir Hospital', name_ar: 'مستشفى البشير', city: 0, area: 3 },
    { name: 'Al-Khalidi Hospital', name_ar: 'مستشفى الخالدي', city: 0, area: 4 },
    { name: 'Amman Surgical Hospital', name_ar: 'مستشفى عمان الجراحي', city: 0, area: 5 },
    { name: 'Istishari Hospital', name_ar: 'مستشفى الاستشاري', city: 0, area: 6 },
    { name: 'Al-Hayat Hospital', name_ar: 'مستشفى الحياة', city: 1, area: 10 },
    { name: 'Farah Hospital', name_ar: 'مستشفى فرح', city: 0, area: 1 },
    { name: 'Ibn Al-Haytham Hospital', name_ar: 'مستشفى ابن الهيثم', city: 0, area: 8 },
    { name: 'Specialty Hospital', name_ar: 'مستشفى التخصصات', city: 0, area: 0 },
  ];
  
  const rankOptions: Array<'normal' | 'verified' | 'premium' | 'vip'> = ['premium', 'vip', 'verified', 'premium', 'vip', 'premium', 'normal', 'verified', 'normal', 'premium'];
  
  return hospitalData.map((h, i) => ({
    id: `hospital-${i + 1}`,
    user_id: `user-hospital-${i + 1}`,
    name: h.name,
    name_ar: h.name_ar,
    city_id: cities[h.city].id,
    area_id: areas[h.area]?.id,
    about: `مستشفى رائد في الأردن يقدم خدمات طبية متكاملة بأحدث التقنيات العالمية. يضم كادرًا طبيًا متميزًا من الاستشاريين والأخصائيين في جميع التخصصات.`,
    about_ar: `مستشفى رائد في الأردن يقدم خدمات طبية متكاملة بأحدث التقنيات العالمية. يضم كادرًا طبيًا متميزًا من الاستشاريين والأخصائيين في جميع التخصصات.`,
    address: `الشارع الرئيسي، ${areas[h.area]?.name_ar || cities[h.city].name_ar}`,
    latitude: 31.96 + (i * 0.005),
    longitude: 35.92 + (i * 0.004),
    phone: `+962 6 5${String(600000 + i * 10000).slice(0, 7)}`,
    website: `https://www.${h.name.toLowerCase().replace(/\s+/g, '')}.com`,
    languages: 'العربية، الإنجليزية',
    accreditations: ['JCI', 'ISO 9001', 'الاعتماد الأردني'].slice(0, (i % 3) + 1).join('، '),
    logo_url: null,
    cover_url: null,
    departments: ['قسم الطوارئ', 'الجراحة', 'الباطنية', 'الأطفال', 'النسائية', 'العظام', 'القلب'].slice(0, 4 + (i % 4)).join('، '),
    rank: rankOptions[i],
    verified: true,
    package_id: 'pkg-5',
    ranking_score: 60 + (i * 8) + (i % 10),
    is_active: true,
    created_at: new Date(Date.now() - i * 86400000 * 30).toISOString(),
  }));
}

export const mockDoctors = generateMockDoctors();
export const mockHospitals = generateMockHospitals();

// Mock bookings for testing
export const mockBookings = [
  {
    id: 'booking-1',
    patient_name: 'Ali Hassan',
    patient_phone: '+962 7 9000 0001',
    patient_whatsapp: '+962 7 9000 0001',
    doctor_id: 'doctor-1',
    date: '2026-07-15',
    time: '10:00',
    notes: 'أعاني من آلام في الصدر منذ أسبوع',
    status: 'new' as const,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'booking-2',
    patient_name: 'Mona Ibrahim',
    patient_phone: '+962 7 9000 0002',
    doctor_id: 'doctor-3',
    date: '2026-07-16',
    time: '14:30',
    notes: '',
    status: 'confirmed' as const,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'booking-3',
    patient_name: 'Omar Khalid',
    patient_phone: '+962 7 9000 0003',
    doctor_id: 'doctor-5',
    date: '2026-07-10',
    time: '11:00',
    notes: 'مراجعة للفحص الدوري',
    status: 'completed' as const,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Mock consultations
export const mockConsultations = [
  {
    id: 'consult-1',
    patient_name: 'Sara Ahmad',
    patient_phone: '+962 7 8000 0001',
    message: 'أعاني من طفح جلدي منذ أسبوعين، ما العلاج المناسب؟',
    doctor_id: 'doctor-2',
    status: 'new' as const,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'consult-2',
    patient_name: 'Khaled Mahmoud',
    patient_phone: '+962 7 8000 0002',
    message: 'هل تحتاج آلام الظهر المزمنة إلى تدخل جراحي؟',
    doctor_id: 'doctor-3',
    status: 'answered' as const,
    reply: 'ينصح بمراجعة العيادة للفحص السريري وإجراء الأشعة اللازمة قبل تحديد الخطة العلاجية.',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

// Mock international requests
export const mockInternationalRequests = [
  {
    id: 'intl-1',
    patient_name: 'Abdulaziz Al-Saud',
    country: 'المملكة العربية السعودية',
    phone: '+966 5 0000 0001',
    whatsapp: '+966 5 0000 0001',
    email: 'abdulaziz@example.com',
    age: 45,
    gender: 'ذكر',
    condition_description: 'أعاني من مشكلة في الركبة اليمنى منذ 3 سنوات، أجريت عمليتين سابقتين دون نجاح كامل.',
    specialty_id: 'spec-3',
    has_previous_diagnosis: true,
    has_medical_reports: true,
    prefers_hospital: true,
    preferred_hospital_id: 'hospital-1',
    travel_date: '2026-08-15',
    budget: '5000 - 10000 USD',
    needs_hotel: true,
    needs_translator: false,
    needs_airport_pickup: true,
    notes: 'أرغب في الحصول على استشارة من أفضل جراحي العظام في الأردن',
    consent: true,
    status: 'new' as const,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'intl-2',
    patient_name: 'Layla Mohamed',
    country: 'العراق',
    phone: '+964 7 7000 0001',
    whatsapp: '+964 7 7000 0001',
    age: 32,
    gender: 'أنثى',
    condition_description: 'أعاني من العقم وأرغب في استشارة أخصائي خصوبة في الأردن.',
    specialty_id: 'spec-7',
    has_previous_diagnosis: true,
    has_medical_reports: true,
    prefers_doctor: true,
    travel_date: '2026-09-01',
    budget: '3000 - 5000 USD',
    needs_hotel: true,
    needs_translator: false,
    needs_airport_pickup: true,
    consent: true,
    status: 'under_review' as const,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];
