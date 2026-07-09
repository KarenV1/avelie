-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 038 — Python desde Cero · Módulo 7: Archivos y CSV
-- ═══════════════════════════════════════════════════════════════════
-- Temario v2 (9 módulos). Entran en escena los datasets del curso
-- (public/datasets/): el motor los precarga al sistema de archivos
-- (campo `archivos` del ejercicio) y el alumno usa open("pacientes.csv")
-- como Python estándar puro — sin URLs ni maquinaria visible.
-- Datos del dataset usados en contenido y práctica (verificados):
--   pacientes.csv = 38 filas · San Rafael = 8 · ciudad vacía = 2
-- Incluye la nota_etica del curso: datos sintéticos, jamás datos
-- reales de pacientes.
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
  where c.slug = 'python-desde-cero' and m.slug = 'm07-archivos-y-csv'
);

-- ── Lecciones del módulo ──────────────────────────────────────────────
insert into public.lessons (module_id, slug, title, kind, xp, sort_order)
select m.id, v.slug, v.title, v.kind, v.xp, v.ord
from public.modules m
join public.courses c on c.id = m.course_id,
     (values
       ('m07-l01-escribir-archivos', 'Escribir archivos',                'leccion',  20, 1),
       ('m07-l02-leer-archivos',     'Leer archivos',                    'leccion',  20, 2),
       ('m07-l03-modulo-csv',        'El módulo csv',                    'leccion',  20, 3),
       ('m07-l04-datos-clinica',     'Los archivos de la clínica',       'leccion',  20, 4),
       ('m07-l05-practica-censo',    'Práctica: el censo de la clínica', 'practica', 20, 5),
       ('m07-x01-examen',            'Examen: Archivos y CSV',           'examen',   40, 6)
     ) as v(slug, title, kind, xp, ord)
where c.slug = 'python-desde-cero' and m.slug = 'm07-archivos-y-csv';

