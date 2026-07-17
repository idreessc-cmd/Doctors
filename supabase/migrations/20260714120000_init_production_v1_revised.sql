-- =============================================================
-- Supabase Revised Production MVP V1 Database Schema & RLS
-- Date: 2026-07-14
-- Project: Tibbak (طبّك)
-- File: 20260714120000_init_production_v1_revised.sql
-- =============================================================

create extension if not exists pgcrypto;

-- =============================================================
-- 1. Core Helper functions (SECURITY DEFINER + search_path)
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
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.is_active = true
      and p.deleted_at is null
  );
$$;

create or replace function public.provider_monthly_lead_count(
  p_target_type text,
  p_target_id uuid
)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.contact_leads cl
  where cl.created_at >= date_trunc('month', now())
    and cl.created_at < date_trunc('month', now()) + interval '1 month'
    and cl.target_type = p_target_type
    and cl.deleted_at is null
    and (
      (p_target_type = 'doctor' and cl.doctor_id = p_target_id)
      or (p_target_type = 'hospital' and cl.hospital_id = p_target_id)
    );
$$;

-- =============================================================
-- 2. Core Tables
-- =============================================================

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'patient' check (role in ('admin','doctor','hospital','patient')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Cities
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Specialties
create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Packages
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  type text not null check (type in ('doctor','hospital')),
  tier text not null check (tier in ('free','premium','vip','international')),
  price_jod numeric(10,2) not null default 0,
  contact_limit integer not null default 0,
  ranking_boost integer not null default 0,
  allow_direct_contact boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint unique_type_tier unique (type, tier)
);

-- Hospitals (Removed Phone/WhatsApp)
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
  rank text not null default 'standard' check (rank in ('standard','verified','premium','vip')),
  is_verified boolean not null default false,
  accepts_international_patients boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Doctors (Removed Phone/WhatsApp)
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
  gender text check (gender in ('male','female')),
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
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Provider Contacts (Securely Stores Phone/WhatsApp/Website)
create table if not exists public.provider_contacts (
  id uuid primary key default gen_random_uuid(),
  provider_type text not null check (provider_type in ('doctor', 'hospital')),
  doctor_id uuid references public.doctors(id) on delete cascade,
  hospital_id uuid references public.hospitals(id) on delete cascade,
  phone text,
  whatsapp text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_provider_contacts_ids check (
    (provider_type = 'doctor' and doctor_id is not null and hospital_id is null)
    or
    (provider_type = 'hospital' and hospital_id is not null and doctor_id is null)
  ),
  constraint unique_doctor_contact unique (doctor_id),
  constraint unique_hospital_contact unique (hospital_id)
);

-- Many-to-Many: Doctor Specialties
create table if not exists public.doctor_specialties (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint unique_doctor_specialty unique (doctor_id, specialty_id)
);

-- Many-to-Many: Hospital Specialties
create table if not exists public.hospital_specialties (
  id uuid primary key default gen_random_uuid(),
  hospital_id uuid not null references public.hospitals(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint unique_hospital_specialty unique (hospital_id, specialty_id)
);

-- Subscriptions
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
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Bookings (Added target_type constraint)
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
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint check_bookings_target check (
    (target_type = 'doctor' and doctor_id is not null and hospital_id is null)
    or
    (target_type = 'hospital' and hospital_id is not null and doctor_id is null)
  )
);

-- International requests (Added target_type constraint)
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
  gender text check (gender in ('male','female')),
  condition_description text not null,
  specialty_id uuid references public.specialties(id) on delete set null,
  budget_range text,
  needs_hotel boolean not null default false,
  needs_translator boolean not null default false,
  needs_airport_pickup boolean not null default false,
  consent_to_share boolean not null default false,
  status text not null default 'new' check (status in ('new','under_review','contacted','sent_to_doctor','sent_to_hospital','waiting_reply','completed','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint check_intl_requests_target check (
    (target_type = 'doctor' and doctor_id is not null and hospital_id is null)
    or
    (target_type = 'hospital' and hospital_id is not null and doctor_id is null)
    or
    (target_type = 'general' and doctor_id is null and hospital_id is null)
  )
);

