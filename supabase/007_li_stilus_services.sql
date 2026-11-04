-- Instalar no Supabase do Terapia em Dia antes de ativar o catálogo.
-- Dados financeiros e acesso de pacientes ficam fora desta tabela.
create table if not exists public.therapy_professional_services (
 id uuid primary key default gen_random_uuid(),
 professional_id uuid not null references public.therapy_professionals(id),
 slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (char_length(title) between 3 and 120),
 description text not null default '' check (char_length(description) <= 1600),
 price_cents integer not null check (price_cents >= 100),
 session_count integer not null default 1 check (session_count between 1 and 100),
 duration_minutes integer not null default 60 check (duration_minutes between 15 and 240),
 service_category text not null default 'sessao' check (service_category in ('sessao','tratamento')),
 active boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(professional_id,slug)
);
create index if not exists idx_therapy_services_professional on public.therapy_professional_services(professional_id,active);
alter table public.therapy_professional_services enable row level security;
revoke all on public.therapy_professional_services from anon,authenticated;
-- Catálogo público somente por rota de servidor que filtra profissional e status.
-- Administração somente via API protegida de cada profissional.
