-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 003 — curso "SQL con Oracle" + sus 10 módulos
-- ═══════════════════════════════════════════════════════════════════
-- Crea el curso (slug 'sql-oracle', el mismo que ya usa user_progress:
-- el XP acumulado de los usuarios se conserva) y el esqueleto de los
-- 10 módulos. El contenido de cada módulo llega en seeds 010, 011, …
-- Idempotente: puede re-ejecutarse sin duplicar nada.
-- Ejecutar DESPUÉS de 002_course_content_schema.sql
-- ═══════════════════════════════════════════════════════════════════

insert into public.courses
  (slug, title, subtitle, description, icon, accent, language, is_published, sort_order)
values (
  'sql-oracle',
  'SQL con Oracle',
  'De fundamentos a senior',
  'Modelado de datos, modelo relacional, normalización, Oracle SQL desde DDL hasta funciones de ventana, transacciones, tuning y PL/SQL. Con un hospital como caso real de principio a fin.',
  '🏛️',
  'gold',
  'sql',
  true,
  2
)
on conflict (slug) do update set
  title        = excluded.title,
  subtitle     = excluded.subtitle,
  description  = excluded.description,
  icon         = excluded.icon,
  accent       = excluded.accent,
  language     = excluded.language,
  is_published = excluded.is_published,
  sort_order   = excluded.sort_order;

insert into public.modules (course_id, slug, title, summary, sort_order)
select c.id, v.slug, v.title, v.summary, v.ord
from public.courses c,
     (values
       ('m01-modelo-de-datos',      'Fundamentos del modelo de datos',
        'Entidades, atributos, relaciones, modelo ER, cardinalidad y llaves.', 1),
       ('m02-modelo-relacional',    'El modelo relacional formal',
        'Relación, tupla, atributo, dominio, grado e integridad.', 2),
       ('m03-normalizacion',        'Normalización',
        'Dependencias funcionales, 1FN a BCNF y desnormalización estratégica.', 3),
       ('m04-ddl-oracle',           'DDL en Oracle',
        'CREATE TABLE, tipos de datos Oracle y constraints.', 4),
       ('m05-dml-consultas',        'DML y consultas',
        'INSERT, UPDATE, DELETE, SELECT, WHERE, ORDER BY y funciones de fila.', 5),
       ('m06-joins-subqueries',     'Joins y subqueries',
        'Todos los joins en sintaxis ANSI y Oracle clásica, y subconsultas.', 6),
       ('m07-agregacion-analitica', 'Agregación y analítica',
        'GROUP BY, HAVING, CTEs y funciones de ventana.', 7),
       ('m08-transacciones',        'Transacciones y concurrencia',
        'COMMIT, ROLLBACK, ACID y cómo Oracle maneja la concurrencia.', 8),
       ('m09-indices-tuning',       'Índices y tuning',
        'Índices B-tree, EXPLAIN PLAN y optimización básica.', 9),
       ('m10-plsql',                'Introducción a PL/SQL',
        'Bloques, cursores, procedures, functions, triggers y excepciones.', 10)
     ) as v(slug, title, summary, ord)
where c.slug = 'sql-oracle'
on conflict (course_id, slug) do update set
  title      = excluded.title,
  summary    = excluded.summary,
  sort_order = excluded.sort_order;
