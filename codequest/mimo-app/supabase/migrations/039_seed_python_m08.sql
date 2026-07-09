-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 039 — Python desde Cero · Módulo 8: Pruebas y depuración
-- ═══════════════════════════════════════════════════════════════════
-- Temario v2 (9 módulos), con el ajuste aprobado: assert y funciones
-- probar_* propias — pytest solo se menciona como herramienta de la
-- industria (se practica en el futuro curso Intermedio).
-- Paga la semilla del examen del M5: funciones con return son
-- funciones COMPROBABLES.
-- La práctica es especial: el alumno escribe la prueba que DELATA un
-- bug plantado (caso frontera 38.0 con > en vez de >=) y luego lo
-- corrige — el flujo profesional completo.
-- Reglas de contenido: sin tecnología interna; quizzes autocontenidos
-- o con términos técnicos.
-- El curso sigue is_published = false hasta la 041.
-- Idempotente: borra y recrea las lecciones de ESTE módulo.
-- Ejecutar DESPUÉS de 031 (estructura v2).
-- ═══════════════════════════════════════════════════════════════════

-- Limpia el módulo (cascade borra sus content_blocks)
delete from public.lessons
where module_id = (
  select m.id
  from public.modules m
  join public.courses c on c.id = m.course_id
  where c.slug = 'python-desde-cero' and m.slug = 'm08-pruebas-y-depuracion'
);

-- ── Lecciones del módulo ──────────────────────────────────────────────
insert into public.lessons (module_id, slug, title, kind, xp, sort_order)
select m.id, v.slug, v.title, v.kind, v.xp, v.ord
from public.modules m
join public.courses c on c.id = m.course_id,
     (values
       ('m08-l01-leer-la-escena',    'Depurar: leer la escena del error', 'leccion',  20, 1),
       ('m08-l02-print-linterna',    'print: la linterna del detective',  'leccion',  20, 2),
       ('m08-l03-assert',            'assert: afirmaciones que vigilan',  'leccion',  20, 3),
       ('m08-l04-banco-de-pruebas',  'Tu banco de pruebas',               'leccion',  20, 4),
       ('m08-l05-practica-cazador',  'Práctica: caza el bug frontera',    'practica', 20, 5),
       ('m08-x01-examen',            'Examen: Pruebas y depuración',      'examen',   40, 6)
     ) as v(slug, title, kind, xp, ord)
where c.slug = 'python-desde-cero' and m.slug = 'm08-pruebas-y-depuracion';

