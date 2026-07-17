import { Doctor } from '@/types';

export const mockDoctors: Doctor[] = [
  {
    id: 'da55c6ff-9311-4eb2-a6f9-711111111111',
    owner_id: null,
    hospital_id: 'df9c3c0c-8066-4fbf-97f3-4a1111111111', // Jordan Hospital
    package_id: 'e5e3966e-21ef-42f3-a7bb-4e9df3333333', // VIP
    specialty_id: '9f8b1c44-d3a9-467f-9457-4148b1111111', // Cardiology
    city_id: 'c4a5c753-4874-4b53-91b7-a3cf57d549cb', // Amman
    full_name_ar: 'د. أحمد الحسن',
    full_name_en: 'Dr. Ahmed Al-Hassan',
    slug: 'dr-ahmed-al-hassan',
    title_ar: 'استشاري أمراض القلب والأوعية الدموية وقسطرة الشرايين',
    title_en: 'Consultant Cardiologist and Interventional Cardiologist',
    bio_ar: 'د. أحمد الحسن هو استشاري أمراض القلب والأوعية الدموية مع خبرة تزيد عن 18 عاماً في علاج أمراض الشرايين التاجية، تركيب الشبكات، وقسطرة القلب في كبرى المستشفيات بالأردن وخارجها.',
    bio_en: 'Dr. Ahmed Al-Hassan is a Consultant Cardiologist with over 18 years of experience in treating coronary artery diseases, stent implantations, and cardiac catheterization at major hospitals in Jordan and abroad.',
    consultation_fee_jod: 40.00,
    experience_years: 18,
    gender: 'male',
    address_ar: 'مجمع العبدلي الطبي، الطابق الرابع، عمان',
    address_en: 'Abdali Medical Complex, 4th Floor, Amman',
    profile_image_url: '/images/doctors/dr-ahmed.jpg',
    rank: 'vip',
    rating: 4.9,
    is_verified: true,
    accepts_booking: true,
    accepts_consultation: true,
    accepts_international_patients: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'da55c6ff-9311-4eb2-a6f9-722222222222',
    owner_id: null,
    hospital_id: 'df9c3c0c-8066-4fbf-97f3-4a2222222222', // Al-Khalidi Hospital
    package_id: 'e5e3966e-21ef-42f3-a7bb-4e9df2222222', // Premium
    specialty_id: '9f8b1c44-d3a9-467f-9457-4148b2222222', // Dermatology
    city_id: 'c4a5c753-4874-4b53-91b7-a3cf57d549cb', // Amman
    full_name_ar: 'د. سارة الخطيب',
    full_name_en: 'Dr. Sara Al-Khatib',
    slug: 'dr-sara-al-khatib',
    title_ar: 'أخصائية الأمراض الجلدية والتجميل والليزر',
    title_en: 'Specialist Dermatologist and Laser Expert',
    bio_ar: 'د. سارة الخطيب متخصصة في علاج الأمراض الجلدية المستعصية، التجميل غير الجراحي، البوتوكس والفيلر، وعلاجات الليزر المتقدمة للبشرة مع خبرة 10 سنوات.',
    bio_en: 'Dr. Sara Al-Khatib specializes in treating chronic skin conditions, non-surgical aesthetics, Botox & Fillers, and advanced laser skin treatments with 10 years of experience.',
    consultation_fee_jod: 25.00,
    experience_years: 10,
    gender: 'female',
    address_ar: 'شارع عبد الله غوشة، مجمع القضاة الطبي، عمان',
    address_en: 'Abdullah Ghosheh St, Al-Qudah Medical Complex, Amman',
    profile_image_url: '/images/doctors/dr-sara.jpg',
    rank: 'premium',
    rating: 4.8,
    is_verified: true,
    accepts_booking: true,
    accepts_consultation: true,
    accepts_international_patients: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'da55c6ff-9311-4eb2-a6f9-733333333333',
    owner_id: null,
    hospital_id: null,
    package_id: 'e5e3966e-21ef-42f3-a7bb-4e9df1111111', // Free Package (allow_direct_contact = false)
    specialty_id: '9f8b1c44-d3a9-467f-9457-4148b3333333', // Orthopedics
    city_id: '1d7e5d83-74b8-4d57-8fb2-c513b6f00db1', // Irbid
    full_name_ar: 'د. خالد العبدالله',
    full_name_en: 'Dr. Khaled Abdullah',
    slug: 'dr-khaled-abdullah',
    title_ar: 'أخصائي جراحة العظام والمفاصل والمنظار',
    title_en: 'Orthopedic Joint and Arthroscopic Surgeon',
    bio_ar: 'د. خالد العبدالله هو أخصائي عظام ومفاصل حاصل على الزمالة في جراحة الركبة والمنظار من ألمانيا. يقدم الرعاية الطبية في عيادته الخاصة في إربد.',
    bio_en: 'Dr. Khaled Abdullah is an Orthopedic Specialist who completed a fellowship in knee surgery and arthroscopy in Germany. He provides medical care at his private clinic in Irbid.',
    consultation_fee_jod: 30.00,
    experience_years: 12,
    gender: 'male',
    address_ar: 'وسط البلد، شارع السينما، فوق صيدلية الرازي، إربد',
    address_en: 'Downtown, Cinema St, above Al-Razi Pharmacy, Irbid',
    profile_image_url: '/images/doctors/dr-khaled.jpg',
    rank: 'standard',
    rating: 4.5,
    is_verified: false,
    accepts_booking: true,
    accepts_consultation: true,
    accepts_international_patients: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
