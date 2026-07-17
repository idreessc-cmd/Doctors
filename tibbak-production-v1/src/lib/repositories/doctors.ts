import { Doctor, ContactLead } from '@/types';
import { mockDoctors } from '@/data/mock/doctors';
import { mockSpecialties } from '@/data/mock/specialties';
import { mockCities } from '@/data/mock/cities';
import { mockPackages } from '@/data/mock/packages';
import { mockProviderContacts } from '@/data/mock/provider-contacts';

// Simple global in-memory leads array to simulate leads tracking and limit checks
export const inMemoryLeads: ContactLead[] = [];

export interface DoctorFilter {
  specialtySlug?: string;
  citySlug?: string;
  gender?: 'male' | 'female';
  feesRange?: 'under_20' | '20_40' | 'above_40';
  rank?: 'verified' | 'premium' | 'vip';
  searchQuery?: string;
}

export interface DoctorSort {
  sortBy?: 'ranking' | 'rating' | 'experience' | 'fees_asc' | 'fees_desc';
}

export async function getAllDoctors(filter?: DoctorFilter, sort?: DoctorSort): Promise<Doctor[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 50));

  let results = [...mockDoctors].filter(d => d.is_active && !d.deleted_at);

  if (filter) {
    if (filter.specialtySlug) {
      const specialty = mockSpecialties.find(s => s.slug === filter.specialtySlug);
      if (specialty) {
        results = results.filter(d => d.specialty_id === specialty.id);
      } else {
        return []; // specialty not found
      }
    }

    if (filter.citySlug) {
      const city = mockCities.find(c => c.slug === filter.citySlug);
      if (city) {
        results = results.filter(d => d.city_id === city.id);
      } else {
        return [];
      }
    }

    if (filter.gender) {
      results = results.filter(d => d.gender === filter.gender);
    }

    if (filter.feesRange) {
      if (filter.feesRange === 'under_20') {
        results = results.filter(d => d.consultation_fee_jod < 20);
      } else if (filter.feesRange === '20_40') {
        results = results.filter(d => d.consultation_fee_jod >= 20 && d.consultation_fee_jod <= 40);
      } else if (filter.feesRange === 'above_40') {
        results = results.filter(d => d.consultation_fee_jod > 40);
      }
    }

    if (filter.rank) {
      results = results.filter(d => d.rank === filter.rank);
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase().trim();
      results = results.filter(d => 
        d.full_name_ar.includes(query) || 
        d.full_name_en.toLowerCase().includes(query) ||
        (d.title_ar && d.title_ar.includes(query)) ||
        (d.title_en && d.title_en.toLowerCase().includes(query))
      );
    }
  }

  // Handle sorting
  const sortBy = sort?.sortBy || 'ranking';
  results.sort((a, b) => {
    // Basic sorting ranking calculation: packages first (vip=3, premium=2, verified/standard=1)
    const getPackageScore = (pkgId: string | null) => {
      const pkg = mockPackages.find(p => p.id === pkgId);
      if (!pkg) return 0;
      if (pkg.tier === 'vip') return 300;
      if (pkg.tier === 'premium') return 200;
      return 100;
    };

    if (sortBy === 'ranking') {
      const scoreA = getPackageScore(a.package_id) + a.experience_years;
      const scoreB = getPackageScore(b.package_id) + b.experience_years;
      return scoreB - scoreA; // highest score first
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'experience') {
      return b.experience_years - a.experience_years;
    }
    if (sortBy === 'fees_asc') {
      return a.consultation_fee_jod - b.consultation_fee_jod;
    }
    if (sortBy === 'fees_desc') {
      return b.consultation_fee_jod - a.consultation_fee_jod;
    }
    return 0;
  });

  return results;
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  await new Promise(resolve => setTimeout(resolve, 30));
  const doc = mockDoctors.find(d => d.slug === slug && d.is_active && !d.deleted_at);
  return doc || null;
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const doc = mockDoctors.find(d => d.id === id && d.is_active && !d.deleted_at);
  return doc || null;
}

// SECURE RPC SIMULATION: clicks on doctor phone/whatsapp
export async function getDoctorContact(
  doctorId: string,
  leadType: 'phone' | 'whatsapp' | 'booking' | 'consultation' | 'international_request',
  patientName?: string,
  patientPhone?: string
): Promise<{ phone: string | null; whatsapp: string | null; website: string | null; isDirectAllowed: boolean }> {
  
  const doctor = mockDoctors.find(d => d.id === doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const pkg = mockPackages.find(p => p.id === doctor.package_id);
  const allowDirect = pkg ? pkg.allow_direct_contact : false;
  const leadLimit = pkg ? pkg.contact_limit : 3;

  // Calculate current month lead count in memory
  const currentMonthCount = inMemoryLeads.filter(l => l.doctor_id === doctorId).length;
  
  // Decide visibility
  let isVisible = false;
  let hiddenReason = null;

  if (pkg?.tier === 'free') {
    if (currentMonthCount < 3) {
      isVisible = true;
    } else {
      isVisible = false;
      hiddenReason = 'free plan monthly limit reached';
    }
  } else {
    if (currentMonthCount < leadLimit) {
      isVisible = true;
    } else {
      isVisible = false;
      hiddenReason = 'plan monthly limit reached';
    }
  }

  // Create lead in-memory
  const newLead: ContactLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    target_type: 'doctor',
    doctor_id: doctorId,
    hospital_id: null,
    lead_type: leadType,
    patient_name: patientName || 'Visitor',
    patient_phone: patientPhone || '+962790000000',
    patient_whatsapp: null,
    is_visible_to_provider: isVisible,
    hidden_reason: hiddenReason,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  inMemoryLeads.push(newLead);

  // Fetch actual credentials from secure store
  const contacts = mockProviderContacts.find(c => c.doctor_id === doctorId);
  const phone = contacts ? contacts.phone : null;
  const whatsapp = contacts ? contacts.whatsapp : null;
  const website = contacts ? contacts.website : null;

  if (allowDirect) {
    return { phone, whatsapp, website, isDirectAllowed: true };
  } else {
    // If not allowed direct contact (e.g. Free package), we hide the numbers to the visitor
    return { phone: null, whatsapp: null, website, isDirectAllowed: false };
  }
}
