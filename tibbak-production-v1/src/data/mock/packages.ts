import { Package } from '@/types';

export const mockPackages: Package[] = [
  {
    id: 'e5e3966e-21ef-42f3-a7bb-4e9df1111111',
    name_ar: 'مجاني',
    name_en: 'Free',
    type: 'doctor',
    tier: 'free',
    price_jod: 0.00,
    contact_limit: 3,
    ranking_boost: 0,
    allow_direct_contact: false,
    features: ['عرض أساسي بالبحث', '3 تواصلات شهرياً فقط', 'تلقي طلبات تواصل مخفية بعد التخطي'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e5e3966e-21ef-42f3-a7bb-4e9df2222222',
    name_ar: 'مميز',
    name_en: 'Premium',
    type: 'doctor',
    tier: 'premium',
    price_jod: 29.99,
    contact_limit: 50,
    ranking_boost: 20,
    allow_direct_contact: true,
    features: ['ظهور أعلى بمرتين في نتائج البحث', 'شارة تميز بجانب الاسم والصورة', '50 تواصل كامل البيانات شهرياً', 'اتصال هاتفي وواتساب مباشر لجميع الزوار', 'إحصائيات تفاعلية مبسطة'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e5e3966e-21ef-42f3-a7bb-4e9df3333333',
    name_ar: 'VIP',
    name_en: 'VIP',
    type: 'doctor',
    tier: 'vip',
    price_jod: 79.99,
    contact_limit: 999,
    ranking_boost: 50,
    allow_direct_contact: true,
    features: ['أولوية ظهور قصوى (المركز الأول في التخصص والمدينة)', 'شارة VIP مع التاج الذهبي', 'تواصلات ومكالمات غير محدودة', 'الترويج بالصفحة الرئيسية للمنصة', 'استقبال طلبات السياحة العلاجية للمرضى الدوليين', 'تقارير أداء وإحصائيات متقدمة'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e5e3966e-21ef-42f3-a7bb-4e9df4444444',
    name_ar: 'أساسي',
    name_en: 'Basic',
    type: 'hospital',
    tier: 'free', // mapped to basic
    price_jod: 49.99,
    contact_limit: 20,
    ranking_boost: 10,
    allow_direct_contact: false,
    features: ['صفحة مستشفى تعريفية أساسية', 'ظهور عادي في نتائج البحث', 'عرض التخصصات والأقسام العامة للمستشفى', 'تلقي 20 تواصل شهرياً'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e5e3966e-21ef-42f3-a7bb-4e9df5555555',
    name_ar: 'مميز',
    name_en: 'Premium',
    type: 'hospital',
    tier: 'premium',
    price_jod: 149.99,
    contact_limit: 100,
    ranking_boost: 30,
    allow_direct_contact: true,
    features: ['ظهور مرتفع ومميز في البحث', 'verified badge لتوثيق الحساب', 'تلقي 100 تواصل شهرياً', 'معرض صور وفيديوهات للمستشفى والأجهزة', 'ربط الأطباء المعتمدين بصفحة المستشفى', 'استقبال حجوزات وزيارات عيادات المستشفى'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e5e3966e-21ef-42f3-a7bb-4e9df6666666',
    name_ar: 'International Partner',
    name_en: 'International Partner',
    type: 'hospital',
    tier: 'international',
    price_jod: 249.99,
    contact_limit: 999,
    ranking_boost: 60,
    allow_direct_contact: true,
    features: ['أولوية ترويج قصوى للمرضى الدوليين في الخارج', 'شارة شريك دولي (International Partner)', 'استقبال طلبات علاج دولية غير محدودة', 'الترويج الحصري في صفحات السياحة العلاجية والترويج الخارجي', 'عرض متكامل لخدمات المترجمين، الفنادق، واستقبال المطار'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
