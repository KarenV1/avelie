-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 040 — Python desde Cero · Módulo 9: Proyecto integrador
-- ═══════════════════════════════════════════════════════════════════
-- El cierre del curso: el encargo de la clínica sobre los 3 CSVs
-- reales (citas.csv e inventario_farmacia.csv entran con el campo
-- `archivos` del motor), DOS prácticas ejecutables, el puente a IA/ML
-- y la nota ética de cierre.
-- Cifras verificadas contra los datasets:
--   citas.csv: 50 citas · 40 atendidas / 7 canceladas / 3 no_asistio
--   · ingresos de atendidas = 30050 · cita 519 atendida SIN costo
--   inventario_farmacia.csv: 30 productos · 7 bajo mínimo · el más
--   crítico: Guantes de nitrilo M (faltan 102)
-- Reglas de contenido: sin tecnología interna; quizzes autocontenidos
-- o con términos técnicos.
-- El curso sigue is_published = false: el flip es la 041.
-- Idempotente: borra y recrea las lecciones de ESTE módulo.
-- Ejecutar DESPUÉS de 031 (estructura v2).
-- ═══════════════════════════════════════════════════════════════════

-- Limpia el módulo (cascade borra sus content_blocks)
delete from public.lessons
where module_id = (
  select m.id
  from public.modules m
  join public.courses c on c.id = m.course_id
  where c.slug = 'python-desde-cero' and m.slug = 'm09-proyecto-integrador'
);

-- ── Lecciones del módulo ──────────────────────────────────────────────
insert into public.lessons (module_id, slug, title, kind, xp, sort_order)
select m.id, v.slug, v.title, v.kind, v.xp, v.ord
from public.modules m
join public.courses c on c.id = m.course_id,
     (values
       ('m09-l01-el-encargo',        'El encargo de la dirección',        'leccion',  20, 1),
       ('m09-l02-guiado-citas',      'Guiado: el pulso de las citas',     'leccion',  20, 2),
       ('m09-l03-practica-facturacion','Práctica: la facturación',        'practica', 20, 3),
       ('m09-l04-guiado-farmacia',   'Guiado: la alerta de farmacia',     'leccion',  20, 4),
       ('m09-l05-practica-reposicion','Práctica: la lista de reposición', 'practica', 20, 5),
       ('m09-l06-puente-ia',         'El puente: de las reglas al aprendizaje', 'leccion', 20, 6),
       ('m09-x01-examen',            'Examen final: el curso completo',   'examen',   40, 7)
     ) as v(slug, title, kind, xp, ord)
where c.slug = 'python-desde-cero' and m.slug = 'm09-proyecto-integrador';

