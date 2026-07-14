-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 030 — Python desde Cero · Módulo 1: Primeros pasos
-- ═══════════════════════════════════════════════════════════════════
-- ⚠️ SUPERSEDIDA POR LA 032 (M1 v2) — NO RE-EJECUTAR ESTA MIGRACIÓN.
-- Escrita antes del giro a prácticas con Python real en la app: sus
-- laboratorios apuntan a Google Colab y su contenido explica la
-- tecnología interna, ambas cosas descartadas. La 032 la reemplaza
-- por completo (6 lecciones / 41 bloques, lo que hay en producción).
-- Se conserva solo como registro histórico.
-- ───────────────────────────────────────────────────────────────────
-- Contenido original: 5 lecciones + examen de región.
-- Hilo conductor: la clínica (mismo universo que SQL y Redes).
-- Idempotente: borra y recrea las lecciones de ESTE módulo.
-- Ejecutar DESPUÉS de 008.
-- ═══════════════════════════════════════════════════════════════════

-- Limpia el módulo (cascade borra sus content_blocks)
delete from public.lessons
where module_id = (
  select m.id
  from public.modules m
  join public.courses c on c.id = m.course_id
  where c.slug = 'python-desde-cero' and m.slug = 'm01-primeros-pasos'
);

-- ── Lecciones del módulo ──────────────────────────────────────────────
insert into public.lessons (module_id, slug, title, kind, xp, sort_order)
select m.id, v.slug, v.title, v.kind, v.xp, v.ord
from public.modules m
join public.courses c on c.id = m.course_id,
     (values
       ('m01-l01-que-es-python',       'Qué es Python y por qué en datos', 'leccion', 20, 1),
       ('m01-l02-tu-laboratorio-colab','Tu laboratorio: Google Colab',     'leccion', 20, 2),
       ('m01-l03-variables-y-tipos',   'Variables y tipos',                'leccion', 20, 3),
       ('m01-l04-operaciones-fstrings','Operaciones y f-strings',          'leccion', 20, 4),
       ('m01-l05-input-primer-programa','input() y tu primer programa',    'leccion', 20, 5),
       ('m01-x01-examen',              'Examen: Primeros pasos',           'examen',  40, 6)
     ) as v(slug, title, kind, xp, ord)
where c.slug = 'python-desde-cero' and m.slug = 'm01-primeros-pasos';

