-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 005 — seed mínimo del catálogo (Fase 0)
-- ═══════════════════════════════════════════════════════════════════
-- Solo valida el modelo: 5 rutas (4 vacías) + el curso de SQL asignado
-- a su categoría y a la ruta Datos e IA. SIN contenido de cursos.
-- Idempotente (upserts). Ejecutar DESPUÉS de 003 y 004.
-- ═══════════════════════════════════════════════════════════════════

-- ── Las 5 rutas de aprendizaje ───────────────────────────────────────
insert into public.tracks (slug, title, description, icon, accent, sort_order, is_published)
values
  ('ruta-fundamentos',   'Fundamentos',
   'La base común: cómo funcionan los sistemas, las redes y los datos.',
   '🧭', 'gold', 1, true),
  ('ruta-cumplimiento',  'Cumplimiento y Protección de Datos',
   'Normativas, privacidad y gestión del riesgo: la cara legal de la seguridad.',
   '⚖️', 'gold', 2, true),
  ('ruta-defensa',       'Defensa técnica',
   'Proteger infraestructuras: hardening, detección y respuesta.',
   '🛡️', 'gold', 3, true),
  ('ruta-investigacion', 'Investigación Digital (DFIR y OSINT)',
   'Análisis forense, respuesta a incidentes y fuentes abiertas.',
   '🔎', 'gold', 4, true),
  ('ruta-datos-ia',      'Datos e IA',
   'Del modelo de datos al análisis: la ruta donde vive SQL.',
   '📊', 'gold', 5, true)
on conflict (slug) do update set
  title       = excluded.title,
  description = excluded.description,
  icon        = excluded.icon,
  accent      = excluded.accent,
  sort_order  = excluded.sort_order,
  is_published = excluded.is_published;

-- ── El curso de SQL: categoría, nivel y su lugar en la ruta ─────────
update public.courses
set categoria = 'datos_ia',
    nivel     = 'basico'
where slug = 'sql-oracle';

insert into public.track_courses (track_id, course_id, sort_order)
select t.id, c.id, 1
from public.tracks t, public.courses c
where t.slug = 'ruta-datos-ia' and c.slug = 'sql-oracle'
on conflict (track_id, course_id) do update set
  sort_order = excluded.sort_order;

-- (course_prerequisites queda vacía a propósito: se poblará cuando
-- existan más cursos. Ejemplo futuro:
--   insert into course_prerequisites (course_id, prerequisite_course_id)
--   select nube.id, redes.id from courses nube, courses redes
--   where nube.slug = 'nube' and redes.slug = 'redes';
-- El trigger de 004 rechazará cualquier ciclo.)