-- ═════════════════════════════════════════════════════════════════════
-- L01 · Escribir archivos
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Datos que sobreviven al programa","body":"Todo lo que has calculado hasta hoy muere cuando el programa termina: las variables son memoria de corto plazo. Los ARCHIVOS son la memoria de largo plazo: lo escrito queda guardado y otro programa (u otro día) puede leerlo. La puerta es open(nombre, modo): el modo \"w\" (write) abre para ESCRIBIR — crea el archivo o REEMPLAZA su contenido si existía —, y el modo \"a\" (append) AÑADE al final sin borrar nada, como una bitácora. Dos detalles técnicos: .write() no añade saltos de línea — el \"\\n\" lo pones tú —, y todo archivo abierto debe cerrarse. La forma profesional lo hace sola: with open(...) as archivo: — al salir del bloque indentado, el archivo se cierra y lo escrito queda a salvo, pase lo que pase."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"El parte del día, a disco","code":"with open(\"parte.txt\", \"w\") as archivo:\n    archivo.write(\"Parte del turno — Clínica San Rafael\\n\")\n    archivo.write(\"Pacientes atendidos: 4\\n\")\n    archivo.write(\"Urgencias: 1\\n\")\n\nprint(\"Parte guardado en parte.txt\")","result":{"columns":["CONSOLA"],"rows":[["Parte guardado en parte.txt"]],"note":"Tres write, tres líneas — porque cada una lleva su \\n. Al salir del with, el archivo quedó cerrado y guardado."},"caption":"El with es el cinturón de seguridad de los archivos: cierra por ti, incluso si algo falla a mitad del bloque."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿qué garantiza with open(...) as archivo: frente a un open() suelto?","options":["Que el archivo sea más pequeño","Que el archivo se CIERRE automáticamente al salir del bloque — lo escrito queda a salvo pase lo que pase","Que se escriba más rápido","Que no haga falta el modo"],"correctIndex":1,"feedback":{"correct":"Correcto. El with cierra por ti, incluso si algo falla dentro del bloque: es la forma profesional.","incorrect":"El with garantiza el CIERRE del archivo al terminar el bloque — sin él, un olvido o un error pueden dejar datos sin guardar."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"Abres el mismo archivo dos días seguidos para agregar el parte diario. ¿Qué modo evita borrar el parte de ayer?","options":["\"w\", porque escribe","\"a\" (append): añade al final sin tocar lo existente — \"w\" habría REEMPLAZADO todo","\"r\"","Da igual el modo"],"correctIndex":1,"feedback":{"correct":"Correcto. \"a\" es la bitácora: acumula. \"w\" arranca de cero cada vez.","incorrect":"El modo \"w\" reemplaza el contenido al abrir. Para acumular día tras día, el modo es \"a\" (append)."}}$j$),
  (5, 'resumen', $j${"title":"Resumen — Escribir archivos","points":["Las variables mueren con el programa; los archivos son la memoria de largo plazo.","open(nombre, \"w\") escribe (crea o REEMPLAZA); open(nombre, \"a\") añade al final.",".write() no pone saltos de línea: el \\n va por tu cuenta.","with open(...) as archivo: cierra solo al salir del bloque — úsalo siempre.","Guardar el resultado de un análisis es tan importante como calcularlo."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm07-l01-escribir-archivos';

-- ═════════════════════════════════════════════════════════════════════
-- L02 · Leer archivos
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"El for que lee","body":"Para leer, open(nombre) sin modo (leer es el modo por defecto). Y aquí una elegancia de Python: el archivo abierto es una SECUENCIA de líneas — tu viejo amigo el for lo recorre directo: for linea in archivo:. Detalle técnico que sorprende la primera vez: cada línea llega con su salto \\n al final (así estaba en el archivo), y al imprimirla con print — que añade otro salto — aparecen líneas en blanco de más. El remedio es .strip(), un método de las cadenas que limpia espacios y saltos en los extremos. Última pieza: abrir un archivo que NO existe lanza FileNotFoundError — otro primo con nombre, y ya sabes exactamente cómo se doma (módulo 6)."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Escribir, y volver a leer","code":"with open(\"parte.txt\", \"w\") as archivo:\n    archivo.write(\"Pacientes atendidos: 4\\n\")\n    archivo.write(\"Urgencias: 1\\n\")\n\nwith open(\"parte.txt\") as archivo:   # sin modo: lectura\n    for linea in archivo:\n        print(linea.strip())","result":{"columns":["CONSOLA"],"rows":[["Pacientes atendidos: 4"],["Urgencias: 1"]],"note":"El for recorrió el archivo línea a línea; strip() quitó el \\n de cada una para que print no duplicara saltos."},"caption":"El ciclo completo de la memoria de largo plazo: un programa escribe, cualquier programa (este u otro) lee."}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En for linea in archivo:, ¿qué contiene la variable linea en cada vuelta?","options":["El archivo completo","Una línea del archivo, incluyendo su salto \\n final (por eso se limpia con .strip())","Solo la primera palabra","Un número de línea"],"correctIndex":1,"feedback":{"correct":"Correcto. El archivo es una secuencia de líneas — y cada una trae su \\n de fábrica.","incorrect":"El for entrega el archivo línea por línea, y cada línea llega con su salto \\n al final: .strip() lo limpia."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"Tu programa hace open(\"historial.txt\") pero el archivo no existe. ¿Qué pasa y cómo se maneja?","options":["Se crea vacío automáticamente","Lanza FileNotFoundError — y se maneja como todo error con nombre: try/except FileNotFoundError:","Devuelve una cadena vacía","El programa espera a que exista"],"correctIndex":1,"feedback":{"correct":"Correcto. Otro primo de la familia: nombre conocido, paracaídas conocido.","incorrect":"Leer un archivo inexistente lanza FileNotFoundError; el módulo 6 ya te dio la herramienta: except FileNotFoundError:."}}$j$),
  (5, 'resumen', $j${"title":"Resumen — Leer archivos","points":["open(nombre) sin modo abre para LEER.","El archivo es una secuencia de líneas: for linea in archivo: lo recorre.","Cada línea llega con su \\n: límpialo con .strip().","Archivo inexistente → FileNotFoundError: se doma con try/except.","Escribir y releer es el ciclo completo de la persistencia."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm07-l02-leer-archivos';

-- ═════════════════════════════════════════════════════════════════════
-- L03 · El módulo csv
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Baterías incluidas: tu primer import","body":"Un archivo CSV (comma-separated values) es una tabla en texto plano: la primera línea trae los nombres de las columnas y cada línea siguiente es una fila con sus valores separados por comas. Es LA lingua franca de los datos: hojas de cálculo, sistemas médicos, exportaciones bancarias — todo habla CSV. ¿Partir cada línea a mano? Podrías… pero Python viene con baterías incluidas: la LIBRERÍA ESTÁNDAR es una colección de módulos listos para usar, y se invitan con import. import csv al inicio del programa, y el módulo csv trabaja para ti. Su joya es csv.DictReader: lee el archivo y entrega cada fila como un DICCIONARIO cuyas claves son los nombres de las columnas. ¿Te suena? Es la analogía del módulo 4 hecha realidad: el archivo SE CONVIERTE en tu tabla — fila = diccionario, columna = clave."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"De archivo plano a tabla con nombres","code":"import csv\n\n# un CSV pequeño, escrito por nosotros mismos\nwith open(\"turno.csv\", \"w\") as archivo:\n    archivo.write(\"paciente,costo,temperatura\\n\")\n    archivo.write(\"Ana Torres,850,38.2\\n\")\n    archivo.write(\"Luis Vega,600,36.8\\n\")\n\n# y leído como tabla: cada fila llega como diccionario\nwith open(\"turno.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        print(f\"{fila['paciente']} pagó {fila['costo']}\")","result":{"columns":["CONSOLA"],"rows":[["Ana Torres pagó 850"],["Luis Vega pagó 600"]],"note":"DictReader usó la primera línea (el encabezado) como claves: fila['paciente'], fila['costo'], fila['temperatura']."},"caption":"La analogía del módulo 4, cumplida: el CSV entra por open() y sale como lista de diccionarios que ya sabes recorrer."}$j$),
  (3, 'texto', $j${"title":"La letra pequeña: todo llega como texto","body":"Aviso técnico que te ahorrará una tarde de confusión: TODO lo que sale de un CSV es str. En el ejemplo anterior, fila['costo'] no es 850 — es \"850\", texto con forma de número, exactamente como pasaba con input() en el módulo 1. Antes de sumar o comparar: int(fila['costo']), float(fila['temperatura']). ¿Y si el archivo trae un valor sucio — un texto donde iba un número, un campo vacío? La conversión lanza ValueError… y tú ya tienes el paracaídas del módulo 6. No es casualidad: input(), los CSV y (más adelante) las respuestas de internet entregan texto — convertir con defensa es EL gesto del análisis de datos real."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿qué entrega csv.DictReader por cada línea de datos del archivo?","options":["Una cadena con comas","Un DICCIONARIO cuyas claves son los nombres de las columnas del encabezado","Una lista de números","Un archivo nuevo"],"correctIndex":1,"feedback":{"correct":"Correcto. Fila = diccionario, columna = clave: el CSV se vuelve la tabla del módulo 4.","incorrect":"DictReader usa el encabezado como claves y entrega cada fila como diccionario: fila['paciente'], fila['costo']…"}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"Un CSV trae la columna costo con el valor 850. ¿Qué devuelve fila['costo'] y qué necesitas para sumarlo?","options":["El int 850, listo para sumar","El str \"850\": TODO sale del CSV como texto — conviertes con int() (y con la defensa del módulo 6 si puede venir sucio)","Un float automático","Depende del archivo"],"correctIndex":1,"feedback":{"correct":"Correcto. Como input(): texto siempre. int()/float() para operar, try/except cuando el dato pueda mentir.","incorrect":"Los CSV entregan texto sin excepción: \"850\" necesita int() antes de cualquier suma — y paracaídas si el archivo viene sucio."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — El módulo csv","points":["CSV: tabla en texto plano — encabezado con columnas, filas separadas por comas. La lingua franca de los datos.","La librería estándar viene con Python; import csv invita al módulo.","csv.DictReader entrega cada fila como diccionario con las claves del encabezado: la analogía del módulo 4, cumplida.","TODO sale del CSV como str — como input(): convierte con int()/float().","Dato sucio + conversión = ValueError: tu defensa del módulo 6 entra en acción."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm07-l03-modulo-csv';

-- ═════════════════════════════════════════════════════════════════════
-- L04 · Los archivos de la clínica (+ nota ética del curso)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Tus datos de trabajo, listos en el laboratorio","body":"A partir de aquí trabajas con los archivos de la clínica, que ya están disponibles en tu laboratorio: pacientes.csv (38 pacientes: paciente_id, nombre, fecha_nacimiento, grupo_sanguineo, sexo, ciudad), citas.csv (las citas con su médico, costo y estado) e inventario_farmacia.csv (el stock de la farmacia). Los abres como cualquier archivo: open(\"pacientes.csv\") — y en tu propia computadora sería igual: el archivo junto a tu programa. Una advertencia de la que ya sabes defenderte: estos archivos vienen SUCIOS a propósito, como los reales — hay pacientes sin ciudad registrada, una fecha en formato dd/mm/aaaa donde no toca, un grupo sanguíneo en minúsculas. Nada de eso te detendrá: el módulo 6 te entrenó exactamente para esto."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Primer contacto con pacientes.csv","code":"import csv\n\ncon_datos = 0\nwith open(\"pacientes.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        con_datos = con_datos + 1\n        if con_datos <= 2:   # mostramos solo las dos primeras\n            print(f\"{fila['nombre']} · grupo {fila['grupo_sanguineo']} · {fila['ciudad']}\")\n\nprint(f\"Total de pacientes en el archivo: {con_datos}\")","result":{"columns":["CONSOLA"],"rows":[["Ana Torres · grupo O+ · San Rafael"],["Luis Vega · grupo A- · Los Álamos"],["Total de pacientes en el archivo: 38"]],"note":"Ana Torres y Luis Vega: los mismos pacientes que te acompañan desde el módulo 1, ahora saliendo de un archivo real."},"caption":"38 filas recorridas con el mismo for de siempre. El archivo es grande para escribirlo a mano — y trivial para tu programa."}$j$),
  (3, 'nota_etica', $j${"title":"Datos sintéticos: la regla de oro","body":"Los pacientes de estos archivos NO existen: son datos SINTÉTICOS, inventados para practicar. Y eso encierra la regla profesional más importante de todo tu camino en datos de salud: JAMÁS practiques, pruebes ni experimentes con datos reales de pacientes — ni los copies a tu equipo, ni los subas a servicios en línea, ni los compartas 'solo para probar una cosa'. Los datos médicos están protegidos por el secreto profesional y por las leyes de protección de datos personales, y una filtración daña a personas de verdad. Con datos sintéticos aprendes exactamente lo mismo, sin poner a nadie en riesgo. Cuando llegues a un trabajo real, esta regla tendrá manuales, contratos y auditorías detrás — pero el hábito se construye hoy."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Por qué este curso te entrena con datos sintéticos en lugar de datos reales de pacientes?","options":["Porque los reales son más caros","Porque los datos médicos reales están protegidos por el secreto profesional y las leyes de protección de datos: practicar con ellos pondría en riesgo a personas de verdad","Porque los sintéticos son más fáciles de leer","Porque los reales no caben en un CSV"],"correctIndex":1,"feedback":{"correct":"Correcto. Con sintéticos aprendes lo mismo sin arriesgar a nadie — y construyes el hábito profesional desde hoy.","incorrect":"La razón es ética y legal: los datos de salud reales son confidenciales. Para aprender, los sintéticos dan exactamente la misma práctica."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"En pacientes.csv hay registros con la ciudad sin capturar. Al leerlos con DictReader, fila['ciudad'] devuelve:","options":["None","KeyError","La cadena vacía \"\" — el dato sucio NO revienta: se caza con un if, no con try","El nombre de la ciudad anterior"],"correctIndex":2,"feedback":{"correct":"Correcto. La columna existe, su valor está vacío: \"\" es un str legal. Es de los que MIENTEN, no de los que revientan — trabajo del if.","incorrect":"El campo vacío llega como cadena vacía \"\": no lanza error alguno. Detectarlo es trabajo del if (fila['ciudad'] == \"\")."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — Los archivos de la clínica","points":["Tres archivos te acompañan desde aquí: pacientes.csv (38), citas.csv e inventario_farmacia.csv.","Se abren como cualquier archivo: open(\"pacientes.csv\") — en tu computadora sería igual, con el archivo junto al programa.","Vienen sucios a propósito: ciudades vacías, una fecha dd/mm/aaaa, un grupo en minúsculas — tu defensa del módulo 6 tiene trabajo.","El campo vacío llega como \"\" (miente, no revienta): se caza con if.","⚖️ Regla de oro: datos reales de pacientes JAMÁS — sintéticos para aprender, siempre."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm07-l04-datos-clinica';

-- ═════════════════════════════════════════════════════════════════════
-- L05 · Práctica: el censo de la clínica (usa pacientes.csv real)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'ejercicio', $j${"scenario":"La dirección pide el censo: cuántos pacientes hay registrados, cuántos viven en San Rafael (la sede quiere saber su alcance local) y cuántos registros tienen la ciudad sin capturar — el dato sucio que ya conoces. El archivo pacientes.csv está en tu laboratorio, listo para abrirse.","instructions":["Dentro del for, suma 1 a total por cada fila.","Si fila[\"ciudad\"] == \"San Rafael\", suma 1 a san_rafael.","Si fila[\"ciudad\"] == \"\" (vacía), suma 1 a sin_ciudad.","El pass es el relleno del esqueleto: bórralo al escribir. No toques los print finales."],"initialCode":"import csv\n\ntotal = 0\nsan_rafael = 0\nsin_ciudad = 0\n\nwith open(\"pacientes.csv\") as archivo:\n    for fila in csv.DictReader(archivo):\n        # TODO: cuenta el total, los de San Rafael\n        #       y los que tienen la ciudad vacía\n        pass\n\nprint(f\"Pacientes registrados: {total}\")\nprint(f\"De San Rafael: {san_rafael}\")\nprint(f\"Sin ciudad registrada: {sin_ciudad}\")","validators":["total\\s*(=\\s*total\\s*\\+\\s*1|\\+=\\s*1)","fila\\[\\s*[\"']ciudad[\"']\\s*\\]\\s*==\\s*[\"']san rafael[\"']","fila\\[\\s*[\"']ciudad[\"']\\s*\\]\\s*==\\s*(\"\"|'')","san_rafael\\s*(=\\s*san_rafael\\s*\\+\\s*1|\\+=\\s*1)","sin_ciudad\\s*(=\\s*sin_ciudad\\s*\\+\\s*1|\\+=\\s*1)"],"entradas":[],"archivos":["pacientes.csv"],"salidaEsperada":["Pacientes registrados: 38","De San Rafael: 8","Sin ciudad registrada: 2"],"mockOutput":{"columns":["CONSOLA"],"rows":[["Pacientes registrados: 38"],["De San Rafael: 8"],["Sin ciudad registrada: 2"]],"note":"El censo completo: 38 pacientes, 8 locales y los 2 registros sucios detectados — datos reales del archivo."},"hints":["Tres contadores, tres gestos dentro del for: total siempre suma; los otros dos, cada uno con su if.","Las comparaciones: fila[\"ciudad\"] == \"San Rafael\" (respeta mayúsculas: así está en el archivo) y fila[\"ciudad\"] == \"\" para el campo vacío.","¿Borraste el pass? Era solo el relleno del esqueleto."],"successMessage":"Censo entregado: leíste un archivo real, lo recorriste como la tabla que es y cazaste hasta los registros sucios. Este es el flujo del análisis de datos de verdad — y el proyecto final lo llevará al siguiente nivel.","failMessage":"Revisa: total sumando en cada fila, san_rafael con su if de \"San Rafael\" (mayúsculas exactas), sin_ciudad con su if de cadena vacía \"\" — y el pass eliminado."}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm07-l05-practica-censo';

-- ═════════════════════════════════════════════════════════════════════
-- X01 · Examen de región (jefe del módulo)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"La séptima región","body":"Byte llegó a la región de los archivos: diez preguntas guardan el paso. Todo lo viviste: escribir y leer con with, el módulo csv convirtiendo archivos en tablas, los datos sucios de la clínica y la regla de oro de los datos sintéticos. Las preguntas que falles volverán al final hasta que las domines. Adelante."}$j$),
  (2, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué diferencia de fondo hay entre guardar un resultado en una variable y guardarlo en un archivo?","options":["Ninguna","La variable muere al terminar el programa; el archivo PERSISTE y otro programa (u otro día) puede leerlo","El archivo es más rápido","La variable acepta más datos"],"correctIndex":1,"feedback":{"correct":"Correcto. Memoria de corto plazo vs memoria de largo plazo: esa es la razón de ser de los archivos.","incorrect":"Las variables viven solo mientras corre el programa; los archivos sobreviven — persistencia."}}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"Cada noche agregas el parte del día a bitacora.txt sin borrar los anteriores. El open correcto es:","options":["open(\"bitacora.txt\", \"w\")","open(\"bitacora.txt\", \"a\"): append añade al final; \"w\" reemplazaría todo","open(\"bitacora.txt\")","open(\"bitacora.txt\", \"nuevo\")"],"correctIndex":1,"feedback":{"correct":"Correcto. \"a\" acumula como bitácora; \"w\" arranca de cero cada vez.","incorrect":"Para AÑADIR sin borrar, el modo es \"a\" (append). \"w\" reemplaza el contenido al abrir."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"La razón por la que with open(...) as archivo: es la forma profesional:","options":["Es más corta de escribir","Garantiza el CIERRE del archivo al salir del bloque, pase lo que pase — lo escrito queda a salvo","Colorea el código","Evita usar variables"],"correctIndex":1,"feedback":{"correct":"Correcto. El with cierra por ti incluso si algo falla dentro: cinturón de seguridad de los archivos.","incorrect":"El with garantiza el cierre automático del archivo — sin él, un error a mitad del bloque puede dejar datos sin guardar."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"Al leer un archivo con for linea in archivo: y mostrar con print(linea), aparecen líneas en blanco de más. ¿Por qué y cómo se arregla?","options":["El archivo está roto","Cada línea trae su \\n y print añade otro: se limpia con linea.strip()","Es un error de Python","Faltó el modo \"w\""],"correctIndex":1,"feedback":{"correct":"Correcto. Doble salto = línea fantasma. strip() limpia los extremos de la cadena.","incorrect":"Las líneas llegan con su \\n de fábrica y print suma el suyo: linea.strip() elimina el duplicado."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿qué es la librería estándar y cómo se usa uno de sus módulos?","options":["Una página web de documentación","La colección de módulos que viene incluida con Python: se invitan con import — por ejemplo, import csv","Un editor de texto","Código que hay que copiar a mano"],"correctIndex":1,"feedback":{"correct":"Correcto. Baterías incluidas: módulos listos (csv y muchos más) que entran al programa con import.","incorrect":"La librería estándar viene CON Python: import csv (y compañía) pone esos módulos a trabajar sin instalar nada."}}$j$),
  (7, 'quiz', $j${"variant":"multiple_choice","prompt":"csv.DictReader lee un archivo cuyo encabezado es paciente,costo. ¿Cómo accedes al costo de cada fila dentro del for?","options":["fila[1]","fila[\"costo\"]: cada fila es un diccionario con las claves del encabezado","fila.costo()","costo in fila"],"correctIndex":1,"feedback":{"correct":"Correcto. DictReader convierte cada fila en diccionario: la tabla del módulo 4, directa del archivo.","incorrect":"Las filas de DictReader son diccionarios: se accede por clave — fila[\"costo\"] — no por posición."}}$j$),
  (8, 'quiz', $j${"variant":"multiple_choice","prompt":"Del CSV llega fila[\"costo\"] con el valor \"850\". Para acumularlo en un total necesitas:","options":["Sumarlo directo: ya es número","Convertirlo — total = total + int(fila[\"costo\"]) — porque TODO sale del CSV como str","Usar float siempre","Cambiar el archivo"],"correctIndex":1,"feedback":{"correct":"Correcto. Como input(): el CSV entrega texto. Sin conversión, la suma falla o concatena.","incorrect":"\"850\" es texto con forma de número: int() lo habilita para la aritmética — regla de oro de los CSV."}}$j$),
  (9, 'quiz', $j${"variant":"multiple_choice","prompt":"open(\"resumen_2025.txt\") falla porque el archivo no existe. El error y su manejo son:","options":["ValueError y un if","FileNotFoundError, manejable con try/except FileNotFoundError:","KeyError y un set","No se puede manejar"],"correctIndex":1,"feedback":{"correct":"Correcto. Otro primo con nombre — y el paracaídas del módulo 6 le queda perfecto.","incorrect":"Archivo inexistente = FileNotFoundError. Como todo error con nombre: try/except específico."}}$j$),
  (10, 'quiz', $j${"variant":"multiple_choice","prompt":"En un registro de pacientes.csv la ciudad no fue capturada. Al procesarlo, ese dato sucio…","options":["Lanza KeyError","Llega como cadena vacía \"\": no revienta — se detecta con if fila[\"ciudad\"] == \"\"","Detiene el DictReader","Se rellena solo"],"correctIndex":1,"feedback":{"correct":"Correcto. El vacío miente pero no revienta: es trabajo del if, no del try — el doble filtro del módulo 6.","incorrect":"La columna existe con valor vacío: \"\" es un str legal que ningún try atrapa — lo caza el if de validación."}}$j$),
  (11, 'quiz', $j${"variant":"multiple_choice","prompt":"Pregunta final de entrevista: 'te entregan un CSV de 100 000 filas que viene sucio — ¿tu plan?' Tu respuesta senior:","options":["Abrirlo en un editor y corregirlo a mano","DictReader para recorrerlo como tabla, conversiones con defensa (try para lo que revienta, if para vacíos y rangos), y contadores de registros válidos e inválidos: validar temprano, reportar claro","Rechazar el archivo","Convertirlo a papel"],"correctIndex":1,"feedback":{"correct":"Impecable. Recorrer como tabla + doble filtro + reporte de calidad: el flujo profesional que este módulo y el anterior te dejaron completo.","incorrect":"La respuesta senior junta los módulos 4, 6 y 7: DictReader (tabla), defensa en las conversiones (try + if) y conteo de válidos/inválidos para reportar la calidad del dato."}}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm07-x01-examen';
