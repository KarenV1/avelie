-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 002 — modelo de contenido de cursos
-- ═══════════════════════════════════════════════════════════════════
-- Jerarquía: courses → modules → lessons → content_blocks.
-- Calza 1:1 con lo que la app ya entiende:
--   modules = units · lessons = items (block/practice) · content_blocks = steps
-- Cada nivel tiene UUID interno + slug de texto. El slug es lo que viaja
-- al frontend y a user_progress (course_id/item_id siguen siendo texto),
-- así el progreso existente no requiere cambios.
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,            -- 'sql-oracle' → user_progress.course_id
  title        text not null,
  subtitle     text,
  description  text,
  icon         text,
  accent       text default 'gold',             -- token CSS existente (--gold, --teal…)
  language     text not null default 'sql',
  is_published boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.modules (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses (id) on delete cascade,
  slug         text not null,                   -- 'm01-modelo-de-datos'
  title        text not null,
  summary      text,
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  unique (course_id, slug)
);

create table if not exists public.lessons (
  id         uuid primary key default gen_random_uuid(),
  module_id  uuid not null references public.modules (id) on delete cascade,
  slug       text not null,                     -- 'm01-l01-…' → user_progress.item_id
  title      text not null,
  -- leccion/examen se renderizan en BlockScreen; practica en PracticeScreen
  kind       text not null check (kind in ('leccion', 'practica', 'examen')),
  xp         integer not null default 20,
  sort_order integer not null default 0,
  unique (module_id, slug)
);

create table if not exists public.content_blocks (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid not null references public.lessons (id) on delete cascade,
  sort_order integer not null,
  kind       text not null check (kind in ('texto', 'diagrama', 'ejemplo_sql', 'quiz', 'ejercicio', 'resumen')),
  -- Contratos de payload por kind (los mapea src/data/courseStore.js):
  --   texto:       { title, body }
  --   ejemplo_sql: { title, code, caption, result: { columns: [], rows: [[]] } }
  --   diagrama:    { component, props, caption }  → componente SVG del registry
  --   quiz:        { variant, prompt, code?, options, correctIndex, feedback: { correct, incorrect } }
  --   ejercicio:   { scenario, instructions, initialCode, validators, hints,
  --                  mockOutput, successMessage, failMessage }
  --   resumen:     { title, points: [] }
  payload    jsonb not null,
  unique (lesson_id, sort_order)
);

-- Índices para el select anidado (courses → modules → lessons → content_blocks)
create index if not exists modules_course_idx       on public.modules (course_id, sort_order);
create index if not exists lessons_module_idx       on public.lessons (module_id, sort_order);
create index if not exists content_blocks_lesson_idx on public.content_blocks (lesson_id, sort_order);

-- ── Row Level Security: contenido de SOLO lectura desde el cliente ──
-- La escritura se hace únicamente desde el SQL Editor (service role),
-- nunca con la anon key.
alter table public.courses        enable row level security;
alter table public.modules        enable row level security;
alter table public.lessons        enable row level security;
alter table public.content_blocks enable row level security;

create policy "cursos publicados legibles"
  on public.courses for select
  using (is_published);

create policy "modulos de cursos publicados legibles"
  on public.modules for select
  using (
    is_published
    and exists (
      select 1 from public.courses c
      where c.id = course_id and c.is_published
    )
  );

create policy "lecciones de cursos publicados legibles"
  on public.lessons for select
  using (
    exists (
      select 1
      from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id and m.is_published and c.is_published
    )
  );

create policy "bloques de cursos publicados legibles"
  on public.content_blocks for select
  using (
    exists (
      select 1
      from public.lessons l
      join public.modules m on m.id = l.module_id
      join public.courses c on c.id = m.course_id
      where l.id = lesson_id and m.is_published and c.is_published
    )
  );
