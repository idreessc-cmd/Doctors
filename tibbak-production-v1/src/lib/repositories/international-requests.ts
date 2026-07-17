import { InternationalRequest } from '@/types';

export const inMemoryIntlRequests: InternationalRequest[] = [];

export async function createInternationalRequest(
  request: Omit<InternationalRequest, 'id' | 'status' | 'created_at' | 'updated_at'>
): Promise<{ ok: boolean; message: string; requestId: string }> {
  await new Promise(resolve => setTimeout(resolve, 600));

  const requestId = `intl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newRequest: InternationalRequest = {
    ...request,
    id: requestId,
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  inMemoryIntlRequests.push(newRequest);

  return {
    ok: true,
    message: 'تم استلام طلب العلاج وسياحتك العلاجية بنجاح! هذا نموذج تجريبي في المرحلة الأولى، وسيتواصل معك منسق الرعاية الطبية لدينا قريباً لتقديم عروض الأسعار والخيارات المتاحة.',
    requestId
  };
}

export async function getProviderInternationalRequests(providerId: string, providerType: 'doctor' | 'hospital'): Promise<InternationalRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return inMemoryIntlRequests.filter(r => 
    r.target_type === providerType && 
    (providerType === 'doctor' ? r.doctor_id === providerId : r.hospital_id === providerId)
  );
}