-- Contact Leads (Added target_type constraint)
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
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint check_contact_leads_target check (
    (target_type = 'doctor' and doctor_id is not null and hospital_id is null)
    or
    (target_type = 'hospital' and hospital_id is not null and doctor_id is null)
  )
);

-- =============================================================
-- 3. Lead Visibility Engine & Triggers
-- =============================================================

create or replace function public.refresh_contact_lead_visibility()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_provider_profile_id uuid;
  v_provider_package_id uuid;
  v_package_tier text;
  v_contact_limit integer;
  v_current_month_count bigint;
begin
  if new.target_type = 'doctor' then
    select owner_id, package_id
    into v_provider_profile_id, v_provider_package_id
    from public.doctors
    where id = new.doctor_id;
  elsif new.target_type = 'hospital' then
    select owner_id, package_id
    into v_provider_profile_id, v_provider_package_id
    from public.hospitals
    where id = new.hospital_id;
  else
    v_provider_profile_id := null;
  end if;

  -- Default to hidden if no linked provider
  if v_provider_profile_id is null then
    new.is_visible_to_provider := false;
    new.hidden_reason := 'no linked provider';
    return new;
  end if;

  -- Default to hidden if no package
  if v_provider_package_id is null then
    new.is_visible_to_provider := false;
    new.hidden_reason := 'no package assigned';
    return new;
  end if;

  select tier, contact_limit
  into v_package_tier, v_contact_limit
  from public.packages
  where id = v_provider_package_id;

  if new.target_type = 'doctor' then
    v_current_month_count := public.provider_monthly_lead_count(new.target_type, new.doctor_id);
  else
    v_current_month_count := public.provider_monthly_lead_count(new.target_type, new.hospital_id);
  end if;

  -- Free plans get 3 leads free, premium/vip depends on package limit
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

-- Trigger: Enforce lead visibility
create trigger trg_contact_lead_visibility
before insert on public.contact_leads
for each row execute function public.refresh_contact_lead_visibility();

-- =============================================================
-- 4. Commercial Safety Engine (Prevent Provider Modifications)
-- =============================================================

create or replace function public.prevent_invalid_provider_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_user() then
    if new.package_id is distinct from old.package_id then
      raise exception 'Cannot modify package_id. This must be changed by an administrator.';
    end if;
    if new.rank is distinct from old.rank then
      raise exception 'Cannot modify rank. This must be changed by an administrator.';
    end if;
    if new.is_verified is distinct from old.is_verified then
      raise exception 'Cannot modify is_verified. This must be changed by an administrator.';
    end if;
    if new.is_active is distinct from old.is_active then
      raise exception 'Cannot modify is_active. This must be changed by an administrator.';
    end if;
    if new.rating is distinct from old.rating then
      raise exception 'Cannot modify rating. This must be changed by an administrator.';
    end if;
    if new.owner_id is distinct from old.owner_id then
      raise exception 'Cannot modify owner_id. This must be changed by an administrator.';
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_doctors_prevent_sensitive_update
before update on public.doctors
for each row execute function public.prevent_invalid_provider_update();

create trigger trg_hospitals_prevent_sensitive_update
before update on public.hospitals
for each row execute function public.prevent_invalid_provider_update();

-- =============================================================
-- 5. Triggers for updated_at
-- =============================================================

