import { ProviderContact } from '@/types';

export const mockProviderContacts: ProviderContact[] = [
  {
    id: 'contact-ahmed',
    provider_type: 'doctor',
    doctor_id: 'da55c6ff-9311-4eb2-a6f9-711111111111',
    hospital_id: null,
    phone: '+962770000001',
    whatsapp: '+962770000001',
    website: 'https://drahmedcardio.example',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'contact-sara',
    provider_type: 'doctor',
    doctor_id: 'da55c6ff-9311-4eb2-a6f9-722222222222',
    hospital_id: null,
    phone: '+962770000002',
    whatsapp: '+962770000002',
    website: 'https://drsaraskin.example',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'contact-khaled',
    provider_type: 'doctor',
    doctor_id: 'da55c6ff-9311-4eb2-a6f9-733333333333',
    hospital_id: null,
    phone: '+962770000003',
    whatsapp: '+962770000003',
    website: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'contact-jordan-hospital',
    provider_type: 'hospital',
    doctor_id: null,
    hospital_id: 'df9c3c0c-8066-4fbf-97f3-4a1111111111',
    phone: '+96265608080',
    whatsapp: '+962790000100',
    website: 'https://www.jordan-hospital.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'contact-khalidi-hospital',
    provider_type: 'hospital',
    doctor_id: null,
    hospital_id: 'df9c3c0c-8066-4fbf-97f3-4a2222222222',
    phone: '+96264644281',
    whatsapp: '+962790000200',
    website: 'https://www.khalidi-hospital.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
