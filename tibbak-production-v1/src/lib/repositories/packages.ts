import { Package } from '@/types';
import { mockPackages } from '@/data/mock/packages';

export async function getDoctorPackages(): Promise<Package[]> {
  await new Promise(resolve => setTimeout(resolve, 30));
  return mockPackages.filter(p => p.type === 'doctor' && p.is_active && !p.deleted_at);
}

export async function getHospitalPackages(): Promise<Package[]> {
  await new Promise(resolve => setTimeout(resolve, 30));
  return mockPackages.filter(p => p.type === 'hospital' && p.is_active && !p.deleted_at);
}

export async function getPackageById(id: string): Promise<Package | null> {
  const pkg = mockPackages.find(p => p.id === id && p.is_active && !p.deleted_at);
  return pkg || null;
}
