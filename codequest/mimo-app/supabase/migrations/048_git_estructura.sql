-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 048 — Git desde Cero · estructura (7 módulos)
-- ═══════════════════════════════════════════════════════════════════
-- Primera migración de contenido del curso git-desde-cero (registrado
-- en el catálogo por la 009, is_published = false). Aquí:
--   1 · refresca la metadata del curso (decisión 3 de Karen: el curso
--       llega a intermedio — bisect, reflog, rebase, CI, GitFlow — así
--       que nivel pasa a 'intermedio' y la descripción lo anuncia).
--       El frontend ya rotula 'intermedio' (LearningPath.jsx): seguro.
--   2 · crea los 7 módulos (mapa temario→módulo en el header).
-- El curso SIGUE is_published = false: nada visible hasta el flip final
-- (tras sembrar los 7 módulos). Los módulos nacen is_published = true
-- para que el flip del curso los muestre todos de golpe.
--
-- Mapa temario (docs/GIT_TEMARIO.md) → módulos:
--   U1 (bloques 1-6 + P1)        → m01-fundamentos
--   U2 (7-13 + P2 + eval interm) → m02-historial       (examen ampliado)
--   U3 (14-21 + P3)              → m03-ramas
--   U4 (22-29 + P4)              → m04-remotos
--   U5 (30-34 + P5)              → m05-recuperacion
--   U5 (35-38)                   → m06-empresa
--   Proyecto + evaluación final  → m07-proyecto         (examen ampliado)
--
-- Aditiva e idempotente. Ejecutar DESPUÉS de 009.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1 · Metadata del curso (decisión 3) ─────────────────────────────
update public.courses
set nivel       = 'intermedio',
    subtitle    = 'Del primer commit al flujo de equipo',
    description  = 'Control de versiones de principio a fin: del primer commit y el historial limpio a ramas, fusiones y conflictos, y de ahí al trabajo de equipo real — remotos, Pull Requests, revisión de código y recuperación segura de errores. Con prácticas en el editor y el repositorio de la clínica como caso.'
where slug = 'git-desde-cero';

-- ── 2 · Los 7 módulos ───────────────────────────────────────────────
insert into public.modules (course_id, slug, title, summary, sort_order, is_published)
select c.id, v.slug, v.title, v.summary, v.ord, true
from public.courses c,
     (values
       ('m01-fundamentos',   'Fundamentos y el primer commit',
        'Qué problema resuelve el control de versiones, la identidad, las tres áreas (working, staging, repositorio), el primer commit y la lectura del historial.', 1),
       ('m02-historial',     'Un historial profesional',
        'Ciclo de vida de los archivos, staging selectivo y commits atómicos, git diff, mensajes profesionales, .gitignore, amend, tags y versionado semántico.', 2),
       ('m03-ramas',         'Ramas, fusiones y conflictos',
        'La rama como puntero, git switch, el flujo por funcionalidad, merge (fast-forward vs tres vías), la resolución de conflictos, rebase introductorio y stash.', 3),
       ('m04-remotos',       'Remotos y colaboración de equipo',
        'origin, clone, push, fetch y pull, el flujo basado en incidencias, Pull/Merge Requests, revisión de código, ramas protegidas y el papel de Git en la integración continua.', 4),
       ('m05-recuperacion',  'Recuperación y diagnóstico',
        'restore, revert y reset (con su tabla imprescindible), reflog para recuperar lo perdido y bisect para encontrar el commit que introdujo un error.', 5),
       ('m06-empresa',       'Git en la empresa: releases, flujos y seguridad',
        'Releases, tags y hotfixes; los flujos de ramas de los equipos (trunk-based, GitHub Flow, GitFlow); la seguridad de los secretos; y cómo incorporarse a un proyecto existente.', 6),
       ('m07-proyecto',      'Proyecto integrador',
        'El flujo completo de una funcionalidad de empresa: del ticket al despliegue, con rama, Pull Request, revisión, conflicto, tag y una reversión segura. Evaluación final.', 7)
     ) as v(slug, title, summary, ord)
where c.slug = 'git-desde-cero'
on conflict (course_id, slug) do update set
  title        = excluded.title,
  summary      = excluded.summary,
  sort_order   = excluded.sort_order,
  is_published = excluded.is_published;