create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_cities_updated_at before update on public.cities for each row execute function public.set_updated_at();
create trigger trg_specialties_updated_at before update on public.specialties for each row execute function public.set_updated_at();
create trigger trg_packages_updated_at before update on public.packages for each row execute function public.set_updated_at();
create trigger trg_hospitals_updated_at before update on public.hospitals for each row execute function public.set_updated_at();
create trigger trg_doctors_updated_at before update on public.doctors for each row execute function public.set_updated_at();
create trigger trg_provider_contacts_updated_at before update on public.provider_contacts for each row execute function public.set_updated_at();
create trigger trg_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger trg_bookings_updated_at before update on public.bookings for each row execute function public.set_updated_at();
create trigger trg_international_requests_updated_at before update on public.international_requests for each row execute function public.set_updated_at();
create trigger trg_contact_leads_updated_at before update on public.contact_leads for each row execute function public.set_updated_at();

-- =============================================================
-- 6. Trigger for Auto-Creating Profiles on Auth Signup
-- =============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'patient'),
    true
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =============================================================
-- 7. Row Level Security (RLS) Policies
-- =============================================================

alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.specialties enable row level security;
alter table public.packages enable row level security;
alter table public.hospitals enable row level security;
alter table public.doctors enable row level security;
alter table public.provider_contacts enable row level security;
alter table public.doctor_specialties enable row level security;
alter table public.hospital_specialties enable row level security;
alter table public.subscriptions enable row level security;
alter table public.bookings enable row level security;
alter table public.international_requests enable row level security;
alter table public.contact_leads enable row level security;

-- profiles
create policy "Public/Admin/Owner select profiles" on public.profiles for select using (id = auth.uid() or public.is_admin_user());
create policy "Admins can update profiles" on public.profiles for update using (public.is_admin_user() or id = auth.uid());
create policy "System handles inserts on signup" on public.profiles for insert with check (id = auth.uid());

-- cities
create policy "Public can read active cities" on public.cities for select using (is_active = true and deleted_at is null);
create policy "Admins can manage cities" on public.cities for all using (public.is_admin_user());

-- specialties
create policy "Public can read active specialties" on public.specialties for select using (is_active = true and deleted_at is null);
create policy "Admins can manage specialties" on public.specialties for all using (public.is_admin_user());

-- packages
create policy "Public can read active packages" on public.packages for select using (is_active = true and deleted_at is null);
create policy "Admins can manage packages" on public.packages for all using (public.is_admin_user());

-- hospitals
create policy "Public can read active hospitals" on public.hospitals for select using (is_active = true and deleted_at is null);
create policy "Hospitals can update own hospital profile" on public.hospitals for update using (owner_id = auth.uid() or public.is_admin_user());
create policy "Admins can manage hospitals" on public.hospitals for all using (public.is_admin_user());

-- doctors
create policy "Public can read active doctors" on public.doctors for select using (is_active = true and deleted_at is null);
create policy "Doctors can update own doctor profile" on public.doctors for update using (owner_id = auth.uid() or public.is_admin_user());
create policy "Admins can manage doctors" on public.doctors for all using (public.is_admin_user());

-- provider contacts (Secure: public has ZERO direct read/write!)
create policy "Admins can manage provider contacts" on public.provider_contacts for all using (public.is_admin_user());
create policy "Owners can read/write own provider contacts" on public.provider_contacts for all
  using (
    (provider_type = 'doctor' and exists (select 1 from public.doctors d where d.id = doctor_id and d.owner_id = auth.uid())) or
    (provider_type = 'hospital' and exists (select 1 from public.hospitals h where h.id = hospital_id and h.owner_id = auth.uid()))
  );

-- Specialties Junction Tables
create policy "Public can read doctor specialties" on public.doctor_specialties for select using (true);
create policy "Admins can manage doctor specialties" on public.doctor_specialties for all using (public.is_admin_user());
create policy "Doctors can manage own specialties" on public.doctor_specialties for all using (
  exists (select 1 from public.doctors d where d.id = doctor_id and d.owner_id = auth.uid())
);

create policy "Public can read hospital specialties" on public.hospital_specialties for select using (true);
create policy "Admins can manage hospital specialties" on public.hospital_specialties for all using (public.is_admin_user());
create policy "Hospitals can manage own specialties" on public.hospital_specialties for all using (
  exists (select 1 from public.hospitals h where h.id = hospital_id and h.owner_id = auth.uid())
);

