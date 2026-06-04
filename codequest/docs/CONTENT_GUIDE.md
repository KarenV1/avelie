# CodeQuest - Content Guide 📝

Guía paso a paso para crear nuevos cursos, unidades, bloques y prácticas guiadas.

---

## 📚 Estructura General de Contenido

```
src/data/courses/
├── index.js              # Registro central (agregar imports aquí)
├── sql-basico.json       # Curso 1
├── java-basico.json      # Curso 2 (futuro)
├── python-basico.json    # Curso 3 (futuro)
└── ...
```

---

## 🎓 Paso 1: Crear un Nuevo Curso

### 1.1 Estructura Base del JSON

```json
{
  "id": "sql-basico",
  "title": "SQL Básico",
  "subtitle": "Consulta bases de datos relacionales",
  "description": "Aprende a leer y filtrar datos con SELECT, WHERE, ORDER BY, agregaciones y GROUP BY.",
  "icon": "🗄️",
  "accent": "teal",
  "language": "sql",
  "units": [
    {
      "id": "u1",
      "title": "Fundamentos de consultas",
      "summary": "Lo esencial para pedir y filtrar datos.",
      "items": [
        { /* bloques y prácticas aquí */ }
      ]
    }
  ]
}
```

### 1.2 Campos Obligatorios

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | string | ID único del curso (snake_case) | `"sql-basico"` |
| `title` | string | Nombre del curso | `"SQL Básico"` |
| `subtitle` | string | Frase corta (1 línea) | `"Consulta bases de datos"` |
| `description` | string | Descripción larga (2-3 líneas) | `"Aprende a leer y filtrar..."` |
| `icon` | string | Emoji representativo | `"🗄️"` |
| `accent` | string | Color (CSS): teal, indigo, emerald, rose, etc. | `"teal"` |
| `language` | string | Lenguaje: sql, java, python, javascript, etc. | `"sql"` |
| `units` | array | Array de unidades | `[{...}, {...}]` |

### 1.3 Plantilla HTML

```json
{
  "id": "java-basico",
  "title": "Java Básico",
  "subtitle": "Fundamentos de programación orientada a objetos",
  "description": "Aprende variables, clases, métodos, herencia y polimorfismo en Java.",
  "icon": "☕",
  "accent": "amber",
  "language": "java",
  "units": [
    {
      "id": "u1",
      "title": "Sintaxis y tipos de datos",
      "summary": "Lo primero que necesitas saber.",
      "items": []
    }
  ]
}
```

---

## 📖 Paso 2: Crear una Unidad (12 Bloques + 2 Prácticas)

### 2.1 Estructura de Unidad

```json
{
  "id": "u1",
  "title": "Fundamentos de consultas",
  "summary": "Lo esencial para pedir y filtrar datos.",
  "items": [
    // Bloques 1-6
    { "type": "block", "id": "b1", ... },
    { "type": "block", "id": "b2", ... },
    // ... b3 - b5 ...
    { "type": "block", "id": "b6", ... },
    
    // Práctica 1 (checkpoint)
    { "type": "practice", "id": "p1", ... },
    
    // Bloques 7-12
    { "type": "block", "id": "b7", ... },
    // ... b8 - b11 ...
    { "type": "block", "id": "b12", ... },
    
    // Práctica 2 (final boss)
    { "type": "practice", "id": "p2", ... }
  ]
}
```

### 2.2 Convenciones de IDs

- **Bloques**: `b1`, `b2`, ..., `b12`
- **Prácticas**: `p1`, `p2` (siempre 2, después de b6 y b12)
- **Unidades**: `u1`, `u2`, ... (escalable para múltiples unidades)

---

## 🧱 Paso 3: Crear Bloques de Aprendizaje

### 3.1 Estructura de Bloque

```json
{
  "type": "block",
  "id": "b1",
  "title": "¿Qué es SQL?",
  "explanation": "SQL (Structured Query Language) es el lenguaje estándar para hablar con bases de datos relacionales. Con él pides datos, los filtras y los modificas escribiendo instrucciones llamadas consultas (queries).",
  
  "example": {
    "code": "-- Una consulta pide información a la base de datos\nSELECT * FROM usuarios;",
    "caption": "Esta consulta pide todos los datos de la tabla usuarios."
  },
  
  "question": {
    "prompt": "¿Para qué sirve principalmente SQL?",
    "options": [
      "Diseñar interfaces gráficas",
      "Comunicarse con bases de datos relacionales",
      "Editar imágenes",
      "Compilar programas en Java"
    ],
    "correctIndex": 1
  }
}
```

