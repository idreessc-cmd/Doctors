-- =============================================================
-- Supabase Initial Production MVP Schema
-- Date: 2026-07-04
-- Purpose: Foundation for doctors/hospitals marketplace MVP
-- =============================================================

create extension if not exists pgcrypto;

-- =============================================================
-- Helper functions
-- =============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.is_active = true
  );
$$;

create or replace function public.provider_monthly_lead_count(
  p_target_type text,
  p_target_id uuid
)
returns bigint
language sql
stable
as $$
  select count(*)::bigint
  from public.contact_leads cl
  where cl.created_at >= date_trunc('month', now())
    and cl.created_at < date_trunc('month', now()) + interval '1 month'
    and cl.target_type = p_target_type
    and (
      (p_target_type = 'doctor' and cl.doctor_id = p_target_id)
      or (p_target_type = 'hospital' and cl.hospital_id = p_target_id)
    );
$$;

create or replace function public.refresh_contact_lead_visibility()
returns trigger
language plpgsql
as $$
declare
  v_provider_profile_id uuid;
  v_provider_package_id uuid;
  v_package_tier text;
  v_contact_limit integer;
  v_current_month_count bigint;
begin
  if new.target_type = 'doctor' then
    select owner_id
    into v_provider_profile_id
    from public.doctors
    where id = new.doctor_id;
  elsif new.target_type = 'hospital' then
    select owner_id
    into v_provider_profile_id
    from public.hospitals
    where id = new.hospital_id;
  else
    v_provider_profile_id := null;
  end if;

  if v_provider_profile_id is null then
    new.is_visible_to_provider := false;
    new.hidden_reason := 'no linked provider';
    return new;
  end if;

  if new.target_type = 'doctor' then
    select package_id
    into v_provider_package_id
    from public.doctors
    where id = new.doctor_id;
  elsif new.target_type = 'hospital' then
    select package_id
    into v_provider_package_id
    from public.hospitals
    where id = new.hospital_id;
  else
    v_provider_package_id := null;
  end if;

  if v_provider_package_id is null then
    new.is_visible_to_provider := false;
    new.hidden_reason := 'no package assigned';
    return new;
  end if;

  select tier, contact_limit
  into v_package_tier, v_contact_limit
  from public.packages
  where id = v_provider_package_id;

  v_current_month_count := public.provider_monthly_lead_count(new.target_type, new.doctor_id)
    ;

  if new.target_type = 'hospital' then
    v_current_month_count := public.provider_monthly_lead_count(new.target_type, new.hospital_id);
  end if;

  if coalesce(v_package_tier, 'free') = 'free' then
    if v_current_month_count < 3 then
      new.is_visible_to_provider := true;
      new.hidden_reason := null;
    else
      new.is_visible_to_provider := false;
      new.hidden_reason := 'free plan monthly lead limit reached';
    end if;
  elsif v_package_tier in ('premium', 'vip', 'international') then
    if v_contact_limit is null or v_contact_limit <= 0 then
      new.is_visible_to_provider := true;
      new.hidden_reason := null;
    elsif v_current_month_count < v_contact_limit then
      new.is_visible_to_provider := true;
      new.hidden_reason := null;
    else
      new.is_visible_to_provider := false;
      new.hidden_reason := 'package monthly lead limit reached';
    end if;
  else
    new.is_visible_to_provider := false;
    new.hidden_reason := 'unknown package tier';
  end if;

  return new;
end;
$$;

