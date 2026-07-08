-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 009 — registro de la ruta Desarrollo
-- ═══════════════════════════════════════════════════════════════════
-- SOLO registro en catálogo (sin módulos, lecciones ni bloques):
--   · la 6.ª ruta: Desarrollo
--   · 2 cursos "próximamente" (is_published = false)
--   · SIN prerrequisitos entre ellos: el orden Git → JavaScript es
--     recomendación didáctica (posición en la ruta), no candado.
-- No toca RLS: las políticas de la 007 ya cubren este caso
-- (metadata de courses legible siempre; track_courses solo exige
-- que la RUTA esté publicada).
-- Aditiva e idempotente. Ejecutar DESPUÉS de 004, 005 y 007.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1 · La ruta Desarrollo ──────────────────────────────────────────
insert into public.tracks (slug, title, description, icon, accent, sort_order, is_published)
values
  ('desarrollo', 'Desarrollo',
   'Del control de versiones al código seguro: las herramientas del oficio de programar.',
   '💻', 'gold', 6, true)
on conflict (slug) do update set
  title        = excluded.title,
  description  = excluded.description,
  icon         = excluded.icon,
  accent       = excluded.accent,
  sort_order   = excluded.sort_order,
  is_published = excluded.is_published;

-- ── 2 · Los dos cursos futuros ──────────────────────────────────────
-- sort_order de courses sigue la serie global: redes 1, sql 2,
-- python 3, ia-ml 4 → git 5, javascript 6.
insert into public.courses
  (slug, title, subtitle, description, icon, accent, language,
   categoria, nivel, is_published, sort_order)
values
  ('git-desde-cero',
   'Git desde Cero',
   'Tu historial bajo control',
   'Control de versiones desde el primer commit: ramas, fusiones y trabajo en equipo, con prácticas en el editor.',
   '🌿', 'gold', 'bash',
   'desarrollo', 'basico', false, 5),
  ('javascript-moderno',
   'JavaScript Moderno',
   'El lenguaje de la web',
   'El lenguaje de la web, del fundamento al DOM y las APIs: variables, funciones, eventos y cómo conversar con un servidor.',
   '⚡', 'gold', 'javascript',
   'desarrollo', 'basico', false, 6)
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

-- ── 3 · Posiciones 1 y 2 de la ruta Desarrollo ──────────────────────
insert into public.track_courses (track_id, course_id, sort_order)
select t.id, c.id, v.ord
from public.tracks t
join (values
       ('git-desde-cero',     1),
       ('javascript-moderno', 2)
     ) as v(course_slug, ord) on true
join public.courses c on c.slug = v.course_slug
where t.slug = 'desarrollo'
on conflict (track_id, course_id) do update set
  sort_order = excluded.sort_order;

-- ── 4 · Prerrequisitos: ninguno ─────────────────────────────────────
-- Git → JavaScript queda como orden sugerido por la ruta, sin candado.
-- (Prerrequisito futuro, cuando exista el curso de AppSec/DevSecOps:
--   insert into public.course_prerequisites (course_id, prerequisite_course_id)
--   select destino.id, previo.id
--   from public.courses destino
--   join public.courses previo on previo.slug = 'javascript-moderno'
--   where destino.slug = 'appsec-devsecops'
--   on conflict (course_id, prerequisite_course_id) do nothing;
-- El trigger anti-ciclos de la 004 lo validará al ejecutarlo.)
