-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 004 — catálogo con itinerario (Fase 0)
-- ═══════════════════════════════════════════════════════════════════
-- 100% ADITIVA: no borra ni modifica datos existentes.
--   · courses: columnas categoria y nivel (con defaults)
--   · course_prerequisites: encadenado de cursos + protección anti-ciclos
--   · tracks + track_courses: rutas de aprendizaje
--   · content_blocks.kind: tipos nuevos para futuros cursos
-- Ejecutar DESPUÉS de 002 y 003 (y antes o después de 010: no interfiere).
-- ═══════════════════════════════════════════════════════════════════

-- ── 1 · courses: categoría y nivel ──────────────────────────────────
-- Defaults pensados para no romper cursos existentes; el seed 005
-- asigna los valores reales al curso de SQL.
alter table public.courses
  add column if not exists categoria text not null default 'fundamentos',
  add column if not exists nivel     text not null default 'basico';

-- text + CHECK (no enum): extender la lista es editar una línea.
alter table public.courses drop constraint if exists courses_categoria_check;
alter table public.courses add constraint courses_categoria_check
  check (categoria in ('fundamentos', 'cumplimiento', 'defensa',
                       'investigacion', 'datos_ia', 'desarrollo'));

-- nivel = nivel de ENTRADA requerido para tomar el curso
alter table public.courses drop constraint if exists courses_nivel_check;
alter table public.courses add constraint courses_nivel_check
  check (nivel in ('basico', 'intermedio', 'senior'));

-- ── 2 · course_prerequisites: encadenado de cursos ──────────────────
-- (course_id, prerequisite_course_id) = "para tomar course_id se
-- necesita prerequisite_course_id".
create table if not exists public.course_prerequisites (
  course_id              uuid not null references public.courses (id) on delete cascade,
  prerequisite_course_id uuid not null references public.courses (id) on delete cascade,
  primary key (course_id, prerequisite_course_id),
  check (course_id <> prerequisite_course_id)
);

-- Búsqueda inversa: "¿qué cursos desbloquea X?"
create index if not exists course_prereq_reverse_idx
  on public.course_prerequisites (prerequisite_course_id);

-- Protección contra ciclos: antes de insertar A→B se recorre la cadena
-- de prerrequisitos de B; si en ella aparece A, la fila se rechaza.
-- Costo trivial a escala de catálogo (decenas de cursos).
create or replace function public.evitar_ciclo_prerrequisitos()
returns trigger
language plpgsql
as $$
begin
  if exists (
    with recursive cadena as (
      select new.prerequisite_course_id as course_id
      union
      select cp.prerequisite_course_id
      from public.course_prerequisites cp
      join cadena on cp.course_id = cadena.course_id
    )
    select 1 from cadena where course_id = new.course_id
  ) then
    raise exception 'Ciclo de prerrequisitos: el curso prerrequisito ya depende (directa o indirectamente) del curso destino';
  end if;
  return new;
end;
$$;

drop trigger if exists course_prerequisites_sin_ciclos on public.course_prerequisites;
create trigger course_prerequisites_sin_ciclos
  before insert or update on public.course_prerequisites
  for each row execute function public.evitar_ciclo_prerrequisitos();

-- ── 3 · tracks + track_courses: rutas de aprendizaje ────────────────
create table if not exists public.tracks (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,            -- 'ruta-datos-ia'
  title        text not null,
  description  text,
  icon         text,
  accent       text default 'gold',             -- token CSS existente
  sort_order   integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.track_courses (
  track_id   uuid not null references public.tracks (id)  on delete cascade,
  course_id  uuid not null references public.courses (id) on delete cascade,
  sort_order integer not null default 0,        -- orden del curso en la ruta
  primary key (track_id, course_id)
);

create index if not exists track_courses_track_idx
  on public.track_courses (track_id, sort_order);

-- ── 4 · content_blocks: tipos de bloque para futuros cursos ─────────
-- Se conservan TODOS los tipos actuales (el contenido existente no se
-- toca) y se agregan: ejemplo_codigo, laboratorio, nota_etica, nota_legal.
-- El frontend ignora los tipos que aún no mapea (mapBlockToStep → null).
alter table public.content_blocks drop constraint if exists content_blocks_kind_check;
alter table public.content_blocks add constraint content_blocks_kind_check
  check (kind in ('texto', 'diagrama', 'ejemplo_sql', 'ejemplo_codigo',
                  'quiz', 'ejercicio', 'laboratorio',
                  'nota_etica', 'nota_legal', 'resumen'));

-- ── 5 · RLS: solo lectura desde el cliente, como el resto ───────────
alter table public.course_prerequisites enable row level security;
alter table public.tracks               enable row level security;
alter table public.track_courses        enable row level security;

drop policy if exists "prerrequisitos de cursos publicados legibles" on public.course_prerequisites;
create policy "prerrequisitos de cursos publicados legibles"
  on public.course_prerequisites for select
  using (
    exists (select 1 from public.courses c
            where c.id = course_id and c.is_published)
    and exists (select 1 from public.courses c
                where c.id = prerequisite_course_id and c.is_published)
  );

drop policy if exists "rutas publicadas legibles" on public.tracks;
create policy "rutas publicadas legibles"
  on public.tracks for select
  using (is_published);

drop policy if exists "cursos de rutas publicadas legibles" on public.track_courses;
create policy "cursos de rutas publicadas legibles"
  on public.track_courses for select
  using (
    exists (select 1 from public.tracks t
            where t.id = track_id and t.is_published)
    and exists (select 1 from public.courses c
                where c.id = course_id and c.is_published)
  );
