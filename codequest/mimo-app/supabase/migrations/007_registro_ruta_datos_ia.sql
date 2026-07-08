-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 007 — registro de cursos futuros · ruta Datos e IA
-- ═══════════════════════════════════════════════════════════════════
-- SOLO registro en catálogo (sin módulos, lecciones ni bloques):
--   · 2 cursos "próximamente" (is_published = false)
--   · sus posiciones 2 y 3 en la ruta Datos e IA (SQL sigue de 1)
--   · prerrequisitos reales de fundamentos-ia-ml
--   · ajuste de RLS (Propuesta A, aprobada por Karen): is_published pasa
--     a controlar la visibilidad del CONTENIDO, no de la metadata.
--     La metadata de cursos no publicados queda públicamente legible —
--     intencional: es lo que el mapa de rutas muestra como "próximamente".
--     El contenido sigue protegido: modules/lessons/content_blocks
--     verifican courses.is_published en cadena.
-- Aditiva e idempotente. Ejecutar DESPUÉS de 004 y 005.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1 · Los dos cursos futuros ──────────────────────────────────────
insert into public.courses
  (slug, title, subtitle, description, icon, accent, language,
   categoria, nivel, is_published, sort_order)
values
  ('python-desde-cero',
   'Python desde Cero',
   'El lenguaje de los datos',
   'Python orientado a datos, con laboratorios en Google Colab: escribes y ejecutas código real desde el navegador, sin instalar nada.',
   '🐍', 'gold', 'python',
   'datos_ia', 'basico', false, 3),
  ('fundamentos-ia-ml',
   'Fundamentos de IA y Machine Learning',
   'Del dato a la predicción',
   'El panorama completo de la IA y machine learning práctico, con casos reales del sector salud: predicción, clasificación y los límites éticos del modelo.',
   '🤖', 'gold', 'python',
   'datos_ia', 'basico', false, 4)
on conflict (slug) do update set
  title        = excluded.title,
  subtitle     = excluded.subtitle,
  description  = excluded.description,
  icon         = excluded.icon,
  accent       = excluded.accent,
  language     = excluded.language,
  categoria    = excluded.categoria,
  nivel        = excluded.nivel,
  is_published = excluded.is_published,
  sort_order   = excluded.sort_order;

-- ── 2 · Posiciones 2 y 3 de la ruta Datos e IA ──────────────────────
insert into public.track_courses (track_id, course_id, sort_order)
select t.id, c.id, v.ord
from public.tracks t
join (values
       ('python-desde-cero', 2),
       ('fundamentos-ia-ml', 3)
     ) as v(course_slug, ord) on true
join public.courses c on c.slug = v.course_slug
where t.slug = 'ruta-datos-ia'
on conflict (track_id, course_id) do update set
  sort_order = excluded.sort_order;

-- ── 3 · Prerrequisitos reales ───────────────────────────────────────
-- fundamentos-ia-ml requiere python-desde-cero Y sql-oracle.
-- python-desde-cero no requiere nada (curso de inicio de su tema).
-- El trigger anti-ciclos de la 004 valida estas filas al insertarlas.
insert into public.course_prerequisites (course_id, prerequisite_course_id)
select destino.id, previo.id
from public.courses destino
join public.courses previo
  on previo.slug in ('python-desde-cero', 'sql-oracle')
where destino.slug = 'fundamentos-ia-ml'
on conflict (course_id, prerequisite_course_id) do nothing;

-- ── 4 · RLS: metadata de catálogo pública, contenido protegido ──────
-- courses: la metadata (título, descripción de venta, categoría, nivel)
-- es legible aunque el curso no esté publicado. El frontend filtra por
-- is_published donde corresponde (courseStore .eq('is_published', true)).
drop policy if exists "cursos publicados legibles" on public.courses;
drop policy if exists "metadata de cursos legible" on public.courses;
create policy "metadata de cursos legible"
  on public.courses for select
  using (true);

-- track_courses: basta con que la RUTA esté publicada.
drop policy if exists "cursos de rutas publicadas legibles" on public.track_courses;
create policy "cursos de rutas publicadas legibles"
  on public.track_courses for select
  using (
    exists (select 1 from public.tracks t
            where t.id = track_id and t.is_published)
  );

-- course_prerequisites: metadata de relación, legible siempre.
drop policy if exists "prerrequisitos de cursos publicados legibles" on public.course_prerequisites;
drop policy if exists "prerrequisitos legibles" on public.course_prerequisites;
create policy "prerrequisitos legibles"
  on public.course_prerequisites for select
  using (true);