-- =============================================================
-- Core tables
-- =============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'patient' check (role in ('admin','doctor','hospital','patient')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  type text not null check (type in ('doctor','hospital')),
  tier text not null check (tier in ('free','premium','vip','international')),
  price_jod numeric(10,2) not null default 0,
  contact_limit integer not null default 0,
  ranking_boost integer not null default 0,
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  logo_url text,
  cover_url text,
  description_ar text,
  description_en text,
  address_ar text,
  address_en text,
  phone text,
  whatsapp text,
  website text,
  rank text not null default 'standard' check (rank in ('standard','verified','premium','vip')),
  is_verified boolean not null default false,
  accepts_international_patients boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  specialty_id uuid references public.specialties(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  full_name_ar text not null,
  full_name_en text not null,
  slug text not null unique,
  title_ar text,
  title_en text,
  bio_ar text,
  bio_en text,
  consultation_fee_jod numeric(10,2) not null default 0,
  experience_years integer not null default 0,
  gender text check (gender in ('male','female','other')),
  phone text,
  whatsapp text,
  address_ar text,
  address_en text,
  profile_image_url text,
  rank text not null default 'standard' check (rank in ('standard','verified','premium','vip')),
  rating numeric(2,1) not null default 0,
  is_verified boolean not null default false,
  accepts_booking boolean not null default true,
  accepts_consultation boolean not null default true,
  accepts_international_patients boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending','active','expired','cancelled')),
  start_date timestamptz not null default now(),
  end_date timestamptz,
  payment_method text,
  payment_status text not null default 'pending' check (payment_status in ('pending','completed','failed')),
  admin_confirmed_by uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('doctor','hospital')),
  doctor_id uuid references public.doctors(id) on delete set null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  patient_whatsapp text,
  preferred_date date not null,
  preferred_time text not null,
  notes text,
  status text not null default 'new' check (status in ('new','confirmed','rejected','completed','cancelled')),
  is_hidden_from_provider boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.international_requests (
  id uuid primary key default gen_random_uuid(),
  target_type text check (target_type in ('doctor','hospital','general')),
  doctor_id uuid references public.doctors(id) on delete set null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  patient_name text not null,
  country text not null,
  phone text not null,
  whatsapp text,
  email text,
  age integer,
  gender text check (gender in ('male','female','other')),
  condition_description text not null,
  specialty_id uuid references public.specialties(id) on delete set null,
  budget_range text,
  needs_hotel boolean not null default false,
  needs_translator boolean not null default false,
  needs_airport_pickup boolean not null default false,
  consent_to_share boolean not null default false,
  status text not null default 'new' check (status in ('new','under_review','contacted','sent_to_doctor','sent_to_hospital','waiting_reply','completed','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('doctor','hospital')),
  doctor_id uuid references public.doctors(id) on delete set null,
  hospital_id uuid references public.hospitals(id) on delete set null,
  lead_type text not null check (lead_type in ('phone','whatsapp','booking','consultation','international_request')),
  patient_name text,
  patient_phone text,
  patient_whatsapp text,
  is_visible_to_provider boolean not null default false,
  hidden_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================
-- Indexes
-- =============================================================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_is_active on public.profiles(is_active);

create index if not exists idx_cities_slug on public.cities(slug);
create index if not exists idx_specialties_slug on public.specialties(slug);
create index if not exists idx_packages_type on public.packages(type);
create index if not exists idx_packages_tier on public.packages(tier);

create index if not exists idx_hospitals_owner on public.hospitals(owner_id);
create index if not exists idx_hospitals_city on public.hospitals(city_id);
create index if not exists idx_hospitals_active on public.hospitals(is_active);
create index if not exists idx_hospitals_slug on public.hospitals(slug);

create index if not exists idx_doctors_owner on public.doctors(owner_id);
create index if not exists idx_doctors_hospital on public.doctors(hospital_id);
create index if not exists idx_doctors_specialty on public.doctors(specialty_id);
create index if not exists idx_doctors_city on public.doctors(city_id);
create index if not exists idx_doctors_active on public.doctors(is_active);
create index if not exists idx_doctors_slug on public.doctors(slug);

create index if not exists idx_subscriptions_profile on public.subscriptions(profile_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

create index if not exists idx_bookings_target on public.bookings(target_type);
create index if not exists idx_bookings_doctor on public.bookings(doctor_id);
create index if not exists idx_bookings_hospital on public.bookings(hospital_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_created_at on public.bookings(created_at desc);

create index if not exists idx_international_requests_status on public.international_requests(status);
create index if not exists idx_international_requests_doctor on public.international_requests(doctor_id);
create index if not exists idx_international_requests_hospital on public.international_requests(hospital_id);
create index if not exists idx_international_requests_created_at on public.international_requests(created_at desc);

create index if not exists idx_contact_leads_target on public.contact_leads(target_type);
create index if not exists idx_contact_leads_provider_visibility on public.contact_leads(is_visible_to_provider);
create index if not exists idx_contact_leads_created_at on public.contact_leads(created_at desc);

-- =============================================================
-- Triggers for updated_at
-- =============================================================

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_cities_updated_at
before update on public.cities
for each row execute function public.set_updated_at();

create trigger trg_specialties_updated_at
before update on public.specialties
for each row execute function public.set_updated_at();

create trigger trg_packages_updated_at
before update on public.packages
for each row execute function public.set_updated_at();

create trigger trg_hospitals_updated_at
before update on public.hospitals
for each row execute function public.set_updated_at();

create trigger trg_doctors_updated_at
before update on public.doctors
for each row execute function public.set_updated_at();

create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger trg_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create trigger trg_international_requests_updated_at
before update on public.international_requests
for each row execute function public.set_updated_at();

create trigger trg_contact_leads_updated_at
before update on public.contact_leads
for each row execute function public.set_updated_at();

create trigger trg_contact_lead_visibility
before insert on public.contact_leads
for each row execute function public.refresh_contact_lead_visibility();

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.specialties enable row level security;
alter table public.packages enable row level security;
alter table public.hospitals enable row level security;
alter table public.doctors enable row level security;
alter table public.subscriptions enable row level security;
alter table public.bookings enable row level security;
alter table public.international_requests enable row level security;
alter table public.contact_leads enable row level security;

-- Profiles
create policy "Profiles are viewable by owner and admin"
  on public.profiles
  for select
  using (id = auth.uid() or public.is_admin_user());

create policy "Profiles are updatable by owner and admin"
  on public.profiles
  for update
  using (id = auth.uid() or public.is_admin_user())
  with check (id = auth.uid() or public.is_admin_user());

create policy "Profiles can be inserted by owner"
  on public.profiles
  for insert
  with check (id = auth.uid());

-- Cities
create policy "Public can read active cities"
  on public.cities
  for select
  using (is_active = true);

create policy "Admins can manage cities"
  on public.cities
  for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Specialties
create policy "Public can read active specialties"
  on public.specialties
  for select
  using (is_active = true);

create policy "Admins can manage specialties"
  on public.specialties
  for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Packages
create policy "Public can read active packages"
  on public.packages
  for select
  using (is_active = true);

create policy "Admins can manage packages"
  on public.packages
  for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

-- Hospitals
create policy "Public can read active hospitals"
  on public.hospitals
  for select
  using (is_active = true);

create policy "Hospitals can manage own hospital profile"
  on public.hospitals
  for all
  using (owner_id = auth.uid() or public.is_admin_user())
  with check (owner_id = auth.uid() or public.is_admin_user());

-- Doctors
create policy "Public can read active doctors"
  on public.doctors
  for select
  using (is_active = true);

create policy "Doctors can manage own doctor profile"
  on public.doctors
  for all
  using (owner_id = auth.uid() or public.is_admin_user())
  with check (owner_id = auth.uid() or public.is_admin_user());

-- Subscriptions
create policy "Users can read own subscriptions"
  on public.subscriptions
  for select
  using (profile_id = auth.uid() or public.is_admin_user());

create policy "Users can create own subscriptions"
  on public.subscriptions
  for insert
  with check (profile_id = auth.uid() or public.is_admin_user());

create policy "Admins can manage subscriptions"
  on public.subscriptions
  for update
  using (public.is_admin_user());

-- Bookings
create policy "Public can create bookings"
  on public.bookings
  for insert
  with check (true);

create policy "Admins and linked providers can read bookings"
  on public.bookings
  for select
  using (
    public.is_admin_user()
    or (
      target_type = 'doctor' and exists (
        select 1 from public.doctors d
        where d.id = bookings.doctor_id
          and d.owner_id = auth.uid()
      )
    )
    or (
      target_type = 'hospital' and exists (
        select 1 from public.hospitals h
        where h.id = bookings.hospital_id
          and h.owner_id = auth.uid()
      )
    )
  );

-- International requests
create policy "Public can create international requests"
  on public.international_requests
  for insert
  with check (true);

create policy "Admins and linked providers can read international requests"
  on public.international_requests
  for select
  using (
    public.is_admin_user()
    or (
      target_type = 'doctor' and exists (
        select 1 from public.doctors d
        where d.id = international_requests.doctor_id
          and d.owner_id = auth.uid()
      )
    )
    or (
      target_type = 'hospital' and exists (
        select 1 from public.hospitals h
        where h.id = international_requests.hospital_id
          and h.owner_id = auth.uid()
      )
    )
  );

-- Contact leads
create policy "Public can create contact leads"
  on public.contact_leads
  for insert
  with check (true);

create policy "Admins can read all contact leads"
  on public.contact_leads
  for select
  using (public.is_admin_user());

create policy "Providers can read only visible own leads"
  on public.contact_leads
  for select
  using (
    is_visible_to_provider = true and (
      (target_type = 'doctor' and exists (
        select 1 from public.doctors d
        where d.id = contact_leads.doctor_id
          and d.owner_id = auth.uid()
      ))
      or
      (target_type = 'hospital' and exists (
        select 1 from public.hospitals h
        where h.id = contact_leads.hospital_id
          and h.owner_id = auth.uid()
      ))
    )
  );

-- =============================================================
-- Seed data
-- =============================================================

insert into public.cities (name_ar, name_en, slug) values
  ('عمان', 'Amman', 'amman'),
  ('إربد', 'Irbid', 'irbid'),
  ('الزرقاء', 'Zarqa', 'zarqa'),
  ('العقبة', 'Aqaba', 'aqaba'),
  ('السلط', 'Salt', 'salt')
  on conflict (slug) do nothing;

insert into public.specialties (name_ar, name_en, slug, icon) values
  ('قلب وأوعية دموية', 'Cardiology', 'cardiology', 'heart'),
  ('جلدية', 'Dermatology', 'dermatology', 'skin'),
  ('عظام ومفاصل', 'Orthopedics', 'orthopedics', 'bone'),
  ('طب العيون', 'Ophthalmology', 'ophthalmology', 'eye'),
  ('أنف وأذن وحنجرة', 'ENT', 'ent', 'ear'),
  ('طب أطفال', 'Pediatrics', 'pediatrics', 'baby'),
  ('نسائية وتوليد', 'Gynecology', 'gynecology', 'female'),
  ('طب أعصاب', 'Neurology', 'neurology', 'brain'),
  ('جراحة عامة', 'General Surgery', 'general-surgery', 'scalpel'),
  ('طب أسنان', 'Dentistry', 'dentistry', 'tooth')
  on conflict (slug) do nothing;

insert into public.packages (name_ar, name_en, type, tier, price_jod, contact_limit, ranking_boost, features) values
  ('مجاني', 'Free', 'doctor', 'free', 0.00, 3, 0, '["عرض أساسي","3 leads شهريًا"]'::jsonb),
  ('مميز', 'Premium', 'doctor', 'premium', 29.99, 50, 20, '["ظهور أعلى","شارة مميز","إحصائيات"]'::jsonb),
  ('VIP', 'VIP', 'doctor', 'vip', 79.99, 999, 50, '["ظهور أعلى","شارة VIP","إحصائيات متقدمة"]'::jsonb),
  ('أساسي', 'Basic', 'hospital', 'free', 49.99, 20, 10, '["صفحة مستشفى أساسية","عرض الأطباء"]'::jsonb),
  ('مميز', 'Premium', 'hospital', 'premium', 149.99, 100, 30, '["ظهور أعلى","طلبات دولية","إحصائيات"]'::jsonb),
  ('International Partner', 'International Partner', 'hospital', 'international', 249.99, 999, 60, '["ظهور مميز","طلبات دولية واسعة","أفضل ترقية"]'::jsonb)
  on conflict do nothing;

insert into public.hospitals (
  name_ar, name_en, slug, city_id, package_id, description_ar, description_en, address_ar, address_en, phone, whatsapp, website, rank, is_verified, accepts_international_patients, is_active
)
select
  'مستشفى الأردن', 'Jordan Hospital', 'jordan-hospital', c.id, p.id, 'مستشفى رائد في الأردن', 'Leading hospital in Jordan', 'عبدلي، عمان', 'Abdali, Amman', '+962 6 5000 000', '+962 790000000', 'https://jordan-hospital.example', 'verified', true, true, true
from public.cities c
join public.packages p on p.type = 'hospital' and p.tier = 'premium'
where c.slug = 'amman';

insert into public.hospitals (
  name_ar, name_en, slug, city_id, package_id, description_ar, description_en, address_ar, address_en, phone, whatsapp, website, rank, is_verified, accepts_international_patients, is_active
)
select
  'مستشفى البشير', 'Al-Bashir Hospital', 'al-bashir-hospital', c.id, p.id, 'مستشفى متخصص يقدم خدمات طبية متقدمة', 'Specialized hospital offering advanced medical services', 'شارع الملك عبدالله', 'King Abdullah Street', '+962 6 5666 000', '+962 799999999', 'https://albashir.example', 'premium', true, true, true
from public.cities c
join public.packages p on p.type = 'hospital' and p.tier = 'international'
where c.slug = 'amman';

insert into public.doctors (
  full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, phone, whatsapp, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active
)
select
  'د. أحمد الحسن', 'Dr. Ahmed Al-Hassan', 'dr-ahmed-al-hassan', 'أخصائي قلب', 'Cardiology Specialist', s.id, c.id, p.id, 35.00, 15, 'male', '+962 770000001', '+962 770000001', 'عبدلي، عمان', 'Abdali, Amman', 'verified', true, true, true, true, true
from public.specialties s
join public.cities c on c.slug = 'amman'
join public.packages p on p.type = 'doctor' and p.tier = 'premium'
where s.slug = 'cardiology';

insert into public.doctors (
  full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, phone, whatsapp, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active
)
select
  'د. سارة الخطيب', 'Dr. Sara Al-Khatib', 'dr-sara-al-khatib', 'أخصائية جلدية', 'Dermatology Specialist', s.id, c.id, p.id, 25.00, 10, 'female', '+962 770000002', '+962 770000002', 'الشمساني، عمان', 'Shmeisani, Amman', 'premium', true, true, true, true, true
from public.specialties s
join public.cities c on c.slug = 'amman'
join public.packages p on p.type = 'doctor' and p.tier = 'vip'
where s.slug = 'dermatology';

insert into public.doctors (
  full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, phone, whatsapp, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active
)
select
  'د. خالد العبدالله', 'Dr. Khaled Abdullah', 'dr-khaled-abdullah', 'أخصائي عظام', 'Orthopedic Specialist', s.id, c.id, p.id, 30.00, 12, 'male', '+962 770000003', '+962 770000003', 'العبدلي، عمان', 'Abdali, Amman', 'standard', false, true, true, false, true
from public.specialties s
join public.cities c on c.slug = 'amman'
join public.packages p on p.type = 'doctor' and p.tier = 'free'
where s.slug = 'orthopedics';

insert into public.doctors (
  full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, phone, whatsapp, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active
)
select
  'د. ليلى المومني', 'Dr. Layla Al-Momani', 'dr-layla-al-momani', 'أخصائية نسائية', 'Gynecology Specialist', s.id, c.id, p.id, 28.00, 9, 'female', '+962 770000004', '+962 770000004', 'جبل الحسين، عمان', 'Jabal Hussein, Amman', 'verified', true, true, true, true, true
from public.specialties s
join public.cities c on c.slug = 'amman'
join public.packages p on p.type = 'doctor' and p.tier = 'premium'
where s.slug = 'gynecology';

insert into public.doctors (
  full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, phone, whatsapp, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active
)
select
  'د. هدى السالم', 'Dr. Huda Al-Salem', 'dr-huda-al-salem', 'أخصائية طب أطفال', 'Pediatric Specialist', s.id, c.id, p.id, 22.00, 8, 'female', '+962 770000005', '+962 770000005', 'الرمثا، إربد', 'Ramtha, Irbid', 'standard', false, true, true, false, true
from public.specialties s
join public.cities c on c.slug = 'irbid'
join public.packages p on p.type = 'doctor' and p.tier = 'free'
where s.slug = 'pediatrics';

-- =============================================================
-- Admin creation instructions
-- =============================================================
-- 1. Create an auth user in Supabase Auth (email/password or magic link).
-- 2. Then insert a matching profile row:
--
-- insert into public.profiles (id, full_name, phone, role, is_active)
-- values (
--   '<auth-user-id>',
--   'System Administrator',
--   '+962 790000000',
--   'admin',
--   true
-- );
--
-- 3. After that, the admin can manage all tables via RLS.

