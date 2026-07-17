import { Hospital } from '@/types';

export const mockHospitals: Hospital[] = [
  {
    id: 'df9c3c0c-8066-4fbf-97f3-4a1111111111',
    owner_id: null,
    package_id: 'e5e3966e-21ef-42f3-a7bb-4e9df6666666', // International Partner
    city_id: 'c4a5c753-4874-4b53-91b7-a3cf57d549cb', // Amman
    name_ar: 'مستشفى الأردن',
    name_en: 'Jordan Hospital',
    slug: 'jordan-hospital',
    logo_url: '/images/hospitals/jordan-logo.png',
    cover_url: '/images/hospitals/jordan-cover.jpg',
    description_ar: 'مستشفى الأردن هو صرح طبي متميز ورائد في تقديم الرعاية الصحية المتكاملة في الشرق الأوسط. مجهز بأحدث الأجهزة والتقنيات الطبية المتقدمة والاعتمادات الدولية.',
    description_en: 'Jordan Hospital is a premier, leading medical institution providing comprehensive healthcare in the Middle East. It is equipped with state-of-the-art medical technology and holds major international accreditations.',
    address_ar: 'العبدلي، بالقرب من دوار الداخلية، عمان',
    address_en: 'Abdali, near Interior Ministry Circle, Amman',
    rank: 'vip',
    is_verified: true,
    accepts_international_patients: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'df9c3c0c-8066-4fbf-97f3-4a2222222222',
    owner_id: null,
    package_id: 'e5e3966e-21ef-42f3-a7bb-4e9df5555555', // Premium
    city_id: 'c4a5c753-4874-4b53-91b7-a3cf57d549cb', // Amman
    name_ar: 'مستشفى الخالدي',
    name_en: 'Al-Khalidi Hospital',
    slug: 'al-khalidi-hospital',
    logo_url: '/images/hospitals/khalidi-logo.png',
    cover_url: '/images/hospitals/khalidi-cover.jpg',
    description_ar: 'مستشفى الخالدي هو مستشفى تخصصي رائد، ومشهور بتميزه في جراحة القلب والأوعية الدموية وتقديم الخدمات الإسعافية والجراحية المتكاملة منذ عقود.',
    description_en: 'Al-Khalidi Hospital is a premier specialty hospital, renowned for its excellence in cardiovascular surgery, emergency services, and comprehensive surgical care for decades.',
    address_ar: 'جبل عمان، الدوار الثالث، عمان',
    address_en: 'Jabal Amman, Third Circle, Amman',
    rank: 'premium',
    is_verified: true,
    accepts_international_patients: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
