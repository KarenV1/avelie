-- ═══════════════════════════════════════════════════════════════════
-- CodeQuest · Migración 034 — Python desde Cero · Módulo 3: Bucles
-- ═══════════════════════════════════════════════════════════════════
-- Temario v2 (9 módulos). Reaprovecha el material de bucles del 031 v1.
-- SIN listas (llegan en M4): los iterables de este módulo son range y
-- CADENAS como secuencias (ajuste aprobado por Karen). Los ejemplos y
-- mini-retos del v1 que usaban listas (recorrer temperaturas, llamar
-- pacientes, total y fiebres, promedio del turno) SE MUDAN a M4 (035)
-- como payoff de la primera lección de listas.
-- Reglas de contenido: quizzes autocontenidos o con términos técnicos.
-- La práctica final usa while + cola de entradas (motor real).
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
  where c.slug = 'python-desde-cero' and m.slug = 'm03-bucles'
);

-- ── Lecciones del módulo ──────────────────────────────────────────────
insert into public.lessons (module_id, slug, title, kind, xp, sort_order)
select m.id, v.slug, v.title, v.kind, v.xp, v.ord
from public.modules m
join public.courses c on c.id = m.course_id,
     (values
       ('m03-l01-for-y-range',        'El bucle for y range',            'leccion',  20, 1),
       ('m03-l02-cadenas-secuencias', 'Cadenas: tu primera secuencia',   'leccion',  20, 2),
       ('m03-l03-while',              'while: repetir mientras',         'leccion',  20, 3),
       ('m03-l04-acumuladores',       'Acumuladores: contar y sumar',    'leccion',  20, 4),
       ('m03-l05-practica-clasificador','Práctica: el clasificador del turno','practica', 20, 5),
       ('m03-x01-examen',             'Examen: Bucles',                  'examen',   40, 6)
     ) as v(slug, title, kind, xp, ord)
where c.slug = 'python-desde-cero' and m.slug = 'm03-bucles';