### 3.2 Campos Obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | "block" | Tipo de item |
| `id` | string | ID único (b1, b2, ...) |
| `title` | string | Título del bloque |
| `explanation` | string | Teoría (1-3 párrafos) |
| `example.code` | string | Código de ejemplo |
| `example.caption` | string | Descripción del ejemplo |
| `question.prompt` | string | Enunciado de la pregunta |
| `question.options` | array | 4 opciones de respuesta |
| `question.correctIndex` | number | Índice de respuesta correcta (0-3) |

### 3.3 Ejemplo Completo: SQL

```json
{
  "type": "block",
  "id": "b2",
  "title": "SELECT: Pedir datos",
  "explanation": "La consulta SELECT es la más básica. Pide datos a una tabla.\n\nSintaxis: SELECT columnas FROM tabla;\n\nCon * pides todas las columnas.",
  
  "example": {
    "code": "SELECT nombre, email FROM usuarios;\n\n-- Resultado:\n-- | nombre | email |\n-- | Ana    | ana@... |\n-- | Bob    | bob@... |",
    "caption": "SELECT pide columnas específicas (nombre, email) de la tabla usuarios."
  },
  
  "question": {
    "prompt": "¿Cuál es la diferencia entre SELECT * y SELECT nombre?",
    "options": [
      "SELECT * es más lento",
      "SELECT * pide todas las columnas, SELECT nombre solo esa columna",
      "SELECT nombre no existe",
      "No hay diferencia, es lo mismo"
    ],
    "correctIndex": 1
  }
}
```

### 3.4 Ejemplo Completo: Java

```json
{
  "type": "block",
  "id": "b1",
  "title": "Variables y tipos de datos",
  "explanation": "Una variable es un contenedor para datos. Java es tipado: cada variable tiene un tipo (int, String, boolean, etc.)\n\nDeclara variables así:\nint edad = 25;\nString nombre = \"Ana\";",
  
  "example": {
    "code": "int x = 10;\nString mensaje = \"Hola\";\nboolean activo = true;\n\nSystem.out.println(x);        // 10\nSystem.out.println(mensaje);   // Hola\nSystem.out.println(activo);    // true",
    "caption": "Las variables guardan datos de diferente tipo."
  },
  
  "question": {
    "prompt": "¿Cuál es el tipo correcto para guardar el texto 'Hola Mundo'?",
    "options": [
      "int",
      "double",
      "String",
      "boolean"
    ],
    "correctIndex": 2
  }
}
```

### 3.5 Guía de Redacción para Bloques

✅ **Hacer**
- Explicaciones cortas (máx 200 palabras)
- Ejemplos simples y directos
- Preguntas con 1 respuesta correcta clara
- Lenguaje accesible para principiantes

❌ **No hacer**
- Explicaciones largas / textbook heavy
- Ejemplos con código complejo
- Preguntas ambiguas
- Jerga sin explicar

---

## 🎯 Paso 4: Crear Prácticas Guiadas

### 4.1 Estructura de Práctica

```json
{
  "type": "practice",
  "id": "p1",
  "title": "Tu primera consulta SELECT",
  "difficulty": "fácil",
  
  "instructions": "En la tabla 'usuarios' hay columnas: id, nombre, email.\n\n1. Escribe una consulta SELECT que pida todas las columnas.\n2. Ejecuta el código (botón 'Ejecutar').\n3. Valida que la salida sea correcta (botón 'Validar').",
  
  "initialCode": "-- Escribe tu consulta aquí\nSELECT ...",
  
  "tests": [
    {
      "description": "Debe usar SELECT",
      "validator": "code.includes('SELECT')",
      "hint": "Usa la palabra clave SELECT"
    },
    {
      "description": "Debe seleccionar de usuarios",
      "validator": "code.includes('usuarios')",
      "hint": "Usa FROM usuarios"
    },
    {
      "description": "El resultado debe tener 2 filas",
      "validator": "output.split('\\n').length >= 2",
      "hint": "Ejecuta el código para ver el output"
    }
  ],
  
  "hints": [
    "Usa SELECT * FROM usuarios;",
    "El * significa 'todas las columnas'",
    "La consulta debe terminar con ;"
  ]
}
```

