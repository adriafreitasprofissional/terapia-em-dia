-- Aplicar no projeto Supabase compartilhado somente após revisão.
-- Sem políticas de leitura pública: todas as operações via service_role no servidor.
create table if not exists public.therapy_treatment_orders (
  id uuid primary key default gen_random_uuid(),
  external_reference text not null unique,
  treatment_id text not null check (treatment_id in ('teste', 'social', 'profundo', 'avancado')),
  payment_method text not null check (payment_method in ('cartao', 'pix')),
  amount_cents integer not null check (amount_cents > 0),
  patient_name text not null,
  patient_email text not null,
  patient_whatsapp text,
  status text not null default 'pending' check (status in ('pending','processing','paid','failed','refunded')),
  mp_preference_id text,
  mp_payment_id text unique,
  patient_id uuid,
  access_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.therapy_treatment_orders enable row level security;
revoke all on table public.therapy_treatment_orders from anon, authenticated;
create index if not exists idx_therapy_treatment_orders_email on public.therapy_treatment_orders (patient_email);

create table if not exists public.therapy_treatment_contracts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.therapy_treatment_orders(id),
  patient_id uuid not null references public.club_clients(id),
  treatment_id text not null check (treatment_id in ('teste', 'social', 'profundo', 'avancado')),
  sessions_total integer not null check (sessions_total > 0),
  sessions_used integer not null default 0 check (sessions_used >= 0),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.therapy_treatment_contracts enable row level security;
revoke all on table public.therapy_treatment_contracts from anon, authenticated;
create index if not exists idx_therapy_treatment_contracts_patient on public.therapy_treatment_contracts (patient_id);
