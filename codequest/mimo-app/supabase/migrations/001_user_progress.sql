-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 001 — tabla user_progress
-- ═══════════════════════════════════════════════════════════════════
-- Esta tabla NO existe aún en el proyecto (verificado 2026-07-02) y el
-- código ya la usa: src/utils/supabaseProgress.js hace upsert/select.
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_id    text not null,
  unit_id      text,
  item_id      text not null,
  item_type    text,
  xp_earned    integer not null default 0,
  completed    boolean not null default true,
  completed_at timestamptz not null default now(),

  -- El upsert del cliente usa onConflict: 'user_id,course_id,item_id'
  unique (user_id, course_id, item_id)
);

-- Índice para la carga inicial (select ... eq user_id)
create index if not exists user_progress_user_idx
  on public.user_progress (user_id);

-- ── Row Level Security: cada usuario solo ve y escribe lo suyo ──
alter table public.user_progress enable row level security;

create policy "usuarios leen su propio progreso"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "usuarios insertan su propio progreso"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "usuarios actualizan su propio progreso"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