-- subscriptions
create policy "Users can read own subscriptions" on public.subscriptions for select using (profile_id = auth.uid() or public.is_admin_user());
create policy "Users can create own subscriptions" on public.subscriptions for insert with check (profile_id = auth.uid() or public.is_admin_user());
create policy "Admins can manage subscriptions" on public.subscriptions for all using (public.is_admin_user());

-- bookings
create policy "Public can create bookings" on public.bookings for insert with check (true);
create policy "Admins and linked providers can read bookings" on public.bookings for select
  using (
    public.is_admin_user() or
    (target_type = 'doctor' and exists (select 1 from public.doctors d where d.id = doctor_id and d.owner_id = auth.uid())) or
    (target_type = 'hospital' and exists (select 1 from public.hospitals h where h.id = hospital_id and h.owner_id = auth.uid()))
  );
create policy "Admins can manage bookings" on public.bookings for all using (public.is_admin_user());

-- international_requests
create policy "Public can create international requests" on public.international_requests for insert with check (true);
create policy "Admins and linked providers can read international requests" on public.international_requests for select
  using (
    public.is_admin_user() or
    (target_type = 'doctor' and exists (select 1 from public.doctors d where d.id = doctor_id and d.owner_id = auth.uid())) or
    (target_type = 'hospital' and exists (select 1 from public.hospitals h where h.id = hospital_id and h.owner_id = auth.uid()))
  );
create policy "Admins can manage international requests" on public.international_requests for all using (public.is_admin_user());

-- contact_leads (Public can only INSERT, Admin can SELECT/manage. Providers have 0 direct SELECT)
create policy "Public can create contact leads" on public.contact_leads for insert with check (true);
create policy "Admins can manage contact leads" on public.contact_leads for all using (public.is_admin_user());

-- =============================================================
-- 8. Secure Database Functions (RPCs)
-- =============================================================

