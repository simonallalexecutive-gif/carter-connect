-- Roles system
create type public.app_role as enum ('admin', 'moderator', 'user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

create policy "Admins can view user roles"
on public.user_roles
for select
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage user roles"
on public.user_roles
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Candidate registrations / profile data
create table if not exists public.candidate_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  status text not null default 'pending_email_verification',
  submission_data jsonb not null default '{}'::jsonb,
  no_go_cabinets text[] not null default '{}',
  visibility text not null default 'confidentiel',
  email_verified_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.candidate_registrations enable row level security;

create policy "Candidates can view own registration"
on public.candidate_registrations
for select
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Candidates can insert own registration"
on public.candidate_registrations
for insert
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Candidates can update own registration"
on public.candidate_registrations
for update
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- Cabinet accounts
create table if not exists public.cabinet_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  cabinet_name text not null,
  is_verified boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.cabinet_accounts enable row level security;

create policy "Users can view own cabinet account"
on public.cabinet_accounts
for select
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Users can insert own cabinet account"
on public.cabinet_accounts
for insert
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "Users can update own cabinet account"
on public.cabinet_accounts
for update
using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- Interests expressed by firms
create table if not exists public.cabinet_candidate_interests (
  id uuid primary key default gen_random_uuid(),
  cabinet_account_id uuid not null references public.cabinet_accounts(id) on delete cascade,
  candidate_user_id uuid not null,
  status text not null default 'interest_notified',
  logan_validated boolean not null default false,
  notified_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (cabinet_account_id, candidate_user_id)
);

alter table public.cabinet_candidate_interests enable row level security;

create policy "Candidates can view own interests"
on public.cabinet_candidate_interests
for select
using (
  auth.uid() = candidate_user_id
  or public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
);

create policy "Admins can insert interests"
on public.cabinet_candidate_interests
for insert
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins and matching cabinets can update interests"
on public.cabinet_candidate_interests
for update
using (
  public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
)
with check (
  public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
);

-- Identity / CV unlock workflow
create table if not exists public.candidate_identity_unlocks (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid not null unique references public.cabinet_candidate_interests(id) on delete cascade,
  candidate_user_id uuid not null,
  cabinet_account_id uuid not null references public.cabinet_accounts(id) on delete cascade,
  status text not null default 'pending_candidate_confirmation',
  identity_unlocked boolean not null default false,
  cv_unlocked boolean not null default false,
  confirmed_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.candidate_identity_unlocks enable row level security;

create policy "Users can view relevant unlocks"
on public.candidate_identity_unlocks
for select
using (
  auth.uid() = candidate_user_id
  or public.has_role(auth.uid(), 'admin')
  or (
    identity_unlocked = true
    and exists (
      select 1 from public.cabinet_accounts ca
      where ca.id = cabinet_account_id
        and ca.user_id = auth.uid()
    )
  )
);

create policy "Candidates can update own unlocks"
on public.candidate_identity_unlocks
for update
using (auth.uid() = candidate_user_id or public.has_role(auth.uid(), 'admin'))
with check (auth.uid() = candidate_user_id or public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert unlocks"
on public.candidate_identity_unlocks
for insert
with check (public.has_role(auth.uid(), 'admin'));

-- Interview scheduling
create table if not exists public.interview_slots (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid references public.cabinet_candidate_interests(id) on delete cascade,
  candidate_user_id uuid not null,
  cabinet_account_id uuid not null references public.cabinet_accounts(id) on delete cascade,
  starts_at timestamp with time zone not null,
  ends_at timestamp with time zone not null,
  timezone text not null default 'Europe/Paris',
  status text not null default 'proposed',
  proposed_by text not null,
  admin_notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.interview_slots enable row level security;

create index if not exists idx_interview_slots_candidate_user_id on public.interview_slots(candidate_user_id);
create index if not exists idx_interview_slots_cabinet_account_id on public.interview_slots(cabinet_account_id);
create index if not exists idx_interview_slots_starts_at on public.interview_slots(starts_at);

create policy "Relevant users can view interview slots"
on public.interview_slots
for select
using (
  auth.uid() = candidate_user_id
  or public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
);

create policy "Relevant users can insert interview slots"
on public.interview_slots
for insert
with check (
  auth.uid() = candidate_user_id
  or public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
);

create policy "Relevant users can update interview slots"
on public.interview_slots
for update
using (
  auth.uid() = candidate_user_id
  or public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
)
with check (
  auth.uid() = candidate_user_id
  or public.has_role(auth.uid(), 'admin')
  or exists (
    select 1 from public.cabinet_accounts ca
    where ca.id = cabinet_account_id
      and ca.user_id = auth.uid()
  )
);

-- Admin access to profiles
create policy "Admins can view all profiles"
on public.profiles
for select
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update all profiles"
on public.profiles
for update
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Updated at triggers
create trigger update_candidate_registrations_updated_at
before update on public.candidate_registrations
for each row execute function public.update_updated_at_column();

create trigger update_cabinet_accounts_updated_at
before update on public.cabinet_accounts
for each row execute function public.update_updated_at_column();

create trigger update_cabinet_candidate_interests_updated_at
before update on public.cabinet_candidate_interests
for each row execute function public.update_updated_at_column();

create trigger update_candidate_identity_unlocks_updated_at
before update on public.candidate_identity_unlocks
for each row execute function public.update_updated_at_column();

create trigger update_interview_slots_updated_at
before update on public.interview_slots
for each row execute function public.update_updated_at_column();