export type UserRole = 'admin' | 'doctor' | 'hospital' | 'patient';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface City {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Specialty {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Package {
  id: string;
  name_ar: string;
  name_en: string;
  type: 'doctor' | 'hospital';
  tier: 'free' | 'premium' | 'vip' | 'international';
  price_jod: number;
  contact_limit: number;
  ranking_boost: number;
  allow_direct_contact: boolean;
  features: string[]; // parsed from jsonb
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Hospital {
  id: string;
  owner_id: string | null;
  package_id: string | null;
  city_id: string | null;
  name_ar: string;
  name_en: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  description_ar: string | null;
  description_en: string | null;
  address_ar: string | null;
  address_en: string | null;
  rank: 'standard' | 'verified' | 'premium' | 'vip';
  is_verified: boolean;
  accepts_international_patients: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Doctor {
  id: string;
  owner_id: string | null;
  hospital_id: string | null;
  package_id: string | null;
  specialty_id: string | null;
  city_id: string | null;
  full_name_ar: string;
  full_name_en: string;
  slug: string;
  title_ar: string | null;
  title_en: string | null;
  bio_ar: string | null;
  bio_en: string | null;
  consultation_fee_jod: number;
  experience_years: number;
  gender: 'male' | 'female';
  address_ar: string | null;
  address_en: string | null;
  profile_image_url: string | null;
  rank: 'standard' | 'verified' | 'premium' | 'vip';
  rating: number;
  is_verified: boolean;
  accepts_booking: boolean;
  accepts_consultation: boolean;
  accepts_international_patients: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ProviderContact {
  id: string;
  provider_type: 'doctor' | 'hospital';
  doctor_id: string | null;
  hospital_id: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorSpecialty {
  id: string;
  doctor_id: string;
  specialty_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface HospitalSpecialty {
  id: string;
  hospital_id: string;
  specialty_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  profile_id: string;
  package_id: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string | null;
  payment_method: string | null;
  payment_status: 'pending' | 'completed' | 'failed';
  admin_confirmed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Booking {
  id: string;
  target_type: 'doctor' | 'hospital';
  doctor_id: string | null;
  hospital_id: string | null;
  patient_name: string;
  patient_phone: string;
  patient_whatsapp: string | null;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: 'new' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  is_hidden_from_provider: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface InternationalRequest {
  id: string;
  target_type: 'doctor' | 'hospital' | 'general';
  doctor_id: string | null;
  hospital_id: string | null;
  patient_name: string;
  country: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  age: number | null;
  gender: 'male' | 'female' | null;
  condition_description: string;
  specialty_id: string | null;
  budget_range: string | null;
  needs_hotel: boolean;
  needs_translator: boolean;
  needs_airport_pickup: boolean;
  consent_to_share: boolean;
  status: 'new' | 'under_review' | 'contacted' | 'sent_to_doctor' | 'sent_to_hospital' | 'waiting_reply' | 'completed' | 'closed';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ContactLead {
  id: string;
  target_type: 'doctor' | 'hospital';
  doctor_id: string | null;
  hospital_id: string | null;
  lead_type: 'phone' | 'whatsapp' | 'booking' | 'consultation' | 'international_request';
  patient_name: string | null;
  patient_phone: string | null;
  patient_whatsapp: string | null;
  is_visible_to_provider: boolean;
  hidden_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
