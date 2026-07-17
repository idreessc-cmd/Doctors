import { Booking } from '@/types';

// Simple in-memory storage for bookings submitted during the session (not persisted in localStorage)
export const inMemoryBookings: Booking[] = [];

export async function createBooking(booking: Omit<Booking, 'id' | 'status' | 'is_hidden_from_provider' | 'created_at' | 'updated_at'>): Promise<{ ok: boolean; message: string; bookingId: string }> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate networking delay

  const bookingId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newBooking: Booking = {
    ...booking,
    id: bookingId,
    status: 'new',
    is_hidden_from_provider: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  inMemoryBookings.push(newBooking);

  return {
    ok: true,
    message: 'تم استلام طلب الحجز بنجاح! هذا نموذج تجريبي في المرحلة الأولى، وسيقوم فريقنا أو الطبيب بالتواصل معك قريباً لتأكيد الموعد.',
    bookingId
  };
}

export async function getProviderBookings(providerId: string, providerType: 'doctor' | 'hospital'): Promise<Booking[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return inMemoryBookings.filter(b => 
    b.target_type === providerType && 
    (providerType === 'doctor' ? b.doctor_id === providerId : b.hospital_id === providerId)
  );
}
