-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 006 — curso "Redes y Sistemas" + sus 7 módulos
-- ═══════════════════════════════════════════════════════════════════
-- Curso fundacional del catálogo (Fase 1): puerta de entrada a nube,
-- DFIR y ciberseguridad. Crea el curso, el esqueleto de 7 módulos y lo
-- asigna como curso 1 de la ruta Fundamentos.
-- El contenido de cada módulo llega en seeds 020, 021, …
-- Idempotente: puede re-ejecutarse sin duplicar nada.
-- Ejecutar DESPUÉS de 002, 003, 004 y 005.
-- ═══════════════════════════════════════════════════════════════════

insert into public.courses
  (slug, title, subtitle, description, icon, accent, language,
   categoria, nivel, is_published, sort_order)
values (
  'redes-y-sistemas',
  'Redes y Sistemas',
  'La base de todo lo demás',
  'Entiende cómo viajan los datos: redes, direcciones IP, protocolos, procesos y permisos. Es el curso que desbloquea el resto del catálogo — sin esto, la nube, el análisis forense y la ciberseguridad son solo palabras.',
  '🌐',
  'gold',
  'bash',
  'fundamentos',
  'basico',
  true,
  1
)
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

insert into public.modules (course_id, slug, title, summary, sort_order)
select c.id, v.slug, v.title, v.summary, v.ord
from public.courses c,
     (values
       ('m01-que-es-una-red',        '¿Qué es una red?',
        'De dos computadoras a internet: clientes, servidores y las piezas físicas.', 1),
       ('m02-modelos-osi-tcpip',     'Los modelos: OSI y TCP/IP',
        'El mapa mental de las redes: capas, encapsulamiento y el modelo real de internet.', 2),
       ('m03-direccionamiento',      'Direccionamiento',
        'IP, subredes, NAT, DHCP, DNS e IPv6: cómo se encuentran las máquinas.', 3),
       ('m04-protocolos-clave',      'Protocolos clave',
        'Puertos, TCP/UDP, HTTP/HTTPS, TLS, SSH y correo: lo que viaja por la red.', 4),
       ('m05-sistemas',              'Sistemas: procesos, servicios y permisos',
        'Qué corre detrás: procesos, puertos abiertos, usuarios, permisos y logs.', 5),
       ('m06-routing-y-segmentacion','Routing, firewalls y segmentación',
        'VLANs, routing, firewalls, VPN y Wi-Fi: la red empresarial bien diseñada.', 6),
       ('m07-trafico-y-puente',      'Tráfico real y el puente al catálogo',
        'Wireshark sobre tu propio tráfico y cómo todo conecta con nube, DFIR y ciberseguridad.', 7)
     ) as v(slug, title, summary, ord)
where c.slug = 'redes-y-sistemas'
on conflict (course_id, slug) do update set
  title      = excluded.title,
  summary    = excluded.summary,
  sort_order = excluded.sort_order;

-- ── Curso 1 de la ruta Fundamentos ──────────────────────────────────
insert into public.track_courses (track_id, course_id, sort_order)
select t.id, c.id, 1
from public.tracks t, public.courses c
where t.slug = 'ruta-fundamentos' and c.slug = 'redes-y-sistemas'
on conflict (track_id, course_id) do update set
  sort_order = excluded.sort_order;

-- ── Prerrequisitos FUTUROS (activar cuando existan esos cursos) ─────
-- "Redes y Sistemas" no tiene prerrequisitos de entrada: es el curso
-- de inicio. Cuando se carguen los cursos de nube y DFIR, descomentar:
--
-- insert into public.course_prerequisites (course_id, prerequisite_course_id)
-- select destino.id, redes.id
-- from public.courses destino, public.courses redes
-- where redes.slug = 'redes-y-sistemas'
--   and destino.slug in ('nube', 'dfir')   -- ajustar a los slugs reales
-- on conflict (course_id, prerequisite_course_id) do nothing;
