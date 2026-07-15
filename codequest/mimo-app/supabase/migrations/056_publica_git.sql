-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 056 — Publicación del curso Git desde Cero
-- ═══════════════════════════════════════════════════════════════════
-- FLIP DE PUBLICACIÓN. Pone is_published = true en el curso git-desde-cero.
-- A partir de aquí, la RLS deja ver su contenido (módulos + lecciones +
-- bloques): el curso se vuelve VISIBLE en el catálogo y ENTRABLE.
--
-- ⚠️ CORRER SOLO DESPUÉS de haber ejecutado 048-055 (estructura + los 7
-- módulos M1-M7). Una vez publicado, verificar de inmediato vía anon que
-- los 7 módulos tengan su contenido; si alguno sale corto, re-correr su
-- seed (son idempotentes) — mismo protocolo que el lanzamiento de Python.
--
-- Conteo esperado tras la publicación (para la verificación):
--   m01-fundamentos    8 lecciones / 56 bloques
--   m02-historial      9 lecciones / 75 bloques
--   m03-ramas         10 lecciones / 72 bloques
--   m04-remotos        9 lecciones / 62 bloques
--   m05-recuperacion   7 lecciones / 50 bloques
--   m06-empresa        6 lecciones / 41 bloques
--   m07-proyecto       7 lecciones / 49 bloques
--   TOTAL             56 lecciones / 405 bloques
--
-- Idempotente. Ejecutar DESPUÉS de 048-055.
-- ═══════════════════════════════════════════════════════════════════

update public.courses
set is_published = true
where slug = 'git-desde-cero';