-- ═════════════════════════════════════════════════════════════════════
-- L01 · El bucle for y range
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Repetir sin copiar y pegar","body":"La clínica llama a 50 pacientes al día. ¿Vas a escribir 50 veces el mismo print? Para repetir existe el BUCLE for: recorre una SECUENCIA elemento por elemento y ejecuta su bloque indentado una vez por cada uno. La secuencia más simple la fabrica range: range(1, 6) genera 1, 2, 3, 4, 5, y for turno in range(1, 6): significa 'para cada número de esa secuencia, haz esto'. En cada vuelta, la VARIABLE DEL BUCLE (turno) toma el siguiente valor — primero 1, luego 2… — y el bloque indentado se ejecuta con ese valor. Sí: otra vez la indentación delimita qué se repite, igual que en el if."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Numerar los turnos de la mañana","code":"for turno in range(1, 6):\n    print(f\"Turno {turno}: consultorio disponible\")","result":{"columns":["CONSOLA"],"rows":[["Turno 1: consultorio disponible"],["Turno 2: consultorio disponible"],["Turno 3: consultorio disponible"],["Turno 4: consultorio disponible"],["Turno 5: consultorio disponible"]],"note":"Una sola línea de print, cinco líneas de salida: la variable turno fue tomando 1, 2, 3, 4, 5."},"caption":"El f-string dentro del bucle usa el valor de ESTA vuelta. Cambia range(1, 6) por range(1, 51) y tienes los 50 turnos del día."}$j$),
  (3, 'texto', $j${"title":"Las dos reglas de range","body":"range tiene dos reglas que son las de casi todo Python, apréndelas una vez y te sirven para siempre. Primera: si le das UN número — range(5) — EMPIEZA EN 0: genera 0, 1, 2, 3, 4. Segunda: el tope NO SE INCLUYE — por eso range(5) termina en 4, y range(1, 6) va del 1 (incluido) al 6 (excluido): 1..5. La convención se llama 'inicio incluido, final excluido' y la reencontrarás en el módulo 4 con las secuencias que vienen. ¿Por qué empezar en 0? Porque en programación las posiciones se cuentan desde 0 — lo verás con tus propios ojos en la próxima lección, con las cadenas."}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué valores genera range(5)?","options":["1, 2, 3, 4, 5","0, 1, 2, 3, 4","0, 1, 2, 3, 4, 5","5, 4, 3, 2, 1"],"correctIndex":1,"feedback":{"correct":"Correcto. Empieza en 0 y el tope (5) no se incluye: cinco valores.","incorrect":"Con un solo número, range empieza en 0 y NO incluye el final: range(5) es 0, 1, 2, 3, 4."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"En for turno in range(1, 6):, ¿qué contiene la variable turno en cada vuelta?","options":["La secuencia completa","El siguiente valor de la secuencia: 1 en la primera vuelta, 2 en la segunda…","Siempre el 1","Cuántas vueltas faltan"],"correctIndex":1,"feedback":{"correct":"Correcto. La variable del bucle toma un valor por vuelta, en orden: esa es la esencia del for.","incorrect":"La variable del bucle toma UN valor por vuelta, en orden: 1, luego 2, luego 3… El bloque se ejecuta una vez con cada uno."}}$j$),
  (6, 'resumen', $j${"title":"Resumen — for y range","points":["for recorre una secuencia elemento a elemento; su bloque indentado se repite una vez por cada uno.","La variable del bucle toma el siguiente valor en cada vuelta.","range(5) = 0..4: con un solo número, empieza en 0.","El tope nunca se incluye: range(1, 6) = 1..5.","'Inicio incluido, final excluido' es LA convención de Python: vuelve en el módulo 4."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm03-l01-for-y-range';

-- ═════════════════════════════════════════════════════════════════════
-- L02 · Cadenas: tu primera secuencia (ajuste aprobado: iterar sin listas)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Un texto es una secuencia","body":"Sorpresa: ya conocías una secuencia sin saberlo. Una CADENA (str) es una secuencia de caracteres — letras, espacios y símbolos, cada uno en su posición. Eso significa que el for también la recorre: for letra in nombre: visita el texto carácter por carácter, incluido cada espacio. Dos herramientas la acompañan: len(texto) te dice cuántos caracteres tiene (el espacio cuenta), y el operador in pregunta si algo está dentro — \"a\" in \"Ana\" es True. Ese in es un comparador más: produce un bool y puedes usarlo en un if, como cualquier condición del módulo 2."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Deletreando al paciente","code":"nombre = \"Ana\"\n\nprint(f\"El nombre tiene {len(nombre)} letras:\")\nfor letra in nombre:\n    print(letra)\n\nprint(f\"¿Lleva la letra n?: {\"n\" in nombre}\")","result":{"columns":["CONSOLA"],"rows":[["El nombre tiene 3 letras:"],["A"],["n"],["a"],["¿Lleva la letra n?: True"]],"note":"El for visitó A, luego n, luego a — una vuelta por carácter. Y el operador in encontró la n."},"caption":"len() mide, for recorre, in pregunta. Con esas tres herramientas una cadena deja de ser una caja negra."}$j$),
  (3, 'texto', $j${"title":"Mini-reto: el contador de vocales","body":"Tu turno: el nombre completo de la paciente llega en la variable nombre = \"Ana Torres\". Recorre la cadena con un for e imprime SOLO las vocales que encuentres (pista: una letra es vocal si letra in \"aeiou\" — y para no pelearte con la A mayúscula, pregunta también por \"AEIOU\", con un or). Resuélvelo antes de mirar la solución del siguiente bloque."}$j$),
  (4, 'ejemplo_codigo', $j${"title":"Solución propuesta — inténtala antes de mirar","code":"nombre = \"Ana Torres\"\n\nfor letra in nombre:\n    if letra in \"aeiou\" or letra in \"AEIOU\":\n        print(letra)","result":{"columns":["CONSOLA"],"rows":[["A"],["a"],["o"],["e"]],"note":"El for visitó los 10 caracteres (el espacio incluido) y el if dejó pasar solo las vocales: A, a, o, e."},"caption":"Un for con un if dentro: recorrer y filtrar. Ese dúo es el corazón de medio análisis de datos."}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué devuelve len(\"Ana Torres\")?","options":["9, porque el espacio no cuenta","10: el espacio también es un carácter de la secuencia","2, porque son dos palabras","Un error"],"correctIndex":1,"feedback":{"correct":"Correcto. len cuenta TODOS los caracteres, espacio incluido: 3 + 1 + 6 = 10.","incorrect":"Una cadena es una secuencia de caracteres y el espacio ES un carácter: len(\"Ana Torres\") = 10."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿qué hace el operador in en la expresión \"n\" in nombre?","options":["Asigna la letra n a nombre","Pregunta si \"n\" está dentro de la cadena y devuelve un bool (True/False)","Cuenta cuántas n hay","Borra la n"],"correctIndex":1,"feedback":{"correct":"Correcto. in es un operador de PERTENENCIA: produce True o False, listo para usarse en un if.","incorrect":"in pregunta por pertenencia — ¿está esto dentro de aquello? — y devuelve un bool, como cualquier comparador."}}$j$),
  (7, 'resumen', $j${"title":"Resumen — Cadenas como secuencias","points":["Una cadena (str) es una secuencia de caracteres: letras, espacios y símbolos, cada uno en su posición.","for letra in texto: la recorre carácter por carácter.","len(texto) cuenta TODOS los caracteres — el espacio incluido.","El operador in pregunta por pertenencia y devuelve un bool: \"a\" in \"Ana\" → True.","for + if = recorrer y filtrar: el dúo que reaparecerá en todo el curso."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm03-l02-cadenas-secuencias';

-- ═════════════════════════════════════════════════════════════════════
-- L03 · while: repetir mientras
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"Cuando no sabes cuántas veces","body":"El for brilla cuando sabes QUÉ recorrer. Pero 'sigue registrando temperaturas HASTA que la enfermera escriba fin' no tiene secuencia que recorrer ni número fijo de vueltas. Para eso existe while: repite su bloque MIENTRAS la condición sea verdadera, y la evalúa ANTES de cada vuelta. Esto trae el peligro más famoso de la programación: si nada dentro del bucle cambia la condición, esta nunca se vuelve falsa y el programa repite PARA SIEMPRE — el BUCLE INFINITO. La regla profesional: todo while debe contener algo que lo acerque a su final (leer un dato nuevo, cambiar un contador). Si alguna vez tu práctica avisa que el código no terminó, ya sabes exactamente qué buscar."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"Registrar temperaturas hasta escribir fin","code":"respuesta = input(\"Temperatura (o fin para terminar): \")\n\nwhile respuesta != \"fin\":\n    temperatura = float(respuesta)\n    if temperatura >= 38:\n        print(\"→ revisar paciente\")\n    respuesta = input(\"Temperatura (o fin para terminar): \")\n\nprint(\"Registro cerrado\")","result":{"columns":["CONSOLA"],"rows":[["Temperatura (o fin para terminar): 37.2"],["Temperatura (o fin para terminar): 38.5"],["→ revisar paciente"],["Temperatura (o fin para terminar): fin"],["Registro cerrado"]],"note":"La última línea del bloque pide un dato nuevo: eso es lo que puede volver falsa la condición. Sin ella, bucle infinito."},"caption":"while repite mientras respuesta no sea fin. El programa no sabe cuántos pacientes vendrán — y no le hace falta."}$j$),
  (3, 'texto', $j${"title":"Mini-reto: la cuenta regresiva","body":"Tu turno: el consultorio abre en 5 segundos. Escribe una cuenta regresiva con while: una variable segundos que empiece en 5, imprima su valor en cada vuelta (5, 4, 3, 2, 1) y al final, fuera del bucle, imprima ¡Consultorio abierto!. Pista: la condición es segundos > 0, y dentro del bucle algo tiene que ACERCARTE al final — resta uno con segundos = segundos - 1. Resuélvelo antes de mirar la solución."}$j$),
  (4, 'ejemplo_codigo', $j${"title":"Solución propuesta — inténtala antes de mirar","code":"segundos = 5\n\nwhile segundos > 0:\n    print(segundos)\n    segundos = segundos - 1\n\nprint(\"¡Consultorio abierto!\")","result":{"columns":["CONSOLA"],"rows":[["5"],["4"],["3"],["2"],["1"],["¡Consultorio abierto!"]],"note":"Cuando segundos llega a 0, la condición segundos > 0 se vuelve falsa y el bucle termina. La resta era la salida."},"caption":"Acabas de ACTUALIZAR una variable dentro de un bucle (segundos = segundos - 1). La próxima lección convierte ese gesto en el patrón más importante del análisis de datos."}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué causa un bucle infinito en un while?","options":["Usar números muy grandes","Que nada dentro del bucle cambie la condición: nunca se vuelve falsa","Escribir while en mayúsculas","Tener más de 100 vueltas"],"correctIndex":1,"feedback":{"correct":"Correcto. Todo while necesita algo dentro que lo acerque al final: otro dato, un contador que cambia.","incorrect":"El bucle infinito nace cuando la condición nunca cambia: nada dentro del bloque la vuelve falsa."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, ¿cuándo evalúa el while su condición?","options":["Una sola vez, al principio","ANTES de cada vuelta: si es falsa, el bucle termina ahí","Después de cada vuelta","Solo cuando hay un input"],"correctIndex":1,"feedback":{"correct":"Correcto. Antes de CADA vuelta: por eso un while puede ejecutarse cero veces si la condición nace falsa.","incorrect":"La condición se evalúa antes de cada vuelta — incluso antes de la primera: un while puede no ejecutarse nunca."}}$j$),
  (7, 'resumen', $j${"title":"Resumen — while","points":["while repite su bloque mientras la condición sea verdadera.","La condición se evalúa ANTES de cada vuelta: un while puede ejecutarse cero veces.","Todo while debe contener algo que lo acerque a su final — o será un bucle infinito.","El patrón 'leer hasta fin': pedir el dato antes del bucle y volver a pedirlo al final del bloque.","Actualizar una variable dentro del bucle (segundos = segundos - 1) es la semilla de los acumuladores."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm03-l03-while';

-- ═════════════════════════════════════════════════════════════════════
-- L04 · Acumuladores: contar y sumar
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"El patrón acumulador","body":"Aquí llega el patrón MÁS usado del análisis de datos: el ACUMULADOR. Quieres el total cobrado en el día, o cuántos pacientes tuvieron fiebre. La receta tiene tres pasos: (1) ANTES del bucle, crea la variable en su valor inicial — total = 0, fiebres = 0; (2) DENTRO del bucle, actualízala — total = total + costo para SUMAR, o fiebres = fiebres + 1 dentro de un if para CONTAR los casos que cumplen algo; (3) DESPUÉS del bucle, usa el resultado. El error clásico es inicializar dentro del bucle: cada vuelta la regresa a 0 y no acumula nada. Guarda este patrón con cariño: cuando llegues al análisis de datos de verdad, estará debajo de cada total, cada conteo y cada promedio que calcules."}$j$),
  (2, 'ejemplo_codigo', $j${"title":"La caja del día: sumar y contar a la vez","code":"total = 0\ncitas = 0\n\nrespuesta = input(\"Costo de la cita (o fin): \")\nwhile respuesta != \"fin\":\n    costo = float(respuesta)\n    total = total + costo   # acumulador que SUMA\n    citas = citas + 1       # acumulador que CUENTA\n    respuesta = input(\"Costo de la cita (o fin): \")\n\nprint(f\"Citas del día: {citas}\")\nprint(f\"Total cobrado: {total:.2f}\")","result":{"columns":["CONSOLA"],"rows":[["Costo de la cita (o fin): 850"],["Costo de la cita (o fin): 600"],["Costo de la cita (o fin): 700"],["Costo de la cita (o fin): fin"],["Citas del día: 3"],["Total cobrado: 2150.00"]],"note":"Dos acumuladores trabajando juntos en el mismo bucle: total guarda la suma, citas lleva la cuenta."},"caption":"Nacieron ANTES del bucle (en 0), crecieron DENTRO, se usaron DESPUÉS. Esa es la receta completa."}$j$),
  (3, 'texto', $j${"title":"Mini-reto: el promedio del triaje","body":"Tu turno: la enfermera toma 3 temperaturas. Pídelas con input dentro de un for turno in range(3): (conviértelas a float), acumúlalas en una variable suma, y al final calcula e imprime el promedio con un decimal (el formato :.1f del módulo 1). Pista: el promedio es la suma dividida entre 3 — o mejor, entre range… no: entre 3, que es lo que sabes con certeza. Resuélvelo antes de mirar la solución."}$j$),
  (4, 'ejemplo_codigo', $j${"title":"Solución propuesta — inténtala antes de mirar","code":"suma = 0\n\nfor turno in range(3):\n    temperatura = float(input(\"Temperatura: \"))\n    suma = suma + temperatura\n\npromedio = suma / 3\nprint(f\"Promedio del triaje: {promedio:.1f} °C\")","result":{"columns":["CONSOLA"],"rows":[["Temperatura: 36.5"],["Temperatura: 38.2"],["Temperatura: 37.4"],["Promedio del triaje: 37.4 °C"]],"note":"El for repitió 3 veces la pareja pedir-acumular; el promedio se calculó DESPUÉS del bucle, cuando la suma ya estaba completa."},"caption":"for para repetir un número conocido de veces + acumulador para sumar: la combinación de las dos lecciones anteriores."}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"Para sumar costos con total = total + costo dentro de un bucle, ¿dónde debe inicializarse total = 0?","options":["Dentro del bucle, para que esté fresco en cada vuelta","ANTES del bucle: si va dentro, cada vuelta lo regresa a 0 y no acumula nada","Después del bucle","No hace falta inicializarlo"],"correctIndex":1,"feedback":{"correct":"Correcto. El acumulador nace antes del bucle; dentro solo se actualiza.","incorrect":"Si total = 0 va dentro del bucle, cada vuelta lo borra: al final tendrías solo el último valor."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos del patrón acumulador: ¿cuál es la diferencia entre contador = contador + 1 y total = total + costo?","options":["Ninguna, hacen lo mismo","El primero CUENTA casos (suma 1 por vez, normalmente dentro de un if); el segundo SUMA valores (acumula cantidades)","El primero es más rápido","El segundo solo funciona con dinero"],"correctIndex":1,"feedback":{"correct":"Correcto. Contar (¿cuántos?) y sumar (¿cuánto?): los dos gestos con los que se responde casi cualquier pregunta de negocio.","incorrect":"Contar suma 1 por cada caso que cumple algo (¿cuántos?); sumar acumula el valor de cada caso (¿cuánto?)."}}$j$),
  (7, 'resumen', $j${"title":"Resumen — Acumuladores","points":["Patrón acumulador: inicializa ANTES del bucle, actualiza DENTRO, usa DESPUÉS.","total = total + x SUMA valores; contador = contador + 1 (dentro de un if) CUENTA casos.","Inicializar dentro del bucle es el error clásico: cada vuelta borra lo acumulado.","El promedio se calcula después del bucle: suma / cantidad.","Funciona igual con for (vueltas conocidas) y con while (hasta que algo ocurra)."]}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm03-l04-acumuladores';

-- ═════════════════════════════════════════════════════════════════════
-- L05 · Práctica: el clasificador del turno (while + entradas del motor)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'ejercicio', $j${"scenario":"El turno de la mañana necesita su clasificador: el programa lee temperaturas hasta que se escribe fin, clasifica cada una con la escalera del triage y, al cerrar, informa cuántas urgencias hubo. La consola alimentará tu programa con un turno de prueba: 38.2, 39.5, 35.1 y fin.","instructions":["Cambia el False del while por la condición correcta: seguir mientras respuesta sea distinta de \"fin\".","Dentro del bucle, completa la escalera: >= 39 → \"URGENTE\" (y suma 1 a urgencias) · >= 38 → \"Fiebre\" · < 36 → \"Hipotermia\" · resto → \"Normal\".","No toques las líneas de input ni los print: ya están listos.","EJECUTA para ver el turno completo; COMPRUEBA cuando el conteo de urgencias salga bien."],"initialCode":"# Clasificador de signos vitales del turno\nurgencias = 0\nrespuesta = input(\"Temperatura (o fin): \")\n\nwhile False:  # TODO: la condición correcta\n    temperatura = float(respuesta)\n    # TODO: la escalera del triage\n    #   >= 39 URGENTE (suma 1 a urgencias) · >= 38 Fiebre\n    #   < 36 Hipotermia · resto Normal\n    print(f\"{temperatura} °C → {categoria}\")\n    respuesta = input(\"Temperatura (o fin): \")\n\nprint(f\"Urgencias del turno: {urgencias}\")","validators":["while\\s+respuesta\\s*!=\\s*[\"']fin[\"']","if\\s+temperatura\\s*>=\\s*39","elif\\s+temperatura\\s*>=\\s*38","elif\\s+temperatura\\s*<\\s*36","else\\s*:","urgencias\\s*(=\\s*urgencias\\s*\\+\\s*1|\\+=\\s*1)"],"entradas":["38.2","39.5","35.1","fin"],"salidaEsperada":["Temperatura (o fin): 38.2 °C → Fiebre","Temperatura (o fin): 39.5 °C → URGENTE","Temperatura (o fin): 35.1 °C → Hipotermia","Temperatura (o fin): Urgencias del turno: 1"],"mockOutput":{"columns":["CONSOLA"],"rows":[["Temperatura (o fin): 38.2 °C → Fiebre"],["Temperatura (o fin): 39.5 °C → URGENTE"],["Temperatura (o fin): 35.1 °C → Hipotermia"],["Temperatura (o fin): Urgencias del turno: 1"]],"note":"El turno de prueba: tres pacientes clasificados y una urgencia contada."},"hints":["La condición del while: respuesta != \"fin\" — seguir mientras no hayan escrito fin.","La escalera es la del módulo 2: if temperatura >= 39, elif >= 38, elif < 36, else. Cada rama asigna su categoria.","El conteo va dentro de la rama URGENTE: urgencias = urgencias + 1 (inicializada arriba, actualizada dentro — el patrón acumulador)."],"successMessage":"Clasificador operativo: while para un turno de longitud desconocida, la escalera decidiendo y un acumulador contando urgencias. Todo el módulo en un solo programa tuyo.","failMessage":"Revisa: while respuesta != \"fin\", la escalera completa (URGENTE/Fiebre/Hipotermia/Normal) y urgencias sumando 1 solo en la rama URGENTE."}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm03-l05-practica-clasificador';

-- ═════════════════════════════════════════════════════════════════════
-- X01 · Examen de región (jefe del módulo)
-- ═════════════════════════════════════════════════════════════════════
insert into public.content_blocks (lesson_id, sort_order, kind, payload)
select l.id, v.ord, v.kind, v.payload::jsonb
from public.lessons l
join public.modules m on m.id = l.module_id
join public.courses c on c.id = m.course_id,
(values
  (1, 'texto', $j${"title":"La tercera región","body":"Byte llegó a la región de los bucles: diez preguntas guardan el paso. Todo lo viviste: el for y range, las cadenas letra a letra, el while con su salida asegurada y los acumuladores que cuentan y suman. Las preguntas que falles volverán al final hasta que las domines. Adelante."}$j$),
  (2, 'quiz', $j${"variant":"multiple_choice","prompt":"range(1, 6) genera:","options":["1, 2, 3, 4, 5, 6","1, 2, 3, 4, 5: el inicio se incluye, el tope no","0, 1, 2, 3, 4, 5","6, 5, 4, 3, 2, 1"],"correctIndex":1,"feedback":{"correct":"Correcto. Inicio incluido, final excluido: la convención de Python.","incorrect":"El tope no se incluye: range(1, 6) es 1..5. 'Inicio incluido, final excluido', siempre."}}$j$),
  (3, 'quiz', $j${"variant":"multiple_choice","prompt":"En for letra in \"Ana\":, la variable letra…","options":["Contiene \"Ana\" completa las tres veces","Toma un carácter por vuelta: primero \"A\", luego \"n\", luego \"a\"","Toma solo las vocales","Es un número de posición"],"correctIndex":1,"feedback":{"correct":"Correcto. Una cadena es una secuencia: el for la visita carácter por carácter.","incorrect":"La variable del bucle toma UN elemento por vuelta — y en una cadena, los elementos son sus caracteres."}}$j$),
  (4, 'quiz', $j${"variant":"multiple_choice","prompt":"¿Qué devuelve la expresión \"o\" in \"Torres\"?","options":["1","True: el operador in pregunta por pertenencia y devuelve un bool","\"o\"","La posición de la o"],"correctIndex":1,"feedback":{"correct":"Correcto. in es el operador de pertenencia: ¿está \"o\" dentro de \"Torres\"? True.","incorrect":"in no cuenta ni ubica: solo pregunta si está dentro, y responde con un bool — aquí, True."}}$j$),
  (5, 'quiz', $j${"variant":"multiple_choice","prompt":"len(\"Luis Vega\") devuelve:","options":["8, porque el espacio no cuenta","9: len cuenta TODOS los caracteres y el espacio es uno más","2 palabras","Un error"],"correctIndex":1,"feedback":{"correct":"Correcto. 4 + 1 + 4 = 9: el espacio es un carácter de pleno derecho.","incorrect":"len cuenta cada carácter de la secuencia, espacio incluido: \"Luis Vega\" tiene 9."}}$j$),
  (6, 'quiz', $j${"variant":"multiple_choice","prompt":"Un while se vuelve infinito cuando:","options":["Tiene más de mil vueltas","Nada en su bloque cambia la condición, que nunca se vuelve falsa","Usa números decimales","Está dentro de otro bucle"],"correctIndex":1,"feedback":{"correct":"Correcto. Todo while necesita algo que lo acerque al final: otro dato, un contador que cambia.","incorrect":"Si la condición nunca cambia, nunca se vuelve falsa: el bucle no termina jamás."}}$j$),
  (7, 'quiz', $j${"variant":"multiple_choice","prompt":"segundos = 3, y el bucle: while segundos > 0: print(segundos); segundos = segundos - 1. ¿Qué imprime?","options":["3, 2, 1","3, 2, 1, 0","1, 2, 3","Nada"],"correctIndex":0,"feedback":{"correct":"Correcto. Con segundos = 0 la condición ya es falsa: el 0 no se imprime.","incorrect":"Traza la ejecución: imprime 3 (queda 2), imprime 2 (queda 1), imprime 1 (queda 0) — y 0 > 0 es falso: fin."}}$j$),
  (8, 'quiz', $j${"variant":"multiple_choice","prompt":"En términos técnicos, la condición de un while se evalúa:","options":["Una vez al principio y nunca más","ANTES de cada vuelta — por eso un while puede ejecutarse cero veces","Después de cada vuelta","Al azar"],"correctIndex":1,"feedback":{"correct":"Correcto. Si la condición nace falsa, el bloque no se ejecuta ni una vez.","incorrect":"Antes de CADA vuelta, incluida la primera: un while con condición falsa de entrada se salta entero."}}$j$),
  (9, 'quiz', $j${"variant":"multiple_choice","prompt":"Quieres contar cuántas temperaturas de un turno son fiebre (>= 38). El patrón correcto es:","options":["fiebres = 0 dentro del bucle, y sumar siempre","fiebres = 0 ANTES del bucle, y fiebres = fiebres + 1 DENTRO, dentro de un if temperatura >= 38","fiebres = fiebres + 1 antes del bucle","Contar a mano al final"],"correctIndex":1,"feedback":{"correct":"Correcto. Nace antes, crece dentro (solo cuando el if lo permite), se usa después.","incorrect":"El acumulador se inicializa ANTES del bucle y se actualiza DENTRO — y para contar solo los casos que cumplen, la suma va dentro del if."}}$j$),
  (10, 'quiz', $j${"variant":"multiple_choice","prompt":"En el patrón acumulador, ¿qué responde cada gesto: contador = contador + 1 y total = total + valor?","options":["Ambos responden lo mismo","El contador responde ¿CUÁNTOS? (casos) y el total responde ¿CUÁNTO? (cantidad acumulada)","El contador es para textos","El total solo sirve con dinero"],"correctIndex":1,"feedback":{"correct":"Correcto. Contar y sumar: con esos dos gestos se responde casi cualquier pregunta sobre un conjunto de datos.","incorrect":"Contar (+1 por caso) responde ¿cuántos?; sumar (+valor) responde ¿cuánto? Dos preguntas distintas, dos acumuladores."}}$j$),
  (11, 'quiz', $j${"variant":"multiple_choice","prompt":"Pregunta final de entrevista: '¿cuándo usas for y cuándo while?' Tu respuesta senior:","options":["Son intercambiables, uso el que recuerde","for para recorrer algo conocido (una secuencia o un número fijo de vueltas); while para repetir hasta que una condición cambie, cuando no sé cuántas veces — cuidando siempre que el bucle pueda terminar","while siempre, porque es más flexible","for solo para números"],"correctIndex":1,"feedback":{"correct":"Impecable. for = secuencia o cuenta conocida; while = 'hasta que pase algo', con su salida asegurada.","incorrect":"La respuesta senior distingue el caso: for cuando sabes qué recorres; while cuando repites hasta que algo ocurra — y todo while con algo dentro que lo acerque a su final."}}$j$)
) as v(ord, kind, payload)
where c.slug = 'python-desde-cero' and l.slug = 'm03-x01-examen';