### 4.2 Campos Obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `type` | "practice" | Tipo de item |
| `id` | string | Siempre `p1` o `p2` |
| `title` | string | Nombre de la práctica |
| `difficulty` | string | "fácil", "media", "difícil" |
| `instructions` | string | Enunciado detallado |
| `initialCode` | string | Código inicial en editor |
| `tests` | array | Tests de validación |
| `hints` | array | Pistas (3-5 máximo) |

### 4.3 Tests: Estructura Detallada

```json
{
  "description": "Descripción del test (se muestra al usuario)",
  "validator": "código JavaScript que devuelve true/false",
  "hint": "Pista si el test falla"
}
```

**Variables disponibles en `validator`**:
- `code` - Código que escribió el usuario (string)
- `output` - Output del código ejecutado (string)

**Ejemplos de validators**:
```javascript
// Básico: buscar texto
code.includes('SELECT')

// Contar líneas
code.split('\n').length > 2

// Contar palabras
code.match(/SELECT/gi).length === 1

// Validar output
output === "Ana, Bob, Charlie"

// Múltiples condiciones
code.includes('WHERE') && output.includes('active')
```

### 4.4 Ejemplo Completo: Práctica SQL

```json
{
  "type": "practice",
  "id": "p1",
  "title": "SELECT WHERE: Filtrar datos",
  "difficulty": "fácil",
  
  "instructions": "Escribe una consulta que:\n1. Pida todas las columnas de 'usuarios'\n2. Pero solo las filas donde edad > 18\n\nUsa la cláusula WHERE.",
  
  "initialCode": "-- Pide solo usuarios mayores de 18\nSELECT * FROM usuarios\nWHERE ",
  
  "tests": [
    {
      "description": "Debe incluir WHERE",
      "validator": "code.includes('WHERE')",
      "hint": "Usa: WHERE edad > 18"
    },
    {
      "description": "Debe comparar edad con 18",
      "validator": "code.includes('18')",
      "hint": "WHERE edad > 18"
    },
    {
      "description": "Output debe tener 2 usuarios",
      "validator": "output.split('\\n').length === 3",
      "hint": "Ejecuta para ver cuántas filas devuelve"
    }
  ],
  
  "hints": [
    "WHERE filtra filas",
    "Sintaxis: WHERE columna > valor",
    "WHERE edad > 18 devolverá solo usuarios mayores de 18"
  ]
}
```

### 4.5 Ejemplo Completo: Práctica Java

```json
{
  "type": "practice",
  "id": "p1",
  "title": "Crear variables y imprimir",
  "difficulty": "fácil",
  
  "instructions": "Escribe un programa Java que:\n1. Declara una variable int llamada 'edad' con valor 25\n2. Declara una variable String llamada 'nombre' con valor 'Ana'\n3. Imprime ambas usando System.out.println()",
  
  "initialCode": "// Declara variables\nint edad = /* tu valor */;\nString nombre = /* tu valor */;\n\n// Imprime",
  
  "tests": [
    {
      "description": "Debe declarar variable edad",
      "validator": "code.includes('edad')",
      "hint": "int edad = 25;"
    },
    {
      "description": "Debe declarar variable nombre",
      "validator": "code.includes('nombre')",
      "hint": "String nombre = \"Ana\";"
    },
    {
      "description": "Debe usar System.out.println 2 veces",
      "validator": "code.match(/System\\.out\\.println/g).length >= 2",
      "hint": "System.out.println(edad);"
    }
  ],
  
  "hints": [
    "int edad = 25;",
    "String nombre = \"Ana\";",
    "System.out.println(edad);"
  ]
}
```

---

## 🔄 Paso 5: Integrar el Nuevo Curso

### 5.1 Actualizar `src/data/courses/index.js`

```javascript
// src/data/courses/index.js
import sqlBasico from './sql-basico.json'
import javaBasico from './java-basico.json'  // <-- NUEVO

export const courses = [
  sqlBasico,
  javaBasico,  // <-- NUEVO
]

export function getCourse(courseId) {
  return courses.find((c) => c.id === courseId) || null
}

// ... resto del archivo igual ...
```

### 5.2 Listo
- No cambiar nada más
- Todas las pantallas (Home, UnitMap, BlockScreen, etc.) leerán automáticamente el nuevo curso

---

## ✅ Checklist para Nuevo Curso

