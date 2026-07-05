-- CVBuilder AI — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

-- ============================================================
-- profiles: one row per user, one JSONB column per profile section
-- (mirrors the previous localStorage keys: profile_personal,
-- profile_experiences, profile_education, profile_skills,
-- profile_languages, profile_projects)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  personal_info jsonb not null default '{}'::jsonb,
  experiences jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- ============================================================
-- cvs: replaces the "user_cvs" localStorage array
-- ============================================================
create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  template_id text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cvs_user_id_idx on public.cvs (user_id);

alter table public.cvs enable row level security;

create policy "cvs_select_own" on public.cvs
  for select using (auth.uid() = user_id);

create policy "cvs_insert_own" on public.cvs
  for insert with check (auth.uid() = user_id);

create policy "cvs_update_own" on public.cvs
  for update using (auth.uid() = user_id);

create policy "cvs_delete_own" on public.cvs
  for delete using (auth.uid() = user_id);

-- ============================================================
-- keep updated_at fresh on every UPDATE
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.cvs;
create trigger set_updated_at
  before update on public.cvs
  for each row execute function public.set_updated_at();

-- ============================================================
-- auto-create an empty profile row whenever a new auth user signs up
-- (name is read from the signup metadata set in auth-service.ts)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data ->> 'name', new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
