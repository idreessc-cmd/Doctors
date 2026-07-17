import { Hospital, Doctor } from '@/types';
import { mockHospitals } from '@/data/mock/hospitals';
import { mockDoctors } from '@/data/mock/doctors';
import { mockCities } from '@/data/mock/cities';
import { mockPackages } from '@/data/mock/packages';
import { mockProviderContacts } from '@/data/mock/provider-contacts';
import { inMemoryLeads } from './doctors';

export interface HospitalFilter {
  citySlug?: string;
  searchQuery?: string;
}

export async function getAllHospitals(filter?: HospitalFilter): Promise<Hospital[]> {
  await new Promise(resolve => setTimeout(resolve, 50));

  let results = [...mockHospitals].filter(h => h.is_active && !h.deleted_at);

  if (filter) {
    if (filter.citySlug) {
      const city = mockCities.find(c => c.slug === filter.citySlug);
      if (city) {
        results = results.filter(h => h.city_id === city.id);
      } else {
        return [];
      }
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase().trim();
      results = results.filter(h => 
        h.name_ar.includes(query) || 
        h.name_en.toLowerCase().includes(query)
      );
    }
  }

  // Sort hospitals by package ranking boost
  results.sort((a, b) => {
    const getPackageScore = (pkgId: string | null) => {
      const pkg = mockPackages.find(p => p.id === pkgId);
      if (!pkg) return 0;
      if (pkg.tier === 'international') return 300;
      if (pkg.tier === 'premium') return 200;
      return 100;
    };
    return getPackageScore(b.package_id) - getPackageScore(a.package_id);
  });

  return results;
}

export async function getHospitalBySlug(slug: string): Promise<Hospital | null> {
  await new Promise(resolve => setTimeout(resolve, 30));
  const hosp = mockHospitals.find(h => h.slug === slug && h.is_active && !h.deleted_at);
  return hosp || null;
}

export async function getHospitalById(id: string): Promise<Hospital | null> {
  const hosp = mockHospitals.find(h => h.id === id && h.is_active && !h.deleted_at);
  return hosp || null;
}

export async function getHospitalDoctors(hospitalId: string): Promise<Doctor[]> {
  await new Promise(resolve => setTimeout(resolve, 30));
  return mockDoctors.filter(d => d.hospital_id === hospitalId && d.is_active && !d.deleted_at);
}

export async function getHospitalContact(
  hospitalId: string,
  leadType: 'phone' | 'whatsapp' | 'booking' | 'international_request',
  patientName?: string,
  patientPhone?: string
): Promise<{ phone: string | null; whatsapp: string | null; website: string | null; isDirectAllowed: boolean }> {
  
  const hospital = mockHospitals.find(h => h.id === hospitalId);
  if (!hospital) throw new Error('Hospital not found');

  const pkg = mockPackages.find(p => p.id === hospital.package_id);
  const allowDirect = pkg ? pkg.allow_direct_contact : false;
  const leadLimit = pkg ? pkg.contact_limit : 20;

  const currentMonthCount = inMemoryLeads.filter(l => l.hospital_id === hospitalId).length;
  
  let isVisible = false;
  let hiddenReason = null;

  if (pkg?.tier === 'free') {
    if (currentMonthCount < 20) {
      isVisible = true;
    } else {
      isVisible = false;
      hiddenReason = 'basic plan monthly limit reached';
    }
  } else {
    if (currentMonthCount < leadLimit) {
      isVisible = true;
    } else {
      isVisible = false;
      hiddenReason = 'plan monthly limit reached';
    }
  }

  // Create lead in memory
  inMemoryLeads.push({
    id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    target_type: 'hospital',
    doctor_id: null,
    hospital_id: hospitalId,
    lead_type: leadType,
    patient_name: patientName || 'Visitor',
    patient_phone: patientPhone || '+962790000000',
    patient_whatsapp: null,
    is_visible_to_provider: isVisible,
    hidden_reason: hiddenReason,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const contacts = mockProviderContacts.find(c => c.hospital_id === hospitalId);
  const phone = contacts ? contacts.phone : null;
  const whatsapp = contacts ? contacts.whatsapp : null;
  const website = contacts ? contacts.website : null;

  if (allowDirect) {
    return { phone, whatsapp, website, isDirectAllowed: true };
  } else {
    return { phone: null, whatsapp: null, website, isDirectAllowed: false };
  }
}
