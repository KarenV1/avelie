-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 031 — Python desde Cero · estructura v2 (9 módulos)
-- ═══════════════════════════════════════════════════════════════════
-- GIRO DE DIRECCIÓN (aprobado 2026-07-09): las prácticas dejan Colab y
-- pasan a ejecutarse DENTRO de la app con Pyodide (Python real en el
-- navegador). El temario crece de 7 a 9 módulos (CS50P/Helsinki/MIT);
-- pandas/matplotlib se van a un futuro curso Intermedio.
--
-- Esta migración:
--   · elimina los módulos del temario v1 que ya no existen (el curso
--     NO está publicado y no hay progreso de usuarios: es seguro)
--   · registra los 9 módulos definitivos
--   · corrige la descripción del curso (adiós Colab)
--
-- Política de datasets (URL centralizada, sin cambios de fondo):
--   https://codequest-coral.vercel.app/datasets aparece SOLO en bloques
--   de M7 (038) y M9 (040), siempre en la variable Python BASE_DATOS al
--   inicio del bloque de código que la use.
--
-- Numeración: 032-040 = contenido M1-M9 · 041 = publica (is_published).
-- Aditiva e idempotente. Ejecutar DESPUÉS de 008 y 030.
-- ═══════════════════════════════════════════════════════════════════

-- ── 1 · Fuera los módulos del temario v1 que no siguen ──────────────
-- (cascade: sus lessons y content_blocks caen con ellos)
delete from public.modules
where course_id = (select id from public.courses where slug = 'python-desde-cero')
  and slug not in (
    'm01-primeros-pasos',
    'm02-decisiones',
    'm03-bucles',
    'm04-estructuras-de-datos',
    'm05-funciones',
    'm06-excepciones-y-robustez',
    'm07-archivos-y-csv',
    'm08-pruebas-y-depuracion',
    'm09-proyecto-integrador'
  );

-- ── 2 · Los 9 módulos definitivos ───────────────────────────────────
insert into public.modules (course_id, slug, title, summary, sort_order)
select c.id, v.slug, v.title, v.summary, v.ord
from public.courses c,
     (values
       ('m01-primeros-pasos',        'Primeros pasos',
        'Python, tu editor, variables, tipos y tu primer programa completo.', 1),
       ('m02-decisiones',            'Decisiones',
        'if, elif y else: programas que deciden, del comparador al diagrama de flujo.', 2),
       ('m03-bucles',                'Bucles',
        'for, range, cadenas como secuencias, while y acumuladores.', 3),
       ('m04-estructuras-de-datos',  'Estructuras de datos',
        'Listas, diccionarios, tuplas y sets — y la analogía central: lista de diccionarios = tabla.', 4),
       ('m05-funciones',             'Funciones',
        'def, parámetros y return: encapsular pasos con nombre (y leer clases sin miedo).', 5),
       ('m06-excepciones-y-robustez','Excepciones y robustez',
        'try/except y validación de datos sucios: programas que no se caen.', 6),
       ('m07-archivos-y-csv',        'Archivos y CSV',
        'Leer y escribir archivos y CSV con la librería estándar — los datos de la clínica.', 7),
       ('m08-pruebas-y-depuracion',  'Pruebas y depuración',
        'Leer tracebacks, depurar con print y blindar con assert.', 8),
       ('m09-proyecto-integrador',   'Proyecto integrador',
        'El encargo de la clínica: análisis completo con Python puro y el puente a IA/ML.', 9)
     ) as v(slug, title, summary, ord)
where c.slug = 'python-desde-cero'
on conflict (course_id, slug) do update set
  title      = excluded.title,
  summary    = excluded.summary,
  sort_order = excluded.sort_order;

-- ── 3 · La descripción del curso, sin Colab ─────────────────────────
update public.courses
set description = 'Python de verdad en tu navegador: en cada práctica escribes y ejecutas código real, sin instalar nada y sin que tus datos salgan de tu equipo. Del primer print al proyecto integrador con los datos de la clínica.'
where slug = 'python-desde-cero';