-- ═════════════════════════════════════════════════════════════════════
-- L01 · El encargo de la dirección
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Tu primer encargo real","body":"La dirección de la clínica te contrató (sí, a ti) y trae tres preguntas de negocio: UNO — ¿cómo va la operación? Cuántas citas se atendieron, cuántas se perdieron y cuánto se facturó. DOS — ¿la farmacia está sana? Qué productos están por debajo de su stock mínimo y cuál urge más. TRES — que todo quede en un reporte reproducible: nada de contar a mano. Tus materiales: citas.csv (50 citas: cita_id, paciente_id, medico_id, especialidad, fecha, estado, costo) e inventario_farmacia.csv (30 productos: producto_id, nombre, categoria, stock, stock_minimo, precio_unitario, fecha_vencimiento) — ambos listos en tu laboratorio. Y una advertencia que ya no te asusta: vienen sucios, como la vida real. Este módulo ES tu curso completo trabajando junto: tablas (M4), funciones (M5), defensa (M6), archivos (M7) y pruebas (M8)."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Reconocimiento del terreno","code":"import csv\n\ntotal = 0\nwith open(\"citas.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        total = total + 1\n        if total <= 2:\n            print(f\"{fila['cita_id']} · {fila['especialidad']} · {fila['estado']} · {fila['costo']}\")\n\nprint(f\"Citas en el archivo: {total}\")","result":{"columns":["CONSOLA"],"rows":[["501 · Cardiología · atendida · 850"],["502 · Cardiología · atendida · 850"],["Citas en el archivo: 50"]],"note":"Primer vistazo profesional a un archivo nuevo: unas filas de muestra y el conteo total, antes de cualquier análisis."},"caption":"Regla del oficio: antes de analizar, reconocer. Dos filas de muestra dicen más que cualquier suposición sobre el formato."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"Antes de escribir el análisis, el ejemplo imprime unas filas de muestra y el total. ¿Por qué ese reconocimiento previo es práctica profesional?","options":["Para gastar tiempo","Porque confirma el formato REAL de los datos (columnas, valores, sorpresas) antes de construir sobre suposiciones","Porque los archivos exigen imprimirse","Es solo decorativo"],"correctIndex":1,"feedback":{"correct":"Correcto. Analizar sin reconocer es construir sobre suposiciones — y los datos reales adoran contradecirlas.","incorrect":"El vistazo previo confirma qué hay de verdad en el archivo: columnas, formatos y suciedades, antes de que rompan tu análisis."}}$j$),
  (4, 'resumen', $j${"title":"Resumen — El encargo","points":["Tres preguntas de negocio: operación de citas, salud de la farmacia y un reporte reproducible.","Materiales: citas.csv (50) e inventario_farmacia.csv (30), ya en tu laboratorio — y sucios a propósito.","Primer paso profesional: reconocimiento — filas de muestra + conteo antes de analizar.","Este módulo convoca TODO el curso: tablas, funciones, defensa, archivos y pruebas."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-l01-el-encargo';

-- ═════════════════════════════════════════════════════════════════════
-- L02 · Guiado: el pulso de las citas
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Primera pregunta: ¿cómo va la operación?","body":"La columna estado trae tres valores: atendida, cancelada y no_asistio — y contar cada uno es el patrón acumulador por triplicado: tres contadores, tres if (o if/elif, que ya sabes por qué). Con eso la dirección ve de un vistazo cuántas citas se pierden. Fíjate en la estrategia general del proyecto: cada pregunta de negocio se responde con el MISMO esqueleto — abrir el archivo, recorrer la tabla fila a fila, filtrar con condiciones, acumular respuestas, reportar al final. Ese esqueleto es tuyo desde el módulo 4; el proyecto solo lo viste de traje."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"El tablero de estados","code":"import csv\n\natendidas = 0\ncanceladas = 0\nno_asistio = 0\n\nwith open(\"citas.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        if fila[\"estado\"] == \"atendida\":\n            atendidas = atendidas + 1\n        elif fila[\"estado\"] == \"cancelada\":\n            canceladas = canceladas + 1\n        else:\n            no_asistio = no_asistio + 1\n\nprint(f\"Atendidas: {atendidas}\")\nprint(f\"Canceladas: {canceladas}\")\nprint(f\"No asistió: {no_asistio}\")","result":{"columns":["CONSOLA"],"rows":[["Atendidas: 40"],["Canceladas: 7"],["No asistió: 3"]],"note":"De 50 citas, 10 no se atendieron: un 20% de capacidad perdida. Eso ya es información de negocio, no solo un conteo."},"caption":"Tres acumuladores y una escalera: la primera respuesta del encargo, en quince líneas. La facturación — tu práctica — usa el mismo esqueleto con una complicación extra."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"El esqueleto que responde CADA pregunta del proyecto es:","options":["Copiar los datos a mano","Abrir el archivo → recorrer fila a fila → filtrar con condiciones → acumular → reportar al final","Ordenar alfabéticamente y mirar","Convertir todo a mayúsculas"],"correctIndex":1,"feedback":{"correct":"Correcto. El mismo esqueleto del módulo 4, vestido de proyecto: abrir, recorrer, filtrar, acumular, reportar.","incorrect":"Todas las preguntas se responden igual: abrir → recorrer → filtrar → acumular → reportar. Cambian las condiciones, no el esqueleto."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"La cita 519 viene atendida pero con el costo VACÍO. Al sumar ingresos con int(fila[\"costo\"]), esa fila…","options":["Suma cero automáticamente","Lanza ValueError al convertir \"\" — tu try/except del módulo 6 la cuenta aparte sin caerse","Detiene el DictReader","Se salta sola"],"correctIndex":1,"feedback":{"correct":"Correcto. int(\"\") revienta: el paracaídas la atrapa, la cuentas como 'sin costo' y el análisis sigue.","incorrect":"int(\"\") lanza ValueError. La defensa del módulo 6 (try/except) convierte esa suciedad en un contador de 'sin costo registrado'."}}$j$),
  (5, 'resumen', $j${"title":"Resumen — El pulso de las citas","points":["Contar por categoría = el patrón acumulador por triplicado (tres contadores, una escalera).","De 50 citas: 40 atendidas, 7 canceladas, 3 no asistió — el 20% de capacidad se pierde.","Un conteo con contexto ES información de negocio.","La cita 519 (atendida, costo vacío) espera tu try/except en la práctica.","Mismo esqueleto para todo: abrir → recorrer → filtrar → acumular → reportar."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-l02-guiado-citas';

-- ═════════════════════════════════════════════════════════════════════
-- L03 · Práctica: la facturación (citas.csv real)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'ejercicio', $j${"scenario":"La dirección quiere la cifra grande: cuántas citas se ATENDIERON y cuánto se facturó por ellas. Aviso de la vida real: hay una cita atendida cuyo costo no quedó registrado — tu programa debe contarla aparte en vez de caerse.","instructions":["Solo interesan las filas con estado == \"atendida\".","De cada atendida: suma 1 a atendidas, e intenta sumar int(fila[\"costo\"]) a ingresos con try.","Si la conversión lanza ValueError (costo vacío), suma 1 a sin_costo — la defensa del módulo 6.","El pass es relleno: bórralo. No toques los print finales."],"initialCode":"import csv\n\natendidas = 0\ningresos = 0\nsin_costo = 0\n\nwith open(\"citas.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        # TODO: si el estado es \"atendida\": cuenta la cita,\n        #       y suma su costo con try/except ValueError\n        #       (el costo vacío se cuenta en sin_costo)\n        pass\n\nprint(f\"Citas atendidas: {atendidas}\")\nprint(f\"Ingresos: {ingresos}\")\nprint(f\"Sin costo registrado: {sin_costo}\")","validators":["fila\\[\\s*[\"']estado[\"']\\s*\\]\\s*==\\s*[\"']atendida[\"']","int\\s*\\(\\s*fila\\[\\s*[\"']costo[\"']\\s*\\]\\s*\\)","try\\s*:","except\\s+ValueError\\s*:","atendidas\\s*(=\\s*atendidas\\s*\\+\\s*1|\\+=\\s*1)","sin_costo\\s*(=\\s*sin_costo\\s*\\+\\s*1|\\+=\\s*1)"],"entradas":[],"archivos":["citas.csv"],"salidaEsperada":["Citas atendidas: 40","Ingresos: 30050","Sin costo registrado: 1"],"mockOutput":{"columns":["CONSOLA"],"rows":[["Citas atendidas: 40"],["Ingresos: 30050"],["Sin costo registrado: 1"]],"note":"40 atendidas, 30050 facturados y la cita 519 detectada con su costo vacío: el análisis sobrevivió a la suciedad."},"hints":["Primero el filtro: if fila[\"estado\"] == \"atendida\": — y dentro, el conteo y la suma.","La suma con paracaídas: try: ingresos = ingresos + int(fila[\"costo\"]) / except ValueError: sin_costo = sin_costo + 1.","¿atendidas cuenta TODAS las atendidas (también la del costo vacío)? Debe: el conteo va fuera del try."],"successMessage":"Facturación entregada: 30050 en 40 citas, con el dato sucio contado y reportado en vez de escondido. Así se responde una pregunta de negocio con datos reales.","failMessage":"Revisa: filtro por estado \"atendida\", conteo de atendidas FUERA del try, suma con int(fila[\"costo\"]) dentro del try, y ValueError sumando a sin_costo."}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-l03-practica-facturacion';

-- ═════════════════════════════════════════════════════════════════════
-- L04 · Guiado: la alerta de farmacia
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Segunda pregunta: ¿la farmacia está sana?","body":"inventario_farmacia.csv trae dos columnas que juntas responden todo: stock (lo que hay) y stock_minimo (lo que DEBE haber). Un producto con stock por debajo de su mínimo es una alerta de reposición — y en una clínica, quedarse sin insulina no es un contratiempo: es un riesgo. La comparación es de primero de curso (stock < minimo), pero recuerda la letra pequeña del CSV: ambas columnas llegan como TEXTO — compara \"95\" < \"120\" como cadenas y obtendrás mentiras alfabéticas. int() primero, comparación después. Y para 'el producto MÁS crítico' hay un patrón nuevo de viejos amigos: rastrear el máximo — una variable que guarda el mayor FALTANTE (minimo - stock) visto hasta ahora, y un if que la destrona cuando aparece uno peor."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"El más crítico: rastrear el máximo","code":"import csv\n\nmayor_faltante = 0\nmas_critico = \"\"\n\nwith open(\"inventario_farmacia.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        stock = int(fila[\"stock\"])\n        minimo = int(fila[\"stock_minimo\"])\n        faltante = minimo - stock\n        if faltante > mayor_faltante:\n            mayor_faltante = faltante\n            mas_critico = fila[\"nombre\"]\n\nprint(f\"Más crítico: {mas_critico} (faltan {mayor_faltante})\")","result":{"columns":["CONSOLA"],"rows":[["Más crítico: Guantes de nitrilo M (faltan 102)"]],"note":"El faltante solo es positivo cuando el stock está bajo el mínimo — el if de rastreo hace ambos trabajos a la vez."},"caption":"El patrón 'rastrear el máximo': una variable para el récord y un if que la destrona. Primo del acumulador, y tan usado como él."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"stock y stock_minimo llegan del CSV como \"95\" y \"120\". Si los comparas SIN convertir, ¿qué riesgo corres?","options":["Ninguno, Python los entiende","Comparación alfabética de cadenas: \"95\" > \"120\" porque el carácter 9 va después del 1 — mentiras silenciosas","Un traceback inmediato","El archivo se corrompe"],"correctIndex":1,"feedback":{"correct":"Correcto. Y es un bug SILENCIOSO: corre sin error y miente. int() primero, comparación después.","incorrect":"Las cadenas se comparan carácter a carácter: \"95\" queda DESPUÉS de \"120\" alfabéticamente. Sin int(), el análisis miente sin avisar."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"En el patrón 'rastrear el máximo', ¿qué papel juega el if faltante > mayor_faltante:?","options":["Cuenta los productos","Destrona al récord: si el faltante actual supera al mayor visto, este pasa a ser el nuevo máximo (y se guarda su nombre)","Ordena el archivo","Detiene el bucle"],"correctIndex":1,"feedback":{"correct":"Correcto. Una variable para el récord vigente y un if que la actualiza: así se encuentra el peor caso en una sola pasada.","incorrect":"Es el mecanismo del récord: cada fila desafía al máximo vigente, y el if corona al nuevo cuando lo supera."}}$j$),
  (5, 'resumen', $j${"title":"Resumen — La alerta de farmacia","points":["stock < stock_minimo = alerta de reposición; en una clínica, es gestión de riesgo.","Las columnas numéricas del CSV llegan como texto: int() ANTES de comparar (o mentiras alfabéticas).","Patrón nuevo: rastrear el máximo — variable récord + if que la destrona.","El faltante (minimo - stock) mide la urgencia: el más crítico es Guantes de nitrilo M.","Tu práctica: la lista completa de reposición, producto por producto."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-l04-guiado-farmacia';

-- ═════════════════════════════════════════════════════════════════════
-- L05 · Práctica: la lista de reposición (inventario_farmacia.csv real)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'ejercicio', $j${"scenario":"La jefa de farmacia necesita la lista de reposición de hoy: cada producto cuyo stock esté por debajo de su mínimo, con sus números a la vista, y el total de alertas al final. El archivo inventario_farmacia.csv (30 productos) está en tu laboratorio.","instructions":["Convierte stock y stock_minimo con int() ANTES de comparar (del CSV todo sale como texto).","Si stock < minimo: imprime la línea de alerta EXACTA del esqueleto (ya está escrita en el comentario) y suma 1 a bajo_minimo.","El pass es relleno: bórralo. No toques el print final."],"initialCode":"import csv\n\nbajo_minimo = 0\n\nwith open(\"inventario_farmacia.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        # TODO: stock = int(...), minimo = int(...)\n        #       si stock < minimo:\n        #         print(f\"REPONER: {fila['nombre']} — stock {stock}, mínimo {minimo}\")\n        #         y suma 1 a bajo_minimo\n        pass\n\nprint(f\"Productos bajo mínimo: {bajo_minimo}\")","validators":["int\\s*\\(\\s*fila\\[\\s*[\"']stock[\"']\\s*\\]\\s*\\)","int\\s*\\(\\s*fila\\[\\s*[\"']stock_minimo[\"']\\s*\\]\\s*\\)","stock\\s*<\\s*minimo","bajo_minimo\\s*(=\\s*bajo_minimo\\s*\\+\\s*1|\\+=\\s*1)"],"entradas":[],"archivos":["inventario_farmacia.csv"],"salidaEsperada":["REPONER: Amoxicilina 500 mg — stock 95, mínimo 120","REPONER: Azitromicina 500 mg — stock 70, mínimo 80","REPONER: Ranitidina 150 mg — stock 30, mínimo 60","REPONER: Insulina glargina — stock 25, mínimo 30","REPONER: Tramadol 50 mg — stock 60, mínimo 70","REPONER: Alcohol etílico 70% — stock 90, mínimo 120","REPONER: Guantes de nitrilo M — stock 48, mínimo 150","Productos bajo mínimo: 7"],"mockOutput":{"columns":["CONSOLA"],"rows":[["REPONER: Amoxicilina 500 mg — stock 95, mínimo 120"],["REPONER: Azitromicina 500 mg — stock 70, mínimo 80"],["REPONER: Ranitidina 150 mg — stock 30, mínimo 60"],["REPONER: Insulina glargina — stock 25, mínimo 30"],["REPONER: Tramadol 50 mg — stock 60, mínimo 70"],["REPONER: Alcohol etílico 70% — stock 90, mínimo 120"],["REPONER: Guantes de nitrilo M — stock 48, mínimo 150"],["Productos bajo mínimo: 7"]],"note":"Siete alertas de treinta productos — incluida la insulina, que en una clínica no puede faltar."},"hints":["Las conversiones primero: stock = int(fila[\"stock\"]) y minimo = int(fila[\"stock_minimo\"]).","La línea de alerta está lista en el comentario: cópiala tal cual — f\"REPONER: {fila['nombre']} — stock {stock}, mínimo {minimo}\".","El contador dentro del if: solo cuentan los que están bajo mínimo."],"successMessage":"Lista de reposición entregada: siete alertas cazadas entre treinta productos, con números a la vista para decidir. La jefa de farmacia repone hoy — y tu programa lo repetirá gratis cada mañana.","failMessage":"Revisa: int() en ambas columnas antes de comparar, el if stock < minimo con la línea REPONER exacta del comentario, y bajo_minimo sumando dentro del if."}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-l05-practica-reposicion';

-- ═════════════════════════════════════════════════════════════════════
-- L06 · El puente: de las reglas al aprendizaje (+ nota ética de cierre)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Lo que ya eres capaz de hacer","body":"Mira tu proyecto con distancia: abriste archivos reales, los recorriste como tablas, filtraste con condiciones, acumulaste respuestas, te defendiste de datos sucios y probaste tus funciones. Eso — recorrer, filtrar, agrupar, resumir — es el 80% del trabajo diario con datos, y ya es tuyo. Ahora mira tus reglas: TÚ escribiste que fiebre es >= 38, que reponer es stock < minimo. Reglas pensadas por un humano y escritas a mano. La siguiente frontera es exactamente esa: ¿y si la máquina APRENDIERA las reglas directamente de los datos? ¿Si viendo mil citas descubriera sola qué pacientes tienden a no asistir? Eso es machine learning — y es el corazón del siguiente curso de tu ruta: Fundamentos de IA y Machine Learning. Llegas con lo que hace falta: el pensamiento de datos que este curso te construyó."}$j$),
  (2, 'nota_etica', $j${"title":"El cierre: poder y responsabilidad","body":"Terminas este curso sabiendo convertir datos en decisiones — y eso es PODER, del que obliga. Tres compromisos te acompañan desde hoy. Primero: los datos de salud son de las personas, no del analista — la regla de oro (jamás datos reales para practicar) te sigue a cualquier trabajo, ahora con leyes y auditorías detrás. Segundo: tus análisis tocan vidas — el conteo mal hecho que esconde una urgencia, el promedio que maquilla un problema; por eso probaste tu código, y por eso lo seguirás probando. Tercero: cuando llegues al aprendizaje automático, recordarás que una máquina que aprende de datos también aprende sus SESGOS — y que el criterio ético del humano que la supervisa (tú) no se delega. Bienvenida a la responsabilidad. La llevas bien."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos del puente a la IA: ¿cuál es la diferencia entre tu triage (if temperatura >= 38) y un modelo de machine learning?","options":["Ninguna, son lo mismo","En tu triage, la regla la escribió un humano; en machine learning, la máquina APRENDE las reglas a partir de los datos","El machine learning no usa datos","Tu triage es más moderno"],"correctIndex":1,"feedback":{"correct":"Correcto. Reglas escritas a mano vs reglas aprendidas de los datos: ese es el salto del siguiente curso.","incorrect":"La frontera es quién escribe la regla: tú la escribiste (>= 38); en ML, el modelo la descubre en los datos."}}$j$),
  (4, 'resumen', $j${"title":"Resumen — El curso completo, en nueve líneas","points":["M1: variables, tipos y tu primer programa — entrada → proceso → salida.","M2: decisiones — if/elif/else, operadores lógicos y el diagrama antes del código.","M3: bucles — for, range, cadenas, while y el patrón acumulador.","M4: estructuras — listas, diccionarios y LA analogía: lista de diccionarios = tabla.","M5: funciones — def, return (entregar, no mostrar) y componer piezas con nombre.","M6: robustez — try/except, reintentos y el doble filtro contra datos sucios.","M7: archivos — with, el módulo csv y los datos de la clínica en tus manos.","M8: pruebas — tracebacks, print táctico, assert y tu banco de pruebas.","M9: todo junto contra un encargo real — y el puente: de tus reglas al aprendizaje automático."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-l06-puente-ia';

-- ═════════════════════════════════════════════════════════════════════
-- X01 · Examen final: el curso completo
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"La región final","body":"Byte llegó a la última región: el guardián del curso completo. Diez preguntas que cruzan los nueve módulos — todo lo que construiste, del primer print al proyecto de la clínica. Las que falles volverán al final hasta que las domines. Es la última puerta. Adelante."}$j$),
  (2, 'quiz', $j${"variant":"multiple_choice","prompt":"La anatomía de todo programa, del primero que escribiste al proyecto final:","options":["Copiar → pegar → rezar","ENTRADA (datos que llegan) → PROCESO (cálculos y decisiones) → SALIDA (resultados)","Variables → errores → suerte","Internet → nube → magia"],"correctIndex":1,"feedback":{"correct":"Correcto. Del input() del módulo 1 al CSV del proyecto: siempre entrada → proceso → salida.","incorrect":"La estructura universal: entrada → proceso → salida. La ficha rápida del módulo 1 y el proyecto final la comparten."}}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En una escalera if/elif que clasifica temperaturas, la condición >= 39 va ANTES que >= 38 porque:","options":["El orden alfabético lo exige","Gana la PRIMERA condición verdadera: si la amplia va antes, la exigente se vuelve inalcanzable","Python las reordena solo","Los números grandes van primero por estilo"],"correctIndex":1,"feedback":{"correct":"Correcto. El orden ES el algoritmo: lo más exigente arriba, o la escalera miente.","incorrect":"La escalera evalúa de arriba a abajo y entra en la primera verdadera: >= 38 arriba 'robaría' los casos urgentes."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"Para sumar los costos de un archivo de citas necesitas el patrón acumulador. Su receta:","options":["total = 0 dentro del bucle","Inicializar ANTES del bucle (total = 0), actualizar DENTRO (total = total + costo), usar DESPUÉS","Sumar al final de memoria","print(total) en cada vuelta"],"correctIndex":1,"feedback":{"correct":"Correcto. Nace antes, crece dentro, se usa después — del módulo 3 al proyecto, sin cambios.","incorrect":"Antes → dentro → después. Inicializar dentro del bucle reinicia el total en cada vuelta: el bug clásico."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"csv.DictReader convierte cada línea del archivo en un diccionario. Esto conecta directamente con la analogía central del curso:","options":["Una cadena es una lista","Fila = diccionario, columna = clave, tabla = lista de diccionarios: el CSV ES la tabla del módulo 4","Los archivos son variables","El for es un while disfrazado"],"correctIndex":1,"feedback":{"correct":"Correcto. La analogía que aprendiste con datos inventados resultó ser el formato real de los datos del mundo.","incorrect":"La analogía del módulo 4 (fila=dict, columna=clave) es exactamente lo que DictReader te entrega de un archivo real."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Por qué el proyecto empaqueta su lógica en funciones con return en vez de un solo bloque de código?","options":["Para que el archivo pese menos","Reutilización (llamar sin copiar), composición (funciones que usan funciones) y COMPROBABILIDAD (assert puede vigilar valores entregados)","Porque los bloques largos dan error","Es solo una moda"],"correctIndex":1,"feedback":{"correct":"Correcto. Los módulos 5 y 8 en una sola respuesta: piezas con nombre, componibles y vigilables.","incorrect":"Funciones con return = piezas reutilizables, componibles y comprobables con assert. El bloque único no ofrece nada de eso."}}$j$),
  (7, 'quiz', $j${"variant":"multiple_choice","prompt":"El costo de una cita llega vacío (\"\") y la temperatura de otra llega como 380. El doble filtro correcto es:","options":["try para ambos","try/except ValueError para el vacío que REVIENTA al convertir; if de rango para el 380 que convierte bien pero MIENTE","if para ambos","Ignorar ambas filas sin contar nada"],"correctIndex":1,"feedback":{"correct":"Correcto. Cada suciedad con su cazador: el try atrapa explosiones, el if atrapa mentiras — y ambas se cuentan y reportan.","incorrect":"int(\"\") revienta → try/except. 380 convierte sin error → if de rango. El doble filtro del módulo 6."}}$j$),
  (8, 'quiz', $j${"variant":"multiple_choice","prompt":"with open(\"reporte.txt\", \"w\") as archivo: es la forma profesional de escribir el reporte porque:","options":["Es más corta","Garantiza el cierre del archivo al salir del bloque — el reporte queda guardado pase lo que pase","Colorea la consola","Evita usar print"],"correctIndex":1,"feedback":{"correct":"Correcto. El with cierra por ti incluso ante un error a mitad de la escritura.","incorrect":"El with es el cinturón de seguridad: cierre garantizado, datos a salvo."}}$j$),
  (9, 'quiz', $j${"variant":"multiple_choice","prompt":"Descubres que tu reporte calcula mal los ingresos. Según el flujo profesional del módulo 8, ANTES de corregir el código debes:","options":["Borrar el reporte","Escribir la prueba (assert) que reproduce el error y verla fallar — tras el arreglo queda de guardia contra regresiones","Reiniciar el laboratorio","Cambiar de archivo"],"correctIndex":1,"feedback":{"correct":"Correcto. Prueba que falla → arreglo → prueba en verde: el bug documentado, verificado y vigilado para siempre.","incorrect":"Primero la prueba que delata (y falla), luego el arreglo (y pasa): así el bug no puede volver sin que suene la alarma."}}$j$),
  (10, 'quiz', $j${"variant":"multiple_choice","prompt":"La regla de oro ética que te llevas del curso:","options":["Los datos rápidos valen más que los correctos","JAMÁS practicar ni experimentar con datos reales de pacientes: sintéticos para aprender — la privacidad de las personas no es material de práctica","Los CSV no necesitan cuidado","La ética es solo para los abogados"],"correctIndex":1,"feedback":{"correct":"Correcto. El hábito se construyó aquí; en el trabajo real tendrá contratos y auditorías detrás.","incorrect":"Los datos de salud son de las personas: para aprender, SIEMPRE sintéticos. Es la regla que te acompaña toda la carrera."}}$j$),
  (11, 'quiz', $j${"variant":"multiple_choice","prompt":"Pregunta final de entrevista: 'escribiste if temperatura >= 38 en tu triage. ¿En qué se diferencia eso de un modelo de machine learning?' Tu respuesta senior:","options":["En nada: ML es un if grande","En quién escribe la regla: la mía la pensé y escribí yo; un modelo de ML APRENDE las reglas de los datos — con el poder y los riesgos (sesgos incluidos) que eso implica","ML no usa temperaturas","Mi triage es más lento"],"correctIndex":1,"feedback":{"correct":"Impecable. Reglas escritas vs reglas aprendidas — y la supervisión humana que no se delega. Estás lista para Fundamentos de IA y ML: la siguiente parada de tu ruta.","incorrect":"La respuesta senior: en tu triage la regla la escribió un humano; en ML la máquina la descubre en los datos — heredando también sus sesgos, por eso la supervisión humana no se delega."}}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm09-x01-examen';
