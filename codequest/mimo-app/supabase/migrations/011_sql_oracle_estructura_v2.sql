-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 011 — SQL con Oracle · estructura v2 (13 módulos)
-- ═══════════════════════════════════════════════════════════════════
-- Reestructura para cubrir el temario obligatorio completo (13 partes).
-- Mapa temario → módulos:
--   Parte I    → M1  (m01-modelo-de-datos, extendido en la 012)
--   Parte II   → M2  (m02-modelo-relacional, REDEFINIDO: identidad y
--                reglas — la teoría formal tupla/dominio/grado YA vive
--                en M1 'anatomía de la tabla': no se duplica)
--                + m3a (arcos, jerarquías, recursión, subtipos)
--   Parte III  → M3  (m03-normalizacion)
--   Parte IV   → m3a (modelado temporal e histórico)
--   Partes V,VI,VIII → m3b (legibilidad ERD, mapeo físico, SDLC+CRUD)
--   Parte VII  → m04-ddl-oracle (nomenclatura por versión, integridad,
--                constraints declarativas vs triggers)
--   Parte IX   → m05 (SELECT/funciones de fila/NVL/CASE) · m06 (joins,
--                operadores de conjunto, subconsultas) · m07 (agregación)
--   Parte X    → m04 (DDL, vistas, secuencias, sinónimos) + m05 (DML/MERGE)
--   Parte XI   → m08 (transacciones ACID + seguridad GRANT/REVOKE) y
--                REGEXP_* en m05 (funciones de texto avanzado)
--   Parte XII  → m09 (calidad, optimizador, plan, estadísticas, hints)
--   Parte XIII → m11-proyecto-integrador (NUEVO, cierre del curso)
-- Los slugs existentes NO cambian (progreso de usuarios intacto);
-- solo se reordena sort_order y se agregan m3a, m3b y m11.
-- Prefijos m3a-/m3b-/m11- garantizan lecciones sin colisión de slug.
-- Numeración de contenido: 012=M1v2 · 013+ en orden (042+ al agotarse
-- el rango 010–019).
-- Aditiva e idempotente. Ejecutar DESPUÉS de 003.
-- ═══════════════════════════════════════════════════════════════════

insert into public.modules (course_id, slug, title, summary, sort_order)
select c.id, v.slug, v.title, v.summary, v.ord
from public.courses c,
     (values
       ('m01-modelo-de-datos',      'Fundamentos del modelo de datos',
        'Datos vs información, los tres niveles del modelo, entidades, atributos, relaciones, cardinalidad y llaves.', 1),
       ('m02-modelo-relacional',    'Identidad y reglas de negocio',
        'La taxonomía de UIDs, claves candidatas y alternativas, dependencia existencial, transferibilidad y reglas estructurales vs de procedimiento.', 2),
       ('m03-normalizacion',        'Normalización',
        'Dependencias funcionales, anomalías, 1FN a 3FN (y BCNF), y el riesgo de negocio de la redundancia.', 3),
       ('m3a-modelado-avanzado',    'Modelado avanzado',
        'Arcos, jerarquías, recursión, supertipos y subtipos, y el modelado temporal de datos históricos.', 4),
       ('m3b-modelo-a-oracle',      'Del modelo al esquema Oracle',
        'Legibilidad del ERD, mapeo a tablas (PK, FK, intersección, subtipos, arcos), SDLC y análisis CRUD.', 5),
       ('m04-ddl-oracle',           'DDL en Oracle',
        'CREATE/ALTER/DROP, tipos de datos, nomenclatura por versión, integridad y constraints, vistas, secuencias y sinónimos.', 6),
       ('m05-dml-consultas',        'DML y consultas',
        'INSERT, UPDATE, DELETE, MERGE, SELECT, WHERE, ORDER BY, funciones de fila, NVL/CASE/DECODE y texto avanzado.', 7),
       ('m06-joins-subqueries',     'Joins y subqueries',
        'Todos los joins en sintaxis ANSI, self join, operadores de conjunto y subconsultas (una fila, múltiples, correladas, inline views).', 8),
       ('m07-agregacion-analitica', 'Agregación y analítica',
        'Funciones de grupo, GROUP BY, HAVING, CTEs y funciones de ventana.', 9),
       ('m08-transacciones',        'Transacciones y seguridad',
        'ACID, COMMIT, ROLLBACK, SAVEPOINT, concurrencia en Oracle, y privilegios con GRANT/REVOKE.', 10),
       ('m09-indices-tuning',       'Calidad y optimización',
        'SQL legible y mantenible, índices, el optimizador, EXPLAIN PLAN, estadísticas y el uso responsable de hints.', 11),
       ('m10-plsql',                'Introducción a PL/SQL',
        'Bloques, cursores, procedures, functions, triggers y excepciones.', 12),
       ('m11-proyecto-integrador',  'Proyecto integrador',
        'El encargo completo del hospital: del caso de negocio al esquema con consultas, vistas, seguridad y validación CRUD. Evaluación final.', 13)
     ) as v(slug, title, summary, ord)
where c.slug = 'sql-oracle'
on conflict (course_id, slug) do update set
  title      = excluded.title,
  summary    = excluded.summary,
  sort_order = excluded.sort_order;
