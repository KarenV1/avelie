-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 041 — Python desde Cero · PUBLICACIÓN 🚀
-- ═══════════════════════════════════════════════════════════════════
-- El flip final: is_published = true. Al ejecutarla, el contenido del
-- curso (9 módulos, 56 lecciones, 340 bloques) se vuelve visible AL
-- INSTANTE para todos los usuarios:
--   · las políticas RLS de modules/lessons/content_blocks dejan pasar
--     el contenido (verifican courses.is_published en cadena)
--   · courseStore (.eq is_published true) lo carga en "Mis cursos"
--   · en el LearningPath de la ruta Datos e IA deja de decir
--     "en preparación" y se vuelve clickeable
-- Ejecutar SOLO cuando 031-040 estén aplicadas y revisadas.
--
-- Verificación previa recomendada (correr ANTES del flip):
--
--   select m.sort_order, m.slug,
--          count(distinct l.id) as lecciones,
--          count(b.id)          as bloques
--   from modules m
--   join courses c on c.id = m.course_id
--   left join lessons l on l.module_id = m.id
--   left join content_blocks b on b.lesson_id = l.id
--   where c.slug = 'python-desde-cero'
--   group by m.sort_order, m.slug
--   order by m.sort_order;
--
--   Esperado: 9 módulos — m01: 6/41 · m02: 6/39 · m03: 6/39
--   · m04: 7/46 · m05: 6/39 · m06: 6/37 · m07: 6/34 · m08: 6/34
--   · m09: 7/31. Total: 56 lecciones, 340 bloques.
-- ═══════════════════════════════════════════════════════════════════

update public.courses
set is_published = true
where slug = 'python-desde-cero';