-- ═════════════════════════════════════════════════════════════════════
-- L01 · Qué es Python y por qué en datos
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Un lenguaje que se lee como se piensa","body":"Python es un lenguaje de programación de propósito general creado en 1991, famoso por una virtud: se lee casi como pseudocódigo. Donde otros lenguajes llenan la pantalla de símbolos, Python dice lo que hace. Esa legibilidad lo convirtió en el idioma del mundo de los datos y la IA: pandas para analizar tablas, matplotlib para graficar, scikit-learn y compañía para machine learning — todas las herramientas que usarás en la ruta Datos e IA hablan Python. Si el análisis de datos moderno tiene una lengua franca, es esta."}$j$),
  (2, 'texto', $j${"title":"Python y SQL: aliados, no rivales","body":"Ya sabes (o estás aprendiendo) SQL: el lenguaje para PREGUNTARLE a una base de datos. Python entra donde SQL se queda corto: procesar los resultados, automatizar el reporte que hoy haces a mano, cruzar un CSV que te mandó el laboratorio con lo que sacaste de la base, y graficarlo todo. En la clínica: SQL te da las citas de marzo; Python calcula la ocupación por médico, genera la gráfica y te la deja lista cada lunes. Un dato práctico: Python ejecuta las instrucciones de arriba hacia abajo, una por una — como una receta. Esa idea simple es la base de todo lo que viene."}$j$),
  (3, 'ejemplo_codigo', $j${"title":"Tu primera línea de Python","code":"# Esto es un comentario: Python lo ignora, los humanos lo agradecen\nprint(\"Hola, clínica\")\nprint(\"Python ejecuta de arriba hacia abajo\")","result":{"columns":["SALIDA"],"rows":[["Hola, clínica"],["Python ejecuta de arriba hacia abajo"]],"note":"print() muestra en pantalla lo que le pases entre paréntesis. Las líneas con # son comentarios."},"caption":"Dos instrucciones, dos líneas de salida, en orden. Así de directo es Python."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Por qué Python domina el mundo de los datos y la IA?","options":["Porque es el lenguaje más rápido que existe","Por su legibilidad y su ecosistema de librerías (pandas, matplotlib, scikit-learn)","Porque solo funciona en la nube","Porque reemplaza a SQL"],"correctIndex":1,"feedback":{"correct":"Correcto. Se lee fácil y tiene TODAS las herramientas del análisis de datos y el ML.","incorrect":"La clave es la combinación: código legible + el ecosistema de librerías de datos más completo que existe."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"En la clínica, ¿qué papel juega cada lenguaje?","options":["SQL pregunta a la base de datos; Python procesa, automatiza y grafica los resultados","Python pregunta a la base; SQL grafica","Son intercambiables","SQL es para principiantes y Python para expertos"],"correctIndex":0,"feedback":{"correct":"Exacto. SQL extrae; Python transforma, automatiza y visualiza. Juntos son el flujo completo de datos.","incorrect":"Cada uno en lo suyo: SQL consulta la base de datos; Python procesa esos resultados, los automatiza y los grafica."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — Qué es Python","points":["Python (1991) es un lenguaje de propósito general que se lee casi como pseudocódigo.","Es el idioma del mundo de datos e IA: pandas, matplotlib, scikit-learn.","SQL pregunta a la base; Python procesa, automatiza y grafica. Aliados, no rivales.","Python ejecuta de arriba hacia abajo, como una receta.","print() muestra en pantalla; los comentarios con # son para humanos."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm01-l01-que-es-python';

-- ═════════════════════════════════════════════════════════════════════
-- L02 · Tu laboratorio: Google Colab
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Un laboratorio en el navegador","body":"Google Colab es tu laboratorio de Python: un cuaderno (notebook) que corre en el navegador, gratis, con Python ya instalado — el código se ejecuta en servidores de Google, no en tu computadora, así que no importa si tu equipo es modesto. Un notebook se compone de CELDAS: celdas de código (se ejecutan) y celdas de texto (para tus notas). Esta forma de trabajar domina el mundo de los datos por una razón: el resultado aparece justo debajo del código que lo produjo, perfecto para explorar datos paso a paso. Todos los laboratorios del curso son en Colab; no instalarás nada."}$j$),
  (2, 'laboratorio', $j${"title":"Tu primer notebook","code":"# 1) Abre colab.research.google.com e inicia sesión con tu cuenta de Google\n# 2) Clic en 'Archivo' → 'Nuevo notebook en Drive'\n# 3) En la primera celda, escribe esta línea:\nprint(\"Mi laboratorio está vivo\")\n# 4) Ejecútala con Shift+Enter (o el botón ▶ a la izquierda de la celda)\n# 5) Ponle nombre al notebook: clic en 'Untitled0' arriba → 'curso-python'\n\n# Alternativa local (opcional, NO requerida para el curso):\n# instalar Python desde python.org y usar VS Code o IDLE","caption":"Si ves la salida bajo la celda, ya tienes laboratorio. El notebook se guarda solo en tu Google Drive.","result":{"columns":["SALIDA"],"rows":[["Mi laboratorio está vivo"]],"note":"El [1] que aparece junto a la celda es su número de ejecución — enseguida verás por qué importa."}}$j$),
  (3, 'texto', $j${"title":"La regla de oro de los notebooks","body":"Las celdas parecen independientes, pero comparten la MISMA memoria: una variable creada en la celda 2 existe para la celda 5. Y el orden en que las EJECUTAS (no el orden en que están escritas) es el que manda — por eso cada celda muestra su número de ejecución [1], [2], [3]. El despiste clásico: editas una celda de arriba, no la re-ejecutas, y las de abajo siguen usando el valor viejo. Cuando un notebook se comporte raro, el remedio universal es: menú 'Entorno de ejecución' → 'Reiniciar y ejecutar todo', que corre todo de arriba a abajo, limpio."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Cómo se ejecuta una celda en Colab?","options":["Guardando el archivo","Con Shift+Enter o el botón ▶","Cerrando el navegador","Escribiendo run al final"],"correctIndex":1,"feedback":{"correct":"Correcto. Shift+Enter ejecuta y pasa a la siguiente celda — lo harás mil veces.","incorrect":"Shift+Enter (o el botón ▶ de la celda) ejecuta el código de esa celda."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"Editas una celda de arriba pero no la re-ejecutas. Las celdas de abajo…","options":["Se actualizan solas","Siguen usando el valor viejo: manda el orden de EJECUCIÓN, no el de escritura","Dan error inmediatamente","Se borran"],"correctIndex":1,"feedback":{"correct":"Exacto. Las celdas comparten memoria y solo cambia lo que re-ejecutas. Ante la duda: 'Reiniciar y ejecutar todo'.","incorrect":"Las celdas comparten memoria: hasta que re-ejecutes, las demás ven el valor viejo. El remedio: 'Reiniciar y ejecutar todo'."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — Google Colab","points":["Colab: notebooks de Python en el navegador, gratis y sin instalar nada (corre en servidores de Google).","Celdas de código y de texto; el resultado aparece bajo la celda que lo produjo.","Todas las celdas comparten la misma memoria.","Manda el orden de EJECUCIÓN (los números [1], [2]…), no el orden de escritura.","Notebook raro = 'Entorno de ejecución → Reiniciar y ejecutar todo'.","Los notebooks se guardan en tu Google Drive."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm01-l02-tu-laboratorio-colab';

-- ═════════════════════════════════════════════════════════════════════
-- L03 · Variables y tipos
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Etiquetas con nombre","body":"Una variable es una etiqueta con nombre pegada a un dato: paciente = \"Ana Torres\" guarda ese texto bajo el nombre paciente, y desde entonces puedes usarlo cuantas veces quieras. El signo = NO significa igualdad: significa ASIGNAR (guarda esto ahí). Los nombres se escriben en snake_case por convención: minúsculas y guiones bajos (edad_paciente, total_citas). No pueden empezar con número ni llevar espacios ni acentos. Un buen nombre es documentación gratis: t no dice nada; temperatura_corporal lo dice todo."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Los cuatro tipos que cubren casi todo","code":"nombre = \"Ana Torres\"        # str  — texto, siempre entre comillas\nedad = 35                    # int  — número entero\ntemperatura = 36.8           # float — número con decimales\ntiene_seguro = True          # bool — True o False\n\nprint(type(nombre))\nprint(type(edad))\nprint(type(temperatura))\nprint(type(tiene_seguro))","result":{"columns":["SALIDA"],"rows":[["<class 'str'>"],["<class 'int'>"],["<class 'float'>"],["<class 'bool'>"]],"note":"type() te dice qué tipo guarda una variable. Úsalo cada vez que dudes."},"caption":"str, int, float y bool: con estos cuatro tipos se modela la ficha completa de un paciente."}$j$),
  (3, 'texto', $j${"title":"Por qué importan los tipos","body":"El tipo decide qué puedes hacer con el dato: los números se suman, los textos se unen, los bool deciden caminos (módulo 2). La trampa clásica: \"36.8\" entre comillas es un str — TEXTO que parece número — y no puedes hacer matemáticas con él. Ojo también con esto: en Python la misma variable puede cambiar de tipo si le asignas otra cosa (edad = 35 y luego edad = \"treinta y cinco\" es legal). Legal, pero mala idea: mantén cada variable en un solo tipo y tu código será predecible."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué devuelve type(\"36.8\")?","options":["<class 'float'>","<class 'int'>","<class 'str'> — las comillas lo hacen texto","Un error"],"correctIndex":2,"feedback":{"correct":"Correcto. Entre comillas es texto, aunque parezca número. La trampa clásica de los datos que llegan de archivos.","incorrect":"Las comillas mandan: \"36.8\" es un str (texto con forma de número). Sin comillas sería float."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Cuál es un nombre de variable válido y con buen estilo Python?","options":["Edad Paciente","2da_temperatura","edad_paciente","edadPaciente!"],"correctIndex":2,"feedback":{"correct":"Correcto. snake_case: minúsculas y guiones bajos, sin espacios ni símbolos, sin empezar por número.","incorrect":"El estilo Python es snake_case: edad_paciente. Sin espacios, sin empezar con número, sin símbolos."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"Para registrar si un paciente tiene seguro médico, el tipo natural es:","options":["str, guardando \"sí\" o \"no\"","bool: True o False","int, guardando 1 o 0","float"],"correctIndex":1,"feedback":{"correct":"Correcto. Dos estados posibles = bool. En el módulo 2 los bool decidirán caminos con if.","incorrect":"Cuando algo solo puede ser sí o no, el tipo es bool (True/False): es exactamente para eso."}}$j$),
  (7, 'resumen', $j${"title":"Resumen — Variables y tipos","points":["Variable = etiqueta con nombre para un dato; = significa asignar, no igualdad.","Nombres en snake_case: edad_paciente, total_citas. Un buen nombre es documentación gratis.","Cuatro tipos base: str (texto), int (entero), float (decimal), bool (True/False).","\"36.8\" con comillas es str, no número: las comillas mandan.","type() revela el tipo cuando dudes.","Cada variable en un solo tipo: legal cambiarlo, mala idea hacerlo."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm01-l03-variables-y-tipos';

-- ═════════════════════════════════════════════════════════════════════
-- L04 · Operaciones y f-strings
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Matemáticas de todos los días","body":"Los operadores aritméticos: + suma, - resta, * multiplica, / divide, ** eleva a potencia. Y dos primos útiles: // división entera (descarta decimales) y % módulo (el residuo de la división). Detalle importante: / SIEMPRE devuelve float, aunque la división sea exacta (10 / 2 es 5.0). ¿Y con textos? + une strings (\"Ana\" + \" Torres\"), pero mezclar texto con número — \"Edad: \" + 35 — lanza el error más famoso de los principiantes: TypeError. Python no adivina si querías unir o sumar; hay que decírselo."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Calculando con datos de la clínica","code":"anio_nacimiento = 1991\nedad = 2026 - anio_nacimiento\n\ncitas_del_mes = 47\ndias_habiles = 22\npromedio = citas_del_mes / dias_habiles\n\nnombre = \"Ana Torres\"\nprint(f\"La paciente {nombre} tiene {edad} años\")\nprint(f\"Promedio de citas por día: {promedio:.2f}\")","result":{"columns":["SALIDA"],"rows":[["La paciente Ana Torres tiene 35 años"],["Promedio de citas por día: 2.14"]],"note":"La f antes de las comillas activa el f-string: lo que va entre {llaves} se evalúa y se inserta en el texto."},"caption":"El f-string es LA forma moderna de armar textos con datos. Y {promedio:.2f} redondea la salida a 2 decimales."}$j$),
  (3, 'texto', $j${"title":"f-strings y conversiones: el pegamento","body":"Un f-string es un texto con huecos inteligentes: f\"Paciente {nombre}, {edad} años\" evalúa lo que hay entre llaves — variables o expresiones completas, como f\"El doble: {edad * 2}\". El formato {valor:.2f} controla los decimales, clave para dinero y promedios. Y cuando necesites cambiar de tipo, las conversiones explícitas: int(\"35\") convierte texto a entero, float(\"36.8\") a decimal, str(35) a texto. Las necesitarás en la próxima lección, porque todo lo que el usuario teclea llega como texto."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Cuánto valen 7 // 2 y 7 % 2?","options":["3.5 y 0","3 y 1","2 y 3","3.5 y 1"],"correctIndex":1,"feedback":{"correct":"Correcto. // descarta decimales (3) y % da el residuo (1). Dupla útil para repartir y agrupar.","incorrect":"7 // 2 = 3 (división entera, sin decimales) y 7 % 2 = 1 (el residuo)."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"print(\"Edad: \" + 35) lanza TypeError. ¿Cuál es el arreglo idiomático?","options":["print(\"Edad: \" + \"35\") siempre","print(f\"Edad: {35}\") — o str(35) si insistes en el +","print(Edad: 35)","No tiene arreglo"],"correctIndex":1,"feedback":{"correct":"Correcto. El f-string convierte por ti y se lee mejor. str(35) también funciona, pero el f-string es el estilo Python.","incorrect":"No se puede unir str con int a pelo. El f-string — print(f\"Edad: {35}\") — es el arreglo idiomático."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"Quieres mostrar un costo con exactamente 2 decimales. ¿Cómo?","options":["f\"{costo:.2f}\"","f\"{costo:2d}\"","round(costo) dentro de comillas","costo.decimales(2)"],"correctIndex":0,"feedback":{"correct":"Correcto. :.2f = formato float con 2 decimales. El estándar para dinero y promedios.","incorrect":"El formato va dentro de las llaves del f-string: {costo:.2f} muestra 2 decimales."}}$j$),
  (7, 'resumen', $j${"title":"Resumen — Operaciones y f-strings","points":["Aritmética: + - * / ** , más // (división entera) y % (residuo).","/ siempre devuelve float, aunque la división sea exacta.","\"texto\" + número = TypeError: Python no mezcla tipos por ti.","f-string: f\"Paciente {nombre}, {edad} años\" — evalúa lo de las {llaves}.","{valor:.2f} formatea con 2 decimales: dinero y promedios.","Conversiones explícitas: int(), float(), str()."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm01-l04-operaciones-fstrings';

-- ═════════════════════════════════════════════════════════════════════
-- L05 · input() y tu primer programa
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Programas que conversan","body":"input(\"pregunta\") detiene el programa, muestra la pregunta y espera a que el usuario teclee algo. Y aquí la regla que causa el 80% de los errores de esta semana: input() SIEMPRE devuelve str, aunque el usuario escriba un número. Si necesitas operar con la respuesta, conviértela: edad = int(input(\"¿Año de nacimiento? \")). Con esto ya puedes armar la estructura de todo programa que escribirás en tu vida: ENTRADA (datos que llegan) → PROCESO (cálculos y decisiones) → SALIDA (resultados). Grábatela: en el módulo 2 le añadimos las decisiones."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Programa completo: la ficha rápida","code":"# ENTRADA\nnombre = input(\"Nombre del paciente: \")\nanio = int(input(\"Año de nacimiento: \"))\n\n# PROCESO\nedad = 2026 - anio\n\n# SALIDA\nprint(f\"Paciente: {nombre}\")\nprint(f\"Edad: {edad} años\")","result":{"columns":["CONSOLA"],"rows":[["Nombre del paciente: Ana Torres"],["Año de nacimiento: 1991"],["Paciente: Ana Torres"],["Edad: 35 años"]],"note":"Las dos primeras líneas son la interacción (lo que teclea el usuario); las dos últimas, la salida del programa."},"caption":"Entrada → proceso → salida: la anatomía de todo programa. Nota el int() envolviendo al input del año."}$j$),
  (3, 'texto', $j${"title":"Mini-reto: la toma de temperatura","body":"Tu turno, en tu notebook de Colab: escribe un programa que (1) pida el nombre del paciente, (2) pida su temperatura corporal — ojo: tiene decimales —, y (3) muestre: Paciente Ana Torres: 36.8 °C, con exactamente un decimal. BONUS para curiosos: ejecuta tu programa y escribe \"treinta y seis\" como temperatura. Observa el error que aparece — en el módulo 5 aprenderemos a defendernos de él. Resuélvelo antes de mirar la solución del siguiente bloque."}$j$),
  (4, 'ejemplo_codigo', $j${"title":"Solución propuesta — inténtala antes de mirar","code":"nombre = input(\"Nombre del paciente: \")\ntemperatura = float(input(\"Temperatura corporal: \"))\n\nprint(f\"Paciente {nombre}: {temperatura:.1f} °C\")","result":{"columns":["CONSOLA"],"rows":[["Nombre del paciente: Ana Torres"],["Temperatura corporal: 36.8"],["Paciente Ana Torres: 36.8 °C"]],"note":"float() (no int) porque la temperatura lleva decimales. Y el BONUS: escribir texto produce ValueError — Python no puede convertir \"treinta y seis\" a número. Lo domaremos con try/except en el módulo 5."},"caption":"¿Usaste float() y el formato :.1f? Entonces ya piensas en tipos."}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"El usuario ejecuta edad = input(\"Edad: \") y teclea 35. ¿Qué guarda edad?","options":["El int 35","El float 35.0","El str \"35\" — input SIEMPRE devuelve texto","Depende de lo que teclee"],"correctIndex":2,"feedback":{"correct":"Correcto. input devuelve str siempre, sin excepciones. Para operar: int(input(...)).","incorrect":"Regla sin excepciones: input() devuelve str. \"35\" es texto hasta que lo conviertas con int()."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"Para pedir la temperatura (36.8) y poder compararla después, la línea correcta es:","options":["temperatura = input(\"Temp: \")","temperatura = float(input(\"Temp: \"))","temperatura = int(input(\"Temp: \"))","temperatura = str(input(\"Temp: \"))"],"correctIndex":1,"feedback":{"correct":"Correcto. float() porque hay decimales; int() los perdería (y con \"36.8\" directamente falla).","incorrect":"La temperatura lleva decimales: float(input(...)). Con int() perderías el .8 — y de hecho int(\"36.8\") da error."}}$j$),
  (7, 'resumen', $j${"title":"Resumen — input() y tu primer programa","points":["input(\"pregunta\") espera lo que el usuario teclee… y lo devuelve SIEMPRE como str.","Para operar con la respuesta: int(input(...)) o float(input(...)).","Anatomía de todo programa: ENTRADA → PROCESO → SALIDA.","float() cuando hay decimales; int() los pierde o falla.","Convertir texto no numérico (\"treinta y seis\") lanza ValueError — lo domaremos en el módulo 5."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm01-l05-input-primer-programa';

-- ═════════════════════════════════════════════════════════════════════
-- X01 · Examen de región (jefe del módulo)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"La primera región","body":"Byte encendió su primer notebook y llegó al guardián de la región: diez preguntas. Todo lo que necesitas ya lo escribiste con tus manos — Colab, variables, tipos, operaciones, f-strings y tu primer programa completo. Las preguntas que falles volverán al final hasta que las domines. Adelante."}$j$),
  (2, 'quiz', $j${"variant":"multiple_choice","prompt":"La razón por la que Python es el idioma de los datos y la IA:","options":["Es el único lenguaje gratuito","Legibilidad + ecosistema de librerías (pandas, matplotlib, scikit-learn)","Fue creado por Google","No necesita computadora"],"correctIndex":1,"feedback":{"correct":"Correcto. Código que se lee fácil y todas las herramientas del análisis moderno.","incorrect":"La combinación ganadora: se lee casi como pseudocódigo y tiene el ecosistema de datos más completo."}}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En el flujo de trabajo de la clínica:","options":["Python consulta la base y SQL grafica","SQL consulta la base de datos; Python procesa, automatiza y grafica","Ambos hacen exactamente lo mismo","SQL ya no se usa cuando aprendes Python"],"correctIndex":1,"feedback":{"correct":"Correcto. SQL extrae, Python transforma y visualiza. El flujo completo de datos usa ambos.","incorrect":"Aliados: SQL pregunta a la base; Python procesa los resultados, los automatiza y los grafica."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Dónde se ejecuta el código cuando trabajas en Google Colab?","options":["En tu computadora","En servidores de Google — por eso no instalas nada","En el teléfono","En la base de datos"],"correctIndex":1,"feedback":{"correct":"Correcto. Tu navegador solo muestra el notebook; el Python corre en la nube de Google.","incorrect":"Colab ejecuta en servidores de Google: tu equipo solo necesita un navegador."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"En un notebook, ¿qué determina el valor actual de las variables?","options":["El orden en que las celdas están escritas","El orden en que las celdas fueron EJECUTADAS (los números [1], [2]…)","El orden alfabético","Cada celda tiene memoria propia"],"correctIndex":1,"feedback":{"correct":"Correcto. Memoria compartida + orden de ejecución. Ante lo raro: 'Reiniciar y ejecutar todo'.","incorrect":"Las celdas comparten memoria y manda el orden de EJECUCIÓN, no el de escritura."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"type(3.0) y type(\"36.8\") devuelven, respectivamente:","options":["int y float","float y str","float y float","int y str"],"correctIndex":1,"feedback":{"correct":"Correcto. El punto decimal hace float; las comillas hacen str, parezca número o no.","incorrect":"3.0 es float (punto decimal); \"36.8\" es str (las comillas mandan)."}}$j$),
  (7, 'quiz', $j${"variant":"multiple_choice","prompt":"15 // 4 y 15 % 4 valen:","options":["3.75 y 0","3 y 3","3 y 1","4 y 3"],"correctIndex":1,"feedback":{"correct":"Correcto. División entera: 3 (cabe 3 veces); residuo: 3 (sobran 3).","incorrect":"15 // 4 = 3 (4 cabe 3 veces en 15) y 15 % 4 = 3 (sobran 3)."}}$j$),
  (8, 'quiz', $j${"variant":"multiple_choice","prompt":"print(\"Total: \" + 850) falla. La corrección con mejor estilo Python:","options":["print(\"Total: \" + \"850\")","print(f\"Total: {850}\")","print(\"Total: \", + 850)","Cambiar print por input"],"correctIndex":1,"feedback":{"correct":"Correcto. El f-string convierte e inserta por ti — y se lee mejor que cualquier concatenación.","incorrect":"str + int = TypeError. El arreglo idiomático es el f-string: print(f\"Total: {850}\")."}}$j$),
  (9, 'quiz', $j${"variant":"multiple_choice","prompt":"Para mostrar el promedio 2.13636… como 2.14:","options":["f\"{promedio:.2f}\"","f\"{promedio:2}\"","print(promedio, 2)","f\"{.2f:promedio}\""],"correctIndex":0,"feedback":{"correct":"Correcto. :.2f dentro de las llaves = 2 decimales.","incorrect":"El formato va tras los dos puntos, dentro de las llaves: {promedio:.2f}."}}$j$),
  (10, 'quiz', $j${"variant":"multiple_choice","prompt":"edad = input(\"Edad: \") y el usuario teclea 35. Para calcular edad + 1 necesitas:","options":["Nada, ya es número","Haber convertido: edad = int(input(\"Edad: \"))","Usar edad + \"1\"","Reiniciar el notebook"],"correctIndex":1,"feedback":{"correct":"Correcto. input siempre entrega str; sin int() no hay aritmética.","incorrect":"input() devuelve \"35\" (texto). La conversión con int() es la que habilita las matemáticas."}}$j$),
  (11, 'quiz', $j${"variant":"multiple_choice","prompt":"Pregunta final de entrevista: ¿por qué el mundo de los datos trabaja en notebooks (Colab/Jupyter) y no en archivos de código tradicionales?","options":["Porque son más rápidos de ejecutar","Porque el resultado aparece junto al código que lo produjo: exploración iterativa, celda a celda, ideal para analizar datos","Porque los archivos .py son de pago","Porque los notebooks no tienen errores"],"correctIndex":1,"feedback":{"correct":"Impecable. Exploración iterativa con el resultado a la vista: por eso el análisis de datos vive en notebooks.","incorrect":"La razón senior: en datos exploras paso a paso, y el notebook muestra cada resultado junto a su código."}}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm01-x01-examen';