- [ ] Archivo JSON creado en `src/data/courses/nombre-basico.json`
- [ ] Campo `id` sin espacios, snake_case (ej: `java-basico`)
- [ ] 1 unidad con ID `u1`
- [ ] 1 unidad contiene:
  - [ ] Exactamente 12 bloques (b1-b12)
  - [ ] Exactamente 2 prácticas (p1 después de b6, p2 después de b12)
- [ ] Cada bloque tiene:
  - [ ] `title`, `explanation`, `example.code`, `example.caption`
  - [ ] `question.prompt`, `question.options` (4 opciones), `question.correctIndex`
- [ ] Cada práctica tiene:
  - [ ] `title`, `difficulty`, `instructions`, `initialCode`
  - [ ] `tests` (array con 3+ tests)
  - [ ] `hints` (array con 3-5 pistas)
- [ ] Import agregado en `src/data/courses/index.js`
- [ ] Agregado al array `courses`
- [ ] Validar JSON (sin errores de sintaxis)
- [ ] Probar: ir a Home, debería aparecer el curso nuevo

---

## 📏 Convenciones de Redacción

### Explicaciones
```
1. Presentar concepto (qué es)
2. Justificar (por qué es útil)
3. Sintaxis o pasos (cómo se usa)
```

### Ejemplos
```
- Código conciso (máx 10 líneas)
- Comentarios en español
- Output esperado en comentario
```

### Preguntas
```
- Enunciado claro (1 línea)
- 4 opciones (1 correcta, 3 distractores)
- Distractores plausibles pero incorrectos
```

---

## 🎯 Ejemplo de Curso Completo (SQL Básico - Abreviado)

```json
{
  "id": "sql-basico",
  "title": "SQL Básico",
  "subtitle": "Consulta bases de datos",
  "description": "Aprende SELECT, WHERE, ORDER BY, JOIN, GROUP BY.",
  "icon": "🗄️",
  "accent": "teal",
  "language": "sql",
  "units": [
    {
      "id": "u1",
      "title": "Fundamentos",
      "summary": "Lo esencial.",
      "items": [
        {
          "type": "block",
          "id": "b1",
          "title": "¿Qué es SQL?",
          "explanation": "SQL es para hablar con bases de datos.",
          "example": { "code": "SELECT * FROM usuarios;", "caption": "Pide datos." },
          "question": { "prompt": "¿Para qué es SQL?", "options": ["UI", "BD", "Imagen", "Compilar"], "correctIndex": 1 }
        },
        {
          "type": "block",
          "id": "b2",
          "title": "SELECT",
          "explanation": "SELECT pide datos.",
          "example": { "code": "SELECT nombre FROM usuarios;", "caption": "Solo nombre." },
          "question": { "prompt": "¿Qué hace SELECT *?", "options": ["Una columna", "Todas", "Nada", "Error"], "correctIndex": 1 }
        },
        /* ... b3-b6 ... */
        {
          "type": "practice",
          "id": "p1",
          "title": "Práctica 1",
          "difficulty": "fácil",
          "instructions": "Escribe SELECT * FROM usuarios;",
          "initialCode": "SELECT ",
          "tests": [{ "description": "Debe tener FROM", "validator": "code.includes('FROM')", "hint": "FROM usuarios" }],
          "hints": ["SELECT * FROM usuarios;"]
        },
        /* ... b7-b12 ... */
        {
          "type": "practice",
          "id": "p2",
          "title": "Práctica 2",
          "difficulty": "media",
          "instructions": "Escribe un JOIN",
          "initialCode": "SELECT",
          "tests": [{ "description": "Debe tener JOIN", "validator": "code.includes('JOIN')", "hint": "INNER JOIN" }],
          "hints": ["INNER JOIN tabla2"]
        }
      ]
    }
  ]
}
```

---

## 🚀 Siguientes Pasos

1. **Completar SQL Básico**: 12 bloques + 2 prácticas
2. **Crear Java Básico**: Reutilizar estructura
3. **Verificar**: `npm run dev` debe mostrar ambos cursos
4. **Iterar**: Mejora contenido según feedback

---

## 📚 Más Documentación

- [**PROJECT_CONTEXT.md**](./PROJECT_CONTEXT.md) - Visión general
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Técnica
- [**ROADMAP.md**](./ROADMAP.md) - Fases futuras
- [**DECISIONS.md**](./DECISIONS.md) - Por qué estas decisiones