-- get_provider_contact (Click-to-reveal: inserts lead first, then returns contact info IF package allows direct contact)
create or replace function public.get_provider_contact(
  p_provider_id uuid,
  p_provider_type text,
  p_lead_type text, -- 'phone' or 'whatsapp'
  p_patient_name text default null,
  p_patient_phone text default null
)
returns table (
  phone text,
  whatsapp text,
  website text,
  is_direct_allowed boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phone text;
  v_whatsapp text;
  v_website text;
  v_allow_direct_contact boolean;
  v_package_id uuid;
begin
  -- 1. Get package info for the provider
  if p_provider_type = 'doctor' then
    select package_id into v_package_id from public.doctors where id = p_provider_id;
  elsif p_provider_type = 'hospital' then
    select package_id into v_package_id from public.hospitals where id = p_provider_id;
  else
    raise exception 'Invalid provider type';
  end if;

  -- Get allow_direct_contact status from packages
  if v_package_id is not null then
    select allow_direct_contact into v_allow_direct_contact
    from public.packages
    where id = v_package_id;
  else
    v_allow_direct_contact := false;
  end if;

  v_allow_direct_contact := coalesce(v_allow_direct_contact, false);

  -- 2. Log the lead first (regardless of package, to track visitor interest)
  insert into public.contact_leads (
    target_type,
    doctor_id,
    hospital_id,
    lead_type,
    patient_name,
    patient_phone
  ) values (
    p_provider_type,
    case when p_provider_type = 'doctor' then p_provider_id else null end,
    case when p_provider_type = 'hospital' then p_provider_id else null end,
    p_lead_type,
    p_patient_name,
    p_patient_phone
  );

  -- 3. Fetch data from secure table
  select pc.phone, pc.whatsapp, pc.website
  into v_phone, v_whatsapp, v_website
  from public.provider_contacts pc
  where (p_provider_type = 'doctor' and pc.doctor_id = p_provider_id)
     or (p_provider_type = 'hospital' and pc.hospital_id = p_provider_id);

  -- 4. If direct contact is allowed, return the real numbers. Otherwise, return null for phone/whatsapp.
  if v_allow_direct_contact then
    return query select v_phone, v_whatsapp, v_website, true;
  else
    return query select null::text, null::text, v_website, false;
  end if;
end;
$$;

-- get_provider_leads (Enforces lead gating by masking sensitive patient fields when hidden)
create or replace function public.get_provider_leads(
  p_provider_id uuid,
  p_provider_type text
)
returns table (
  id uuid,
  lead_type text,
  patient_name text,
  patient_phone text,
  patient_whatsapp text,
  is_visible boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if p_provider_type = 'doctor' then
    select owner_id into v_owner_id from public.doctors where id = p_provider_id;
  elsif p_provider_type = 'hospital' then
    select owner_id into v_owner_id from public.hospitals where id = p_provider_id;
  else
    raise exception 'Invalid provider type';
  end if;

  if auth.uid() <> v_owner_id and not public.is_admin_user() then
    raise exception 'Access Denied';
  end if;

  return query
  select 
    cl.id,
    cl.lead_type,
    case when cl.is_visible_to_provider or public.is_admin_user() then cl.patient_name else null end as patient_name,
    case when cl.is_visible_to_provider or public.is_admin_user() then cl.patient_phone else null end as patient_phone,
    case when cl.is_visible_to_provider or public.is_admin_user() then cl.patient_whatsapp else null end as patient_whatsapp,
    cl.is_visible_to_provider as is_visible,
    cl.created_at
  from public.contact_leads cl
  where cl.deleted_at is null
    and (
      (p_provider_type = 'doctor' and cl.doctor_id = p_provider_id)
      or (p_provider_type = 'hospital' and cl.hospital_id = p_provider_id)
    )
  order by cl.created_at desc;
end;
$$;

-- Grant execution permissions
revoke execute on function public.get_provider_contact from public;
grant execute on function public.get_provider_contact to public, authenticated;

revoke execute on function public.get_provider_leads from public;
grant execute on function public.get_provider_leads to authenticated;

-- =============================================================
-- 9. Database Indexes
-- =============================================================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_deleted on public.profiles(deleted_at) where deleted_at is null;

create index if not exists idx_cities_slug on public.cities(slug);
create index if not exists idx_specialties_slug on public.specialties(slug);

create index if not exists idx_doctors_city_id on public.doctors(city_id);
create index if not exists idx_doctors_specialty_id on public.doctors(specialty_id);
create index if not exists idx_doctors_package_id on public.doctors(package_id);
create index if not exists idx_doctors_is_active on public.doctors(is_active);
create index if not exists idx_doctors_rank on public.doctors(rank);
create index if not exists idx_doctors_slug on public.doctors(slug);
create index if not exists idx_doctors_deleted on public.doctors(deleted_at) where deleted_at is null;

create index if not exists idx_hospitals_city_id on public.hospitals(city_id);
create index if not exists idx_hospitals_package_id on public.hospitals(package_id);
create index if not exists idx_hospitals_is_active on public.hospitals(is_active);
create index if not exists idx_hospitals_rank on public.hospitals(rank);
create index if not exists idx_hospitals_deleted on public.hospitals(deleted_at) where deleted_at is null;

create index if not exists idx_bookings_doctor_id on public.bookings(doctor_id);
create index if not exists idx_bookings_hospital_id on public.bookings(hospital_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_deleted on public.bookings(deleted_at) where deleted_at is null;

create index if not exists idx_intl_req_doctor_id on public.international_requests(doctor_id);
create index if not exists idx_intl_req_hospital_id on public.international_requests(hospital_id);
create index if not exists idx_intl_req_status on public.international_requests(status);
create index if not exists idx_intl_req_deleted on public.international_requests(deleted_at) where deleted_at is null;

create index if not exists idx_contact_leads_doctor_created on public.contact_leads(doctor_id, created_at desc);
create index if not exists idx_contact_leads_hospital_created on public.contact_leads(hospital_id, created_at desc);
create index if not exists idx_contact_leads_is_visible on public.contact_leads(is_visible_to_provider);
create index if not exists idx_contact_leads_deleted on public.contact_leads(deleted_at) where deleted_at is null;

-- =============================================================
-- 10. Seed Data (Valid RFC 4122 UUIDs)
-- =============================================================

-- Cities
insert into public.cities (id, name_ar, name_en, slug) values
  ('c4a5c753-4874-4b53-91b7-a3cf57d549cb'::uuid, 'عمان', 'Amman', 'amman'),
  ('1d7e5d83-74b8-4d57-8fb2-c513b6f00db1'::uuid, 'إربد', 'Irbid', 'irbid'),
  ('2e8a6d73-4874-4b53-91b7-a3cf57d549ca'::uuid, 'الزرقاء', 'Zarqa', 'zarqa'),
  ('3f9b7c84-74b8-4d57-8fb2-c513b6f00db2'::uuid, 'العقبة', 'Aqaba', 'aqaba'),
  ('4a0c8d95-4874-4b53-91b7-a3cf57d549c9'::uuid, 'السلط', 'Salt', 'salt')
  on conflict (slug) do nothing;

-- Specialties
insert into public.specialties (id, name_ar, name_en, slug, icon) values
  ('9f8b1c44-d3a9-467f-9457-4148b1111111'::uuid, 'قلب وأوعية دموية', 'Cardiology', 'cardiology', 'heart'),
  ('9f8b1c44-d3a9-467f-9457-4148b2222222'::uuid, 'جلدية', 'Dermatology', 'dermatology', 'skin'),
  ('9f8b1c44-d3a9-467f-9457-4148b3333333'::uuid, 'عظام ومفاصل', 'Orthopedics', 'orthopedics', 'bone'),
  ('9f8b1c44-d3a9-467f-9457-4148b4444444'::uuid, 'طب العيون', 'Ophthalmology', 'ophthalmology', 'eye'),
  ('9f8b1c44-d3a9-467f-9457-4148b5555555'::uuid, 'أنف وأذن وحنجرة', 'ENT', 'ent', 'ear'),
  ('9f8b1c44-d3a9-467f-9457-4148b6666666'::uuid, 'طب أطفال', 'Pediatrics', 'pediatrics', 'baby'),
  ('9f8b1c44-d3a9-467f-9457-4148b7777777'::uuid, 'نسائية وتوليد', 'Gynecology', 'gynecology', 'female'),
  ('9f8b1c44-d3a9-467f-9457-4148b8888888'::uuid, 'طب أعصاب', 'Neurology', 'neurology', 'brain'),
  ('9f8b1c44-d3a9-467f-9457-4148b9999999'::uuid, 'جراحة عامة', 'General Surgery', 'general-surgery', 'scalpel'),
  ('9f8b1c44-d3a9-467f-9457-4148baaaaaaa'::uuid, 'طب أسنان', 'Dentistry', 'dentistry', 'tooth')
  on conflict (slug) do nothing;

-- Packages (Free: allow_direct_contact = false, Paid: allow_direct_contact = true)
insert into public.packages (id, name_ar, name_en, type, tier, price_jod, contact_limit, ranking_boost, allow_direct_contact, features) values
  ('e5e3966e-21ef-42f3-a7bb-4e9df1111111'::uuid, 'مجاني', 'Free', 'doctor', 'free', 0.00, 3, 0, false, '["عرض أساسي","3 تواصلات شهرياً","طلب تواصل بالمنصة"]'::jsonb),
  ('e5e3966e-21ef-42f3-a7bb-4e9df2222222'::uuid, 'مميز', 'Premium', 'doctor', 'premium', 29.99, 50, 20, true, '["ظهور أعلى","شارة مميز","اتصال مباشر","إحصائيات"]'::jsonb),
  ('e5e3966e-21ef-42f3-a7bb-4e9df3333333'::uuid, 'VIP', 'VIP', 'doctor', 'vip', 79.99, 999, 50, true, '["أولوية ظهور كاملة","شارة VIP","اتصال مباشر","طلبات علاج دولية"]'::jsonb),
  ('e5e3966e-21ef-42f3-a7bb-4e9df4444444'::uuid, 'أساسي', 'Basic', 'hospital', 'free', 49.99, 20, 10, false, '["صفحة مستشفى أساسية","عرض أطباء مرتبطين"]'::jsonb),
  ('e5e3966e-21ef-42f3-a7bb-4e9df5555555'::uuid, 'مميز', 'Premium', 'hospital', 'premium', 149.99, 100, 30, true, '["ظهور أعلى","اتصال مباشر","طلبات دولية"]'::jsonb),
  ('e5e3966e-21ef-42f3-a7bb-4e9df6666666'::uuid, 'International Partner', 'International Partner', 'hospital', 'international', 249.99, 999, 60, true, '["شريك دولي","اتصال مباشر","أولوية كاملة"]'::jsonb)
  on conflict do nothing;

-- Seed Mock Hospitals (owner_id = null for general display)
insert into public.hospitals (id, name_ar, name_en, slug, city_id, package_id, description_ar, description_en, address_ar, address_en, rank, is_verified, accepts_international_patients, is_active)
values (
  'df9c3c0c-8066-4fbf-97f3-4a1111111111'::uuid, 'مستشفى الأردن', 'Jordan Hospital', 'jordan-hospital', 
  'c4a5c753-4874-4b53-91b7-a3cf57d549cb'::uuid, 'e5e3966e-21ef-42f3-a7bb-4e9df6666666'::uuid,
  'مستشفى رائد يقدم خدمات طبية متكاملة بأعلى المعايير العالمية.', 
  'A leading hospital providing comprehensive medical services with the highest international standards.', 
  'العبدلي، شارع الملك حسين، عمان', 'Abdali, King Hussein St, Amman', 'vip', true, true, true
) on conflict (slug) do nothing;

insert into public.hospitals (id, name_ar, name_en, slug, city_id, package_id, description_ar, description_en, address_ar, address_en, rank, is_verified, accepts_international_patients, is_active)
values (
  'df9c3c0c-8066-4fbf-97f3-4a2222222222'::uuid, 'مستشفى الخالدي', 'Al-Khalidi Hospital', 'al-khalidi-hospital', 
  'c4a5c753-4874-4b53-91b7-a3cf57d549cb'::uuid, 'e5e3966e-21ef-42f3-a7bb-4e9df5555555'::uuid,
  'مركز طبي متميز ومتخصص في جراحة القلب والشرايين والعلاجات الدقيقة.', 
  'A distinguished medical center specializing in cardiovascular surgery and precise treatments.', 
  'جبل عمان، الدوار الثالث، عمان', 'Jabal Amman, 3rd Circle, Amman', 'premium', true, true, true
) on conflict (slug) do nothing;

-- Seed Mock Doctors (owner_id = null for general display)
insert into public.doctors (id, full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active)
values (
  'da55c6ff-9311-4eb2-a6f9-711111111111'::uuid, 'د. أحمد الحسن', 'Dr. Ahmed Al-Hassan', 'dr-ahmed-al-hassan', 
  'استشاري أمراض القلب والأوعية الدموية ورئيس جمعية القلب سابقاً.', 
  'Consultant Cardiologist and former President of the Cardiology Association.', 
  '9f8b1c44-d3a9-467f-9457-4148b1111111'::uuid, 'c4a5c753-4874-4b53-91b7-a3cf57d549cb'::uuid, 'e5e3966e-21ef-42f3-a7bb-4e9df3333333'::uuid, 
  40.00, 18, 'male', 'شارع المدينة المنورة، عمان', 'Medina St, Amman', 'vip', true, true, true, true, true
) on conflict (slug) do nothing;

insert into public.doctors (id, full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active)
values (
  'da55c6ff-9311-4eb2-a6f9-722222222222'::uuid, 'د. سارة الخطيب', 'Dr. Sara Al-Khatib', 'dr-sara-al-khatib', 
  'أخصائية الأمراض الجلدية والتجميل والعلاج بالليزر.', 
  'Dermatology, Aesthetics and Laser Specialist.', 
  '9f8b1c44-d3a9-467f-9457-4148b2222222'::uuid, 'c4a5c753-4874-4b53-91b7-a3cf57d549cb'::uuid, 'e5e3966e-21ef-42f3-a7bb-4e9df2222222'::uuid, 
  25.00, 10, 'female', 'شارع عبد الله غوشة، عمان', 'Abdullah Ghosheh St, Amman', 'premium', true, true, true, true, true
) on conflict (slug) do nothing;

insert into public.doctors (id, full_name_ar, full_name_en, slug, title_ar, title_en, specialty_id, city_id, package_id, consultation_fee_jod, experience_years, gender, address_ar, address_en, rank, is_verified, accepts_booking, accepts_consultation, accepts_international_patients, is_active)
values (
  'da55c6ff-9311-4eb2-a6f9-733333333333'::uuid, 'د. خالد العبدالله', 'Dr. Khaled Abdullah', 'dr-khaled-abdullah', 
  'أخصائي طب وجراحة العظام والمفاصل والعمود الفقري.', 
  'Orthopedic Joint and Spine Surgeon.', 
  '9f8b1c44-d3a9-467f-9457-4148b3333333'::uuid, '1d7e5d83-74b8-4d57-8fb2-c513b6f00db1'::uuid, 'e5e3966e-21ef-42f3-a7bb-4e9df1111111'::uuid, 
  30.00, 12, 'male', 'شارع ايدون، إربد', 'Aidoun St, Irbid', 'standard', false, true, true, false, true
) on conflict (slug) do nothing;

-- Seed Specialties Junctions
insert into public.doctor_specialties (doctor_id, specialty_id, is_primary) values
  ('da55c6ff-9311-4eb2-a6f9-711111111111'::uuid, '9f8b1c44-d3a9-467f-9457-4148b1111111'::uuid, true),
  ('da55c6ff-9311-4eb2-a6f9-722222222222'::uuid, '9f8b1c44-d3a9-467f-9457-4148b2222222'::uuid, true),
  ('da55c6ff-9311-4eb2-a6f9-733333333333'::uuid, '9f8b1c44-d3a9-467f-9457-4148b3333333'::uuid, true)
  on conflict do nothing;

-- Seed Provider Contacts
insert into public.provider_contacts (provider_type, doctor_id, phone, whatsapp, website) values
  ('doctor', 'da55c6ff-9311-4eb2-a6f9-711111111111'::uuid, '+962770000001', '+962770000001', 'https://drahmedcardio.example'),
  ('doctor', 'da55c6ff-9311-4eb2-a6f9-722222222222'::uuid, '+962770000002', '+962770000002', 'https://drsaraskin.example'),
  ('doctor', 'da55c6ff-9311-4eb2-a6f9-733333333333'::uuid, '+962770000003', '+962770000003', null)
  on conflict do nothing;

insert into public.provider_contacts (provider_type, hospital_id, phone, whatsapp, website) values
  ('hospital', 'df9c3c0c-8066-4fbf-97f3-4a1111111111'::uuid, '+96265608080', '+962790000100', 'https://www.jordan-hospital.com'),
  ('hospital', 'df9c3c0c-8066-4fbf-97f3-4a2222222222'::uuid, '+96264644281', '+962790000200', 'https://www.khalidi-hospital.com')
  on conflict do nothing;
