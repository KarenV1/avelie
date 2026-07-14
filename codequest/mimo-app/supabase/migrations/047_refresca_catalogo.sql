-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 047 — refresco de la metadata del catálogo
-- ═══════════════════════════════════════════════════════════════════
-- Solo toca la tabla courses (description/subtitle). NO toca módulos,
-- lecciones, bloques ni progreso: cero riesgo para los alumnos.
--
-- 1 · PYTHON — corrige una violación de la regla de contenido: la
--     descripción revelaba la tecnología interna ("en tu navegador",
--     "sin que tus datos salgan de tu equipo"). El entorno se describe
--     por su USO (editor, consola, salida) y por su transferibilidad
--     a una terminal o un IDE — la magia no se explica.
--
-- 2 · SQL ORACLE — la descripción databa de cuando el curso tenía 10
--     módulos; el temario obligatorio lo llevó a 13. Ahora nombra lo
--     que realmente cubre (modelado avanzado, el mapeo al esquema,
--     seguridad y el proyecto integrador) sin volverse un inventario.
--
-- Redes se queda como está: su descripción sigue siendo exacta.
-- Idempotente. Ejecutar en cualquier momento.
-- ═══════════════════════════════════════════════════════════════════

update public.courses
set description = 'Del primer print al proyecto integrador: en cada práctica escribes Python real en el editor y ves su salida en la consola — el mismo gesto que harás después en una terminal o un IDE. Con los datos de la clínica como caso real.'
where slug = 'python-desde-cero';

update public.courses
set description = 'Del modelo de datos al proyecto integrador: entidades y llaves, normalización, modelado avanzado, el mapeo a un esquema Oracle, DDL, consultas y joins, analítica, transacciones y seguridad, optimización y PL/SQL. Con un hospital como caso real de principio a fin.'
where slug = 'sql-oracle';
