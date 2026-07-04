// User roles
export type UserRole = 'admin' | 'doctor' | 'hospital' | 'patient';

// User
export interface User {
  id: string;
  email: string;
  name: string;
  name_ar?: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

// Doctor
export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  name_ar: string;
  specialty_id: string;
  sub_specialty?: string;
  degree?: string;
  years_experience: number;
  fees: number;
  city_id: string;
  area_id?: string;
  bio?: string;
  bio_ar?: string;
  qualifications?: string;
  languages?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  working_hours?: string;
  accepts_booking: boolean;
  accepts_consultation: boolean;
  accepts_international: boolean;
  rank: 'normal' | 'verified' | 'premium' | 'vip';
  verified: boolean;
  package_id?: string;
  ranking_score: number;
  image_url?: string;
  is_active: boolean;
  gender?: string;
  created_at: string;
  // joined
  specialty?: Specialty;
  city?: City;
  area?: Area;
  hospital_affiliation?: string;
}

// Hospital
export interface Hospital {
  id: string;
  user_id: string;
  name: string;
  name_ar: string;
  city_id: string;
  area_id?: string;
  about?: string;
  about_ar?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  languages?: string;
  accreditations?: string;
  logo_url?: string;
  cover_url?: string;
  departments?: string;
  rank: 'normal' | 'verified' | 'premium' | 'vip';
  verified: boolean;
  package_id?: string;
  ranking_score: number;
  is_active: boolean;
  created_at: string;
  city?: City;
  area?: Area;
}

// Specialty
export interface Specialty {
  id: string;
  name: string;
  name_ar: string;
  icon?: string;
  slug: string;
  is_active: boolean;
}

// City
export interface City {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
}

// Area
export interface Area {
  id: string;
  city_id: string;
  name: string;
  name_ar: string;
}

// Package
export interface Package {
  id: string;
  name: string;
  name_ar: string;
  type: 'doctor' | 'hospital';
  price: number;
  currency: string;
  monthly_contacts_limit: number;
  ranking_boost: number;
  features: string[];
  is_active: boolean;
}

// Booking
export interface Booking {
  id: string;
  patient_id?: string;
  patient_name: string;
  patient_phone: string;
  patient_whatsapp?: string;
  doctor_id?: string;
  hospital_id?: string;
  date: string;
  time: string;
  notes?: string;
  status: 'new' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  created_at: string;
  doctor?: Doctor;
  hospital?: Hospital;
}

// Consultation
export interface Consultation {
  id: string;
  patient_id?: string;
  patient_name: string;
  patient_phone: string;
  message: string;
  file_url?: string;
  doctor_id?: string;
  hospital_id?: string;
  status: 'new' | 'answered' | 'closed';
  reply?: string;
  created_at: string;
  doctor?: Doctor;
  hospital?: Hospital;
}

// International Treatment Request
export interface InternationalRequest {
  id: string;
  patient_name: string;
  country: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  age: number;
  gender: string;
  condition_description: string;
  specialty_id?: string;
  has_previous_diagnosis?: boolean;
  has_medical_reports?: boolean;
  files?: string[];
  prefers_doctor?: boolean;
  prefers_hospital?: boolean;
  preferred_doctor_id?: string;
  preferred_hospital_id?: string;
  travel_date?: string;
  budget?: string;
  needs_hotel?: boolean;
  needs_translator?: boolean;
  needs_airport_pickup?: boolean;
  notes?: string;
  consent: boolean;
  status: 'new' | 'under_review' | 'contacted' | 'sent_to_doctor' | 'sent_to_hospital' | 'waiting_reply' | 'completed' | 'closed';
  created_at: string;
  specialty?: Specialty;
  preferred_doctor?: Doctor;
  preferred_hospital?: Hospital;
}

// Review
export interface Review {
  id: string;
  booking_id: string;
  patient_id: string;
  target_type: 'doctor' | 'hospital';
  target_id: string;
  rating_booking: number;
  rating_communication: number;
  rating_punctuality: number;
  rating_clinic: number;
  rating_access: number;
  overall: number;
  comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Subscription
export interface Subscription {
  id: string;
  user_id: string;
  package_id: string;
  start_date: string;
  end_date?: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  admin_confirmed: boolean;
  created_at: string;
  package?: Package;
}

// Stats
export interface DashboardStats {
  profile_views: number;
  contact_clicks: number;
  whatsapp_clicks: number;
  bookings_count: number;
  consultations_count: number;
  hidden_requests: number;
}
