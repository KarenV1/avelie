# Prompt: Crear un Nuevo Curso

**Uso**: Pídeme este prompt cuando quieras crear un nuevo curso (Java, Python, APIs REST, etc.)

---

## Instrucciones

Necesito que crees un nuevo curso para CodeQuest. Aquí está la información:

### Información General del Curso
- **Nombre del curso**: [Ej: Java Básico]
- **ID**: [Ej: java-basico] ← snake_case, sin espacios
- **Descripción corta**: [1 línea, máx 80 caracteres]
- **Descripción larga**: [2-3 líneas, qué aprenderá el usuario]
- **Icono**: [Emoji representativo, Ej: ☕]
- **Color acento**: [teal, indigo, emerald, rose, amber, etc.]
- **Lenguaje de programación**: [Ej: java, sql, python, javascript]

### Estructura
- 1 unidad (ID: `u1`)
- 12 bloques de aprendizaje (`b1` a `b12`)
- 2 prácticas guiadas (`p1` después de `b6`, `p2` después de `b12`)

### Contenido a Incluir

**Bloques 1-6**: Fundamentos
1. ¿Qué es [lenguaje]?
2. [Concepto 1]
3. [Concepto 2]
4. [Concepto 3]
5. [Concepto 4]
6. [Concepto 5]

**Práctica 1 (p1)**: Ejercicio de conceptos 1-5

**Bloques 7-12**: Conceptos avanzados
7. [Concepto 6]
8. [Concepto 7]
9. [Concepto 8]
10. [Concepto 9]
11. [Concepto 10]
12. [Concepto avanzado / Resumen]

**Práctica 2 (p2)**: Ejercicio integrando conceptos 1-10

### Formato de Salida
Quiero que devuelvas el contenido en **JSON válido** listo para copiar en `src/data/courses/[id].json`.

Cada bloque debe incluir:
- `type`, `id`, `title`
- `explanation` (1-3 párrafos accesibles)
- `example` con `code` y `caption`
- `question` con `prompt`, `options` (4), `correctIndex`

Cada práctica debe incluir:
- `type`, `id`, `title`, `difficulty`
- `instructions` (claras y paso a paso)
- `initialCode` (código inicial para el editor)
- `tests` (3+ validaciones)
- `hints` (3-5 pistas progresivas)

### Validaciones
- JSON sintácticamente válido (sin errores de comas, comillas, etc.)
- IDs únicos: `b1` a `b12`, `p1`, `p2`
- Exactamente 4 opciones en cada pregunta
- `correctIndex` entre 0-3
- Explicaciones y ejemplos accesibles para principiantes

### Después
Una vez generado, yo:
1. Copiaré el JSON a `src/data/courses/[id].json`
2. Agregaré import en `src/data/courses/index.js`
3. Ejecutaré `npm run dev` para verificar

---

## Ejemplo de Relleno (Python Básico)

```
- Nombre del curso: Python Básico
- ID: python-basico
- Descripción corta: Aprende los fundamentos de Python
- Descripción larga: Domina variables, funciones, listas y diccionarios. Escribe tu primer programa Python.
- Icono: 🐍
- Color acento: blue
- Lenguaje: python

Bloques:
1. ¿Qué es Python?
2. Variables y tipos
3. Operadores
4. Condicionales (if/else)
5. Bucles (for/while)
6. Funciones
7. Listas
8. Diccionarios
9. Iteración
10. Manejo de errores
11. Módulos
12. Resumen y proyecto
```

**Responde con el JSON completo**, listo para usar.
