'use client';

// In-memory store with localStorage persistence for MVP demo
// Will be replaced with Supabase queries in production

const STORE_PREFIX = 'tabibak_';

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORE_PREFIX + key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORE_PREFIX + key, JSON.stringify(data));
}

// Generic CRUD operations
export function getAll<T>(key: string): T[] {
  return getStore<T>(key);
}

export function getById<T extends { id: string }>(key: string, id: string): T | undefined {
  return getStore<T>(key).find(item => item.id === id);
}

export function add<T extends { id: string }>(key: string, item: T): T {
  const items = getStore<T>(key);
  items.push(item);
  setStore(key, items);
  return item;
}

export function update<T extends { id: string }>(key: string, id: string, updates: Record<string, any>): T | undefined {
  const items = getStore<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  items[index] = { ...items[index], ...updates };
  setStore(key, items);
  return items[index];
}

export function remove<T extends { id: string }>(key: string, id: string): boolean {
  const items = getStore<T>(key);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  setStore(key, filtered);
  return true;
}

// Seed data initialization
export function initializeStore() {
  if (typeof window === 'undefined') return;
  
  const seeded = localStorage.getItem(STORE_PREFIX + '_seeded');
  if (seeded) return;

  const seedData = require('./seed-data');
  
  setStore('specialties', seedData.specialties);
  setStore('cities', seedData.cities);
  setStore('areas', seedData.areas);
  setStore('packages', seedData.packages);
  setStore('doctors', seedData.mockDoctors);
  setStore('hospitals', seedData.mockHospitals);
  setStore('bookings', seedData.mockBookings);
  setStore('consultations', seedData.mockConsultations);
  setStore('international_requests', seedData.mockInternationalRequests);
  
  // Seed admin user
  setStore('users', [
    {
      id: 'user-admin-1',
      email: 'admin@tabibak.com',
      password: 'admin123',
      name: 'مدير النظام',
      role: 'admin',
      phone: '+962 7 9999 9999',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'user-doctor-1',
      email: 'doctor1@tabibak.com',
      password: 'doctor123',
      name: seedData.mockDoctors[0].name,
      role: 'doctor',
      phone: '+962 7 7111 1111',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'user-hospital-1',
      email: 'hospital1@tabibak.com',
      password: 'hospital123',
      name: seedData.mockHospitals[0].name,
      role: 'hospital',
      phone: '+962 6 5000 000',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ]);
  
  // Seed admin user for each doctor
  const doctors = seedData.mockDoctors;
  doctors.forEach((doc: any, i: number) => {
    const users = getStore<any>('users');
    users.push({
      id: doc.user_id,
      email: `doctor${i + 1}@tabibak.com`,
      password: 'doctor123',
      name: doc.name,
      role: 'doctor',
      phone: doc.address?.split(' ')[0] || '+962 7 7000 0000',
      is_active: true,
      created_at: new Date().toISOString(),
    });
    setStore('users', users);
  });

  // Seed hospital users
  const hospitals = seedData.mockHospitals;
  hospitals.forEach((h: any) => {
    const users = getStore<any>('users');
    users.push({
      id: h.user_id,
      email: `${h.name.toLowerCase().replace(/\s+/g, '')}@tabibak.com`,
      password: 'hospital123',
      name: h.name,
      role: 'hospital',
      phone: h.phone || '+962 6 5000 000',
      is_active: true,
      created_at: new Date().toISOString(),
    });
    setStore('users', users);
  });

  localStorage.setItem(STORE_PREFIX + '_seeded', 'true');
}

// Auth utilities
export function authLogin(email: string, password: string) {
  const users = getStore<any>('users');
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...safeUser } = user;
    localStorage.setItem(STORE_PREFIX + 'current_user', JSON.stringify(safeUser));
    return safeUser;
  }
  return null;
}

export function authLogout() {
  localStorage.removeItem(STORE_PREFIX + 'current_user');
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORE_PREFIX + 'current_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

// Stats tracking
export function incrementStat(entityType: string, entityId: string, stat: string) {
  const key = `stats_${entityType}_${entityId}`;
  const stats = localStorage.getItem(key);
  const current = stats ? JSON.parse(stats) : { profile_views: 0, contact_clicks: 0, whatsapp_clicks: 0, bookings_count: 0, consultations_count: 0, hidden_requests: 0 };
  current[stat] = (current[stat] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(current));
}

export function getStats(entityType: string, entityId: string) {
  const key = `stats_${entityType}_${entityId}`;
  const stats = localStorage.getItem(key);
  return stats ? JSON.parse(stats) : { profile_views: 0, contact_clicks: 0, whatsapp_clicks: 0, bookings_count: 0, consultations_count: 0, hidden_requests: 0 };
}
