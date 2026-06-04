# Prompt: Crear una Práctica Guiada

**Uso**: Pídeme este prompt para crear o refinar una práctica guiada específica.

---

## Instrucciones

Necesito que crees UNA práctica guiada (bloque `p1` o `p2` de una unidad).

### Información General
- **Curso**: [Ej: SQL Básico]
- **Unidad**: [Ej: u1 - Fundamentos]
- **ID de Práctica**: [p1 o p2]
- **Posición**: [después de bloque 6 o 12]
- **Lenguaje**: [sql, java, python, javascript]

### Contexto
**Bloques que la práctica debe cubrir**: [Ej: b1-b6 (SELECT, WHERE, ORDER BY, LIMIT, JOIN, GROUP BY)]

**Objetivo pedagógico**: [Ej: El usuario aprenderá a combinar SELECT con WHERE para filtrar datos reales]

### Ejercicio Específico

**Dificultad**: fácil / media / difícil

**Enunciado** (lo que ve el usuario):
```
[Instrucciones claras, paso a paso, máx 200 palabras]

Ejemplo de enunciado para SQL:
"En la tabla 'pedidos' hay columnas: id, cliente_id, monto, fecha.
Escribe una consulta SELECT que:
1. Pida todas las columnas
2. Filtre por monto > 100
3. Ordene por fecha descendente (más reciente primero)
Ejecuta el código para verificar el resultado."
```

**Código Inicial** (lo que aparece en el editor):
```
[Plantilla con TODO o espacios en blanco]

Ejemplo:
"SELECT 
FROM pedidos
WHERE 
ORDER BY "
```

### Tests (Validación)

Define 3-5 tests que verifiquen la solución. Cada test tiene:
- **Descripción**: Qué valida (aparece cuando falla)
- **Validador**: Lógica JavaScript (usa variables `code` y `output`)
- **Pista**: Ayuda si falla

**Variables disponibles**:
- `code` - Código que escribió el usuario (string)
- `output` - Output/resultado de ejecutar el código (string)

**Ejemplos de tests**:
```
1. Descripción: "Debe usar SELECT"
   Validador: code.includes('SELECT')
   Pista: "Usa SELECT para pedir datos"

2. Descripción: "Debe filtrar por WHERE"
   Validador: code.includes('WHERE')
   Pista: "Agrega WHERE monto > 100"

3. Descripción: "Debe ordenar descendente"
   Validador: code.includes('DESC')
   Pista: "Usa ORDER BY fecha DESC"

4. Descripción: "Output debe tener 3 filas"
   Validador: output.split('\n').length === 4  // 3 datos + header
   Pista: "Ejecuta para ver el resultado"
```

### Pistas (Hints)

Proporciona 3-5 pistas progresivas (de menos a más específica):

1. [Pista general - concepto]
2. [Pista sobre estructura]
3. [Pista más específica - cómo hacer]
4. [Pseudocódigo o parcial]
5. [Casi solución completa (opcional)]

**Ejemplo para SQL**:
```
1. "WHERE filtra filas según condiciones"
2. "Necesitas combinar SELECT ... FROM ... WHERE ..."
3. "Sintaxis: WHERE columna > valor"
4. "SELECT * FROM pedidos WHERE monto > 100 ORDER BY fecha DESC"
```

### Formato de Salida

JSON válido:
```json
{
  "type": "practice",
  "id": "p1",
  "title": "...",
  "difficulty": "...",
  "instructions": "...",
  "initialCode": "...",
  "tests": [
    { "description": "...", "validator": "...", "hint": "..." },
    ...
  ],
  "hints": [ "...", "...", "...", ... ]
}
```

### Validaciones
- Exactamente 1 práctica (JSON válido)
- 3-5 tests funcionales
- 3-5 hints progresivos
- Tests verificables (código + output)
- Dificultad coherente (fácil: 1 concepto, media: 2-3, difícil: 4+)
- Pistas ayudan sin spoilear la respuesta

---

## Ejemplo Relleno (Java - Práctica 1)

```
Curso: Java Básico
Unidad: u1 - Sintaxis y tipos
ID: p1
Posición: después bloque 6
Lenguaje: java

Bloques cubiertos: Variables, tipos, operadores, condicionales

Dificultad: fácil

Enunciado:
"Escribe un programa que:
1. Declara 3 variables: edad (int), nombre (String), activo (boolean)
2. Asigna valores: 25, 'Ana', true
3. Imprime las tres variables usando System.out.println()
4. Verifica que el output muestre los valores correctos"

Código inicial:
"int edad = ;
String nombre = ;
boolean activo = ;

System.out.println();"

Tests:
1. Descripción: "Debe declarar variable edad", Validador: "code.includes('int edad')", Pista: "int edad = 25;"
2. Descripción: "Debe declarar nombre", Validador: "code.includes('String nombre')", Pista: "String nombre = \"Ana\";"
3. Descripción: "Debe usar System.out.println 3 veces", Validador: "code.match(/println/g).length === 3", Pista: "System.out.println(edad);"
4. Descripción: "Output debe contener '25'", Validador: "output.includes('25')", Pista: "Ejecuta el programa"

Pistas:
1. "int es para números enteros, String para texto, boolean para verdadero/falso"
2. "Usa System.out.println(variable) para imprimir"
3. "int edad = 25; System.out.println(edad);"
4. "Los tres outputs deben mostrarse cuando ejecutes"
```

**Responde con el JSON completo**, listo para insertar.
