-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 008 — "Python desde Cero" · esqueleto de módulos
-- ═══════════════════════════════════════════════════════════════════
-- El curso ya existe (migración 007, is_published = false — NO se
-- publica aquí; el flip llega en la 037 cuando todo esté cargado).
-- Esta migración solo crea los 7 módulos. Contenido: migraciones 030–036.
--
-- DATASETS DEL CURSO (condición de Karen: URL centralizada/documentada):
--   URL base: https://codequest-coral.vercel.app/datasets
--   Archivos: pacientes.csv (38), citas.csv (50), inventario_farmacia.csv (30)
--   Viven en public/datasets/ del repo (los sirve Vercel como estáticos).
--   La URL SOLO aparece en bloques de M5–M7 (migraciones 034–036) y cada
--   bloque la define en una variable Python BASE_DATOS al inicio del
--   código, para que un cambio de dominio sea un buscar-y-reemplazar
--   acotado a esas migraciones.
--
-- Idempotente. Ejecutar DESPUÉS de 007.
-- ═══════════════════════════════════════════════════════════════════

insert into public.modules (course_id, slug, title, summary, sort_order)
select c.id, v.slug, v.title, v.summary, v.ord
from public.courses c,
     (values
       ('m01-primeros-pasos',     'Primeros pasos',
        'Qué es Python, tu laboratorio en Colab, variables, tipos y tu primer programa.', 1),
       ('m02-control-de-flujo',   'Control de flujo',
        'Decisiones con if, repetición con for y while, y pensar en algoritmos.', 2),
       ('m03-estructuras-de-datos','Estructuras de datos',
        'Listas, diccionarios, tuplas y sets — y la analogía central: lista de diccionarios = tabla.', 3),
       ('m04-funciones',          'Funciones',
        'Encapsular pasos con def, parámetros, return y leer clases sin miedo.', 4),
       ('m05-archivos-y-errores', 'Archivos y errores',
        'Leer y escribir texto y CSV, y defenderse de los datos sucios con try/except.', 5),
       ('m06-pandas-y-matplotlib','pandas y matplotlib',
        'El DataFrame como tu tabla: filtrar, agrupar y graficar — cada operación con su equivalente SQL.', 6),
       ('m07-proyecto-integrador','Proyecto integrador y puente',
        'El encargo de la clínica de principio a fin, y el puente a IA y machine learning.', 7)
     ) as v(slug, title, summary, ord)
where c.slug = 'python-desde-cero'
on conflict (course_id, slug) do update set
  title      = excluded.title,
  summary    = excluded.summary,
  sort_order = excluded.sort_order;