-- ═════════════════════════════════════════════════════════════════════
-- L01 · Depurar: leer la escena del error
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Los bugs no son fracasos: son rutina","body":"Primera verdad del oficio: TODO programador produce bugs, todos los días — la diferencia entre junior y senior no es cuántos crean, sino qué tan rápido los encuentran. Los bugs vienen en dos familias. Los que REVIENTAN: el programa se detiene y el traceback te regala tipo, mensaje y línea — ya sabes leerlo (módulo 6), y el flujo de trabajo es directo: ir a la línea señalada, leer el mensaje con calma, entender qué esperaba Python y qué recibió. Y los SILENCIOSOS: el programa corre feliz de principio a fin… con el resultado EQUIVOCADO. Un promedio mal calculado, un contador que no cuenta. Son los peores — nadie te avisa — y para cazarlos necesitas las herramientas de este módulo."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Autopsia de un error que revienta","code":"citas = [\n    {\"paciente\": \"Ana Torres\", \"costo\": \"850\"},\n    {\"paciente\": \"Luis Vega\",  \"costo\": \"600\"}\n]\n\ntotal = 0\nfor cita in citas:\n    total = total + cita[\"costo\"]   # ← línea 8\n\nprint(f\"Total: {total}\")","result":{"columns":["CONSOLA"],"rows":[["Traceback (most recent call last):"],["  File \"<exec>\", line 8, in <module>"],["TypeError: unsupported operand type(s) for +=: 'int' and 'str'"]],"note":"El traceback lo dice todo: línea 8, TypeError, int + str. Los costos venían como TEXTO (¿de un CSV, quizá?) y faltó int(cita[\"costo\"])."},"caption":"Lectura profesional: tipo (TypeError) → qué esperaba y qué recibió (int y str) → línea (8) → arreglo (convertir). Treinta segundos, no treinta minutos."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos de depuración, ¿cuáles son las dos familias de bugs?","options":["Los grandes y los pequeños","Los que REVIENTAN (traceback: tipo, mensaje, línea) y los SILENCIOSOS (el programa corre, el resultado está mal)","Los de sintaxis y los de teclado","Los del lunes y los del viernes"],"correctIndex":1,"feedback":{"correct":"Correcto. Y los silenciosos son los peores: nadie te avisa — por eso existen las pruebas.","incorrect":"Dos familias: los que se anuncian con traceback y los silenciosos que corrompen resultados sin avisar."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"Aparece un traceback. ¿Cuál es el primer movimiento profesional?","options":["Borrar el código y empezar de nuevo","Ir a la LÍNEA señalada y leer el TIPO y el MENSAJE con calma: qué esperaba Python y qué recibió","Ejecutar de nuevo a ver si desaparece","Buscar otro lenguaje"],"correctIndex":1,"feedback":{"correct":"Correcto. El traceback es el mapa: línea + tipo + mensaje resuelven la mayoría de los casos en minutos.","incorrect":"Primero se LEE: la línea dice dónde, el tipo y el mensaje dicen qué. Re-ejecutar sin leer es adivinar."}}$j$),
  (5, 'resumen', $j${"title":"Resumen — Leer la escena","points":["Todos los programadores producen bugs: la habilidad es encontrarlos rápido.","Familia 1 — revientan: el traceback regala tipo, mensaje y línea. Léelo con calma.","Familia 2 — silenciosos: el programa corre y el resultado está mal. Los peores.","Flujo ante un traceback: línea señalada → qué esperaba vs qué recibió → arreglo.","Para los silenciosos: las herramientas de las próximas lecciones."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm08-l01-leer-la-escena';

-- ═════════════════════════════════════════════════════════════════════
-- L02 · print: la linterna del detective
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Iluminar el interior","body":"Contra un bug silencioso, la herramienta más vieja y efectiva del mundo: el PRINT TÁCTICO. La idea: tu programa tiene un estado interior (el valor de cada variable en cada momento) que normalmente no ves — un print bien puesto lo ilumina. La técnica tiene tres reglas. Uno: imprime CON ETIQUETA — print(f\"DEBUG: total={total}\") — para saber qué estás viendo cuando haya varios. Dos: colócalo en los puntos clave — dentro del bucle, antes y después de la línea sospechosa — y compara lo que ESPERABAS ver con lo que aparece: el bug vive exactamente donde la realidad se separa de tu expectativa. Tres: cuando caces al culpable, RETIRA los prints — son andamios, no parte del edificio."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Cazando al ladrón del acumulador","code":"temperaturas = [38.2, 39.1, 36.5]\n\nfor temp in temperaturas:\n    fiebres = 0            # ← el sospechoso de siempre\n    if temp >= 38:\n        fiebres = fiebres + 1\n    print(f\"DEBUG: temp={temp} fiebres={fiebres}\")\n\nprint(f\"Fiebres del turno: {fiebres}\")","result":{"columns":["CONSOLA"],"rows":[["DEBUG: temp=38.2 fiebres=1"],["DEBUG: temp=39.1 fiebres=1"],["DEBUG: temp=36.5 fiebres=0"],["Fiebres del turno: 0"]],"note":"La linterna delata: fiebres vuelve a nacer en CADA vuelta (mira cómo nunca pasa de 1 y termina en 0). El fiebres = 0 está DENTRO del bucle — el error clásico del módulo 3."},"caption":"Esperabas 1, 2, 2… y viste 1, 1, 0: ahí, donde la realidad se separó de la expectativa, vive el bug. Arreglo: fiebres = 0 va ANTES del for."}$j$),
  (3, 'texto', $j${"title":"Mini-reto: el triage mentiroso","body":"Tu turno de detective. Este triage corre sin errores… y clasifica mal: con temperatura = 39.5 responde Fiebre en vez de URGENTE. El código: if temperatura >= 38: categoria = \"Fiebre\" / elif temperatura >= 39: categoria = \"URGENTE\" / else: categoria = \"Normal\". No hay traceback — es un silencioso. Traza mentalmente (o con un print) el camino de 39.5 por la escalera y encuentra el bug ANTES de mirar la solución."}$j$),
  (4, 'ejemplo_codigo', $j${"title":"Solución propuesta — inténtala antes de mirar","code":"temperatura = 39.5\n\n# El bug: la condición AMPLIA (>= 38) estaba ARRIBA.\n# 39.5 también cumple >= 38, entra ahí… y URGENTE queda inalcanzable.\n\n# La escalera corregida: lo más exigente primero.\nif temperatura >= 39:\n    categoria = \"URGENTE\"\nelif temperatura >= 38:\n    categoria = \"Fiebre\"\nelse:\n    categoria = \"Normal\"\n\nprint(f\"{temperatura} °C → {categoria}\")","result":{"columns":["CONSOLA"],"rows":[["39.5 °C → URGENTE"]],"note":"El bug del orden (módulo 2) disfrazado de silencioso: corre perfecto y miente. Un print de categoria tras la escalera lo habría delatado en una ejecución."},"caption":"Los bugs silenciosos suelen ser LÓGICOS: el código hace exactamente lo que escribiste — que no era lo que querías."}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Por qué el print táctico lleva etiqueta — print(f\"DEBUG: total={total}\") — y no solo print(total)?","options":["Por elegancia","Para saber QUÉ variable y QUÉ punto del programa estás viendo cuando hay varios prints iluminando a la vez","Porque print(total) da error","Para que corra más rápido"],"correctIndex":1,"feedback":{"correct":"Correcto. Tres números sueltos no dicen nada; tres líneas etiquetadas cuentan la historia completa.","incorrect":"La etiqueta identifica la pista: con varios prints activos, un número suelto no dice ni qué es ni de dónde salió."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — La linterna","points":["El print táctico ilumina el estado interior: variables en los puntos clave.","Siempre con etiqueta: print(f\"DEBUG: total={total}\").","El bug vive donde la realidad se separa de tu expectativa: compara lo esperado con lo impreso.","Los bugs silenciosos suelen ser lógicos: el código hace lo que escribiste, no lo que querías.","Al terminar la caza, retira los prints: son andamios, no edificio."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm08-l02-print-linterna';

-- ═════════════════════════════════════════════════════════════════════
-- L03 · assert: afirmaciones que vigilan
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Expectativas que se vigilan solas","body":"El print te obliga a MIRAR y comparar tú. assert automatiza la comparación: assert condición, \"mensaje\" — si la condición es verdadera, SILENCIO absoluto y el programa sigue; si es falsa, AssertionError con tu mensaje. Es una expectativa ejecutable: assert es_fiebre(38.2) == True dice 'esto DEBE ser cierto — y si algún día deja de serlo, quiero enterarme a gritos'. Aquí se paga la promesa del módulo 5: las funciones que ENTREGAN con return son COMPROBABLES — puedes preguntarle a su resultado. A una función que solo imprime no se le puede preguntar nada. El mensaje tras la coma es opcional pero profesional: cuando la afirmación falle (a las 3 de la mañana, seis meses después), ese mensaje será tu carta al futuro."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Afirmaciones sobre tu librería","code":"def es_fiebre(temperatura):\n    return temperatura >= 38\n\n# expectativas ejecutables: si son ciertas, silencio\nassert es_fiebre(39.0) == True,  \"39.0 debe ser fiebre\"\nassert es_fiebre(36.5) == False, \"36.5 no debe ser fiebre\"\nassert es_fiebre(38.0) == True,  \"38.0 es la frontera: SÍ es fiebre\"\n\nprint(\"Todas las afirmaciones pasaron\")","result":{"columns":["CONSOLA"],"rows":[["Todas las afirmaciones pasaron"]],"note":"Tres assert verdaderos = tres silencios. Si alguno fallara, verías AssertionError con su mensaje y el print final nunca correría."},"caption":"El assert vigila; tú descansas. Y fíjate en el tercero: la FRONTERA (38.0) tiene su propia afirmación — no es casualidad."}$j$),
  (3, 'texto', $j${"title":"Dónde viven los bugs: los casos frontera","body":"¿Qué casos afirmar? Los profesionales prueban tres territorios. El CASO TÍPICO (39.0 es fiebre, 36.5 no): confirma que lo normal funciona. Los CASOS FRONTERA: el valor EXACTO donde la regla cambia — ¿38.0 es fiebre o no? Ahí es donde un > que debió ser >= pasa desapercibido durante meses. Y los CASOS EXTREMOS: la lista vacía, el cero, el texto vacío — ¿promedio_seguro(0, 0) devuelve 0 como prometimos? La regla de oro: si al escribir una condición dudaste un segundo entre > y >=, esa frontera MERECE su assert. Los bugs no viven en el centro de los casos: viven en los bordes."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿qué hace assert cuando su condición es VERDADERA?","options":["Imprime OK","NADA: silencio absoluto y el programa continúa — assert solo habla cuando algo está mal","Detiene el programa","Devuelve True"],"correctIndex":1,"feedback":{"correct":"Correcto. El silencio es la buena noticia; el AssertionError, la alarma.","incorrect":"assert verdadero = silencio total. Solo la condición FALSA produce AssertionError con tu mensaje."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"La regla dice que es fiebre desde 38.0 (inclusive). ¿Cuál es EL assert de caso frontera para es_fiebre?","options":["assert es_fiebre(39.5) == True","assert es_fiebre(38.0) == True: el valor EXACTO donde la regla cambia — ahí se esconde el clásico > que debió ser >=","assert es_fiebre(20.0) == False","assert es_fiebre(\"38\") == True"],"correctIndex":1,"feedback":{"correct":"Correcto. La frontera es el borde de la regla: si alguien escribió > en vez de >=, SOLO 38.0 lo delata.","incorrect":"El caso frontera es el valor exacto del límite (38.0): los valores lejanos (39.5, 20.0) pasan igual con > que con >=."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — assert","points":["assert condición, \"mensaje\": verdadera = silencio; falsa = AssertionError con tu mensaje.","Es una expectativa ejecutable: 'esto DEBE ser cierto, avísame a gritos si deja de serlo'.","Las funciones con return son comprobables (la promesa del módulo 5, pagada); a un print no se le pregunta nada.","Prueba tres territorios: caso típico, casos FRONTERA (el valor exacto del límite) y casos extremos (vacío, cero).","Si dudaste entre > y >=, esa frontera merece su assert: los bugs viven en los bordes."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm08-l03-assert';

-- ═════════════════════════════════════════════════════════════════════
-- L04 · Tu banco de pruebas
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"De asserts sueltos a banco de pruebas","body":"Los asserts sueltos se vuelven inmanejables; el paso profesional es agruparlos en FUNCIONES DE PRUEBA: def probar_es_fiebre(): con todos los asserts de esa función dentro, y un print final de confirmación. Llamas a todas tus probar_* juntas y tienes un BANCO DE PRUEBAS: un botón que verifica tu librería completa. ¿Cuándo pulsarlo? DESPUÉS DE CADA CAMBIO. Porque el peligro real tiene nombre: REGRESIÓN — el cambio de hoy que rompe lo que ayer funcionaba. Tocaste promedio para mejorar algo… ¿sigue viva es_fiebre? El banco responde en un segundo. Dato de la industria: existen herramientas que hacen esto a lo grande (pytest es la más famosa — la practicarás en el curso Intermedio); el músculo que entrenas hoy es exactamente el mismo."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"El banco de la librería clínica","code":"def es_fiebre(temperatura):\n    return temperatura >= 38\n\ndef promedio_seguro(suma, cantidad):\n    try:\n        return suma / cantidad\n    except ZeroDivisionError:\n        return 0\n\ndef probar_es_fiebre():\n    assert es_fiebre(39.0) == True\n    assert es_fiebre(38.0) == True,  \"frontera: 38.0 ES fiebre\"\n    assert es_fiebre(37.9) == False, \"frontera: 37.9 NO es fiebre\"\n    print(\"probar_es_fiebre: OK\")\n\ndef probar_promedio_seguro():\n    assert promedio_seguro(113.8, 3) > 37.9\n    assert promedio_seguro(0, 0) == 0, \"turno vacío: promedio 0\"\n    print(\"probar_promedio_seguro: OK\")\n\nprobar_es_fiebre()\nprobar_promedio_seguro()","result":{"columns":["CONSOLA"],"rows":[["probar_es_fiebre: OK"],["probar_promedio_seguro: OK"]],"note":"Dos funciones de prueba, cinco afirmaciones, un botón. Cambia cualquier función de la librería y vuelve a pulsar: si algo se rompió, te enteras aquí — no en producción."},"caption":"Fíjate: ambas fronteras de es_fiebre (38.0 y 37.9) y el caso extremo del turno vacío. El banco vigila los bordes."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿qué es una REGRESIÓN?","options":["Un bucle que va hacia atrás","Un cambio nuevo que ROMPE algo que ya funcionaba — la razón de re-correr el banco de pruebas tras CADA cambio","Un error de dedo","Volver a una versión anterior de Python"],"correctIndex":1,"feedback":{"correct":"Correcto. El enemigo silencioso del progreso: mejoras A y sin querer rompes B. El banco lo caza en un segundo.","incorrect":"Regresión = lo que ayer funcionaba, hoy roto por tu cambio de esta mañana. Por eso las pruebas se corren después de CADA cambio."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué gana el banco de pruebas (funciones probar_*) frente a los asserts sueltos?","options":["Los asserts corren más rápido","Organización y repetibilidad: cada función agrupa las afirmaciones de una pieza, y todas juntas verifican la librería completa con una llamada","Los asserts sueltos no funcionan","Nada, es lo mismo"],"correctIndex":1,"feedback":{"correct":"Correcto. Un botón, toda la librería verificada — y con nombre claro de qué se está probando.","incorrect":"El banco agrupa (una probar_* por pieza) y se re-ejecuta completo con una llamada: repetible tras cada cambio."}}$j$),
  (5, 'resumen', $j${"title":"Resumen — El banco de pruebas","points":["Agrupa asserts en funciones probar_* con su print de confirmación: nace el banco de pruebas.","Re-córrelo DESPUÉS DE CADA CAMBIO: su presa es la regresión (lo de ayer roto por lo de hoy).","Prueba fronteras y extremos en el banco: es donde viven los bugs.","La industria hace esto a lo grande con pytest (curso Intermedio); el músculo es el mismo.","Banco verde = cambias con confianza. Esa confianza es el verdadero producto de las pruebas."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm08-l04-banco-de-pruebas';

-- ═════════════════════════════════════════════════════════════════════
-- L05 · Práctica: caza el bug frontera (motor real)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'ejercicio', $j${"scenario":"La librería de la clínica tiene un bug REAL escondido: es_fiebre falla exactamente en la frontera. Tu misión de detective tiene dos actos: primero escribe la prueba que lo DELATA (verás su AssertionError con tus propios ojos), y después corrige la función hasta que el banco entero quede en verde.","instructions":["Agrega al banco la prueba del caso frontera: assert es_fiebre(38.0) == True (con su mensaje, si quieres el estilo profesional).","EJECUTA: tu nueva prueba debe FALLAR con AssertionError — eso significa que funcionó: encontró el bug.","Ahora corrige es_fiebre: la regla clínica es fiebre DESDE 38.0 inclusive.","EJECUTA de nuevo: banco en verde. COMPRUEBA para cerrar el caso."],"initialCode":"def es_fiebre(temperatura):\n    return temperatura > 38   # ← aquí vive un bug de frontera\n\n# ── banco de pruebas ──\nassert es_fiebre(39.0) == True,  \"39.0 debe ser fiebre\"\nassert es_fiebre(36.5) == False, \"36.5 no debe ser fiebre\"\n# TODO: agrega la prueba de la frontera: 38.0 DEBE ser fiebre\n\nprint(\"Banco de pruebas: todo OK\")","validators":["assert\\s+es_fiebre\\s*\\(\\s*38\\.0\\s*\\)\\s*==\\s*true","return\\s+temperatura\\s*>=\\s*38"],"entradas":[],"salidaEsperada":["Banco de pruebas: todo OK"],"mockOutput":{"columns":["CONSOLA"],"rows":[["Banco de pruebas: todo OK"]],"note":"Banco en verde: la prueba de frontera existe Y la función la satisface. Caso cerrado."},"hints":["La prueba delatora: assert es_fiebre(38.0) == True, \"frontera: 38.0 ES fiebre\" — agrégala y ejecuta para verla fallar.","¿Viste el AssertionError? Perfecto: la prueba encontró el bug. Ahora mira la función: > 38 deja fuera al 38.0 exacto.","El arreglo: return temperatura >= 38 — la frontera incluida, como dice la regla clínica."],"successMessage":"Caso cerrado como se cierra en la industria: la prueba delató el bug, el arreglo la satisfizo, y esa prueba queda de guardia para siempre — si alguien reintroduce el >, tu assert gritará.","failMessage":"Revisa los dos actos: el assert de la frontera (es_fiebre(38.0) == True) presente en el banco, y la función corregida con >= 38."}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm08-l05-practica-cazador';

-- ═════════════════════════════════════════════════════════════════════
-- X01 · Examen de región (jefe del módulo)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"La octava región","body":"Byte llegó a la región de las pruebas: diez preguntas guardan el paso. Todo lo viviste: las dos familias de bugs, la linterna del print táctico, las afirmaciones del assert, los casos frontera y tu primer banco de pruebas. Las preguntas que falles volverán al final hasta que las domines. Adelante."}$j$),
  (2, 'quiz', $j${"variant":"multiple_choice","prompt":"Un programa corre de principio a fin sin errores… pero el total que imprime está mal. Este bug es:","options":["De los que revientan","SILENCIOSO: la peor familia — nadie avisa, y se caza con print táctico y pruebas","Un problema del equipo","Imposible"],"correctIndex":1,"feedback":{"correct":"Correcto. Sin traceback no hay aviso: contra los silenciosos, linterna y banco de pruebas.","incorrect":"Corre pero miente = bug silencioso. El traceback no existe; lo cazan el print táctico y los assert."}}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"El traceback señala: line 8, TypeError: unsupported operand type(s) for +: 'int' and 'str'. Tu diagnóstico:","options":["El archivo está dañado","En la línea 8 se suma un número con un TEXTO — probablemente faltó int() sobre un dato que llegó como str","Hay que reiniciar","La línea 8 no existe"],"correctIndex":1,"feedback":{"correct":"Correcto. Tipo + mensaje + línea = diagnóstico en segundos: convertir el str antes de sumar.","incorrect":"El mensaje lo dice: int + str en la línea 8. Un dato llegó como texto (¿CSV? ¿input?) y faltó su conversión."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"El print táctico profesional es print(f\"DEBUG: fiebres={fiebres}\") y no print(fiebres) porque:","options":["Es más bonito","La ETIQUETA identifica qué variable y qué punto del programa estás viendo — números sueltos no cuentan historias","print(fiebres) falla","El f-string es obligatorio"],"correctIndex":1,"feedback":{"correct":"Correcto. Con varios prints activos, la etiqueta es la diferencia entre pistas y ruido.","incorrect":"La etiqueta da contexto: qué es, de dónde salió. Tres números sueltos no dicen nada; tres líneas etiquetadas, todo."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"Terminada la caza del bug, los prints de DEBUG…","options":["Se quedan para siempre, por si acaso","Se RETIRAN: son andamios de la investigación, no parte del programa","Se convierten en comentarios todos","Se cambian a mayúsculas"],"correctIndex":1,"feedback":{"correct":"Correcto. Andamios: suben para construir, bajan al terminar. Un programa lleno de DEBUG es ruido para el siguiente lector.","incorrect":"Los prints tácticos se retiran al cerrar el caso: eran herramienta de investigación, no salida del programa."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"assert total == 2150, \"el total del turno no cuadra\" — si total efectivamente vale 2150:","options":["Imprime el mensaje","SILENCIO: el programa sigue como si el assert no existiera — solo habla cuando la condición es falsa","Detiene el programa","Devuelve 2150"],"correctIndex":1,"feedback":{"correct":"Correcto. Verdadero = silencio; falso = AssertionError con tu mensaje.","incorrect":"El assert verdadero no hace NADA visible: esa es su gracia. Solo la condición falsa dispara la alarma."}}$j$),
  (7, 'quiz', $j${"variant":"multiple_choice","prompt":"La regla: descuento para pacientes DESDE 65 años (inclusive). ¿Cuál es el assert de caso frontera?","options":["assert tiene_descuento(90) == True","assert tiene_descuento(65) == True: el valor exacto del límite — donde un > mal puesto se esconde de todos los demás casos","assert tiene_descuento(30) == False","assert tiene_descuento(64.9) == True"],"correctIndex":1,"feedback":{"correct":"Correcto. Solo el 65 exacto distingue > de >=: los valores lejanos pasan igual con ambos.","incorrect":"La frontera es 65: si el código dijera edad > 65 (bug), 90 y 30 pasarían las pruebas igual — solo el 65 exacto lo delata."}}$j$),
  (8, 'quiz', $j${"variant":"multiple_choice","prompt":"Mejoraste hoy la función promedio… y sin querer rompiste es_fiebre, que funcionaba desde hace semanas. Ese fenómeno se llama:","options":["Mala suerte","REGRESIÓN — y la razón por la que el banco de pruebas se corre después de CADA cambio","Actualización","Excepción"],"correctIndex":1,"feedback":{"correct":"Correcto. El cambio de hoy rompió lo de ayer: regresión. El banco la caza en un segundo.","incorrect":"Regresión: lo que funcionaba, roto por un cambio nuevo. Su antídoto es re-correr el banco tras cada cambio."}}$j$),
  (9, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Por qué una función que ENTREGA con return es comprobable y una que solo imprime no?","options":["Porque print es más lento","Porque el valor entregado se puede COMPARAR en un assert (assert f(x) == esperado); lo impreso solo se puede mirar con los ojos","Porque return usa menos memoria","Ambas son igual de comprobables"],"correctIndex":1,"feedback":{"correct":"Correcto. La promesa del módulo 5, cumplida: return produce valores interrogables; print produce píxeles.","incorrect":"assert necesita un VALOR que comparar — y eso solo lo da return. A la salida en pantalla no se le puede preguntar nada."}}$j$),
  (10, 'quiz', $j${"variant":"multiple_choice","prompt":"Tu banco tiene probar_es_fiebre() y probar_promedio_seguro(). ¿Qué territorios deben cubrir sus asserts?","options":["Solo los casos típicos, que son los comunes","Caso típico + casos FRONTERA (el valor exacto del límite) + casos extremos (vacío, cero): los bugs viven en los bordes","Solo números grandes","Un assert por función basta"],"correctIndex":1,"feedback":{"correct":"Correcto. El centro casi nunca falla; las fronteras y los extremos son el hábitat natural del bug.","incorrect":"Típico, frontera y extremo: tres territorios. El que más bugs esconde es la frontera — el valor exacto donde la regla cambia."}}$j$),
  (11, 'quiz', $j${"variant":"multiple_choice","prompt":"Pregunta final de entrevista: 'encontraste un bug en producción — ¿qué haces ANTES de corregirlo?' Tu respuesta senior:","options":["Corregirlo rápido y en silencio","Escribir la PRUEBA que lo reproduce y verla fallar: confirma el diagnóstico, y tras el arreglo queda de guardia para siempre contra su regreso","Reiniciar el servidor","Culpar al CSV"],"correctIndex":1,"feedback":{"correct":"Impecable. Prueba que falla → arreglo → prueba en verde: el bug queda documentado, verificado y vigilado. Así trabajaste en la práctica de este módulo.","incorrect":"La respuesta senior: primero la prueba que reproduce el bug (y falla), después el arreglo (y la prueba pasa). El bug corregido sin prueba puede volver mañana sin que nadie lo note."}}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm08-x01-examen';
