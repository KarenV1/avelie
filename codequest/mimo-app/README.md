# CodeQuest 🎮

App personal de aprendizaje gamificado de programación y bases de datos, inspirada en
**Mimo / Duolingo**. Local-first, sin backend, sin base de datos de pago. Todo el contenido
vive en archivos **JSON** y el progreso se guarda en **localStorage**.

> **Fase 1** incluye el curso **SQL Básico** con 1 unidad completa: 12 bloques + 2 prácticas
> guiadas. La arquitectura está lista para añadir Java, Python, APIs REST, Testing u Oracle.

## 🚀 Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

Otros comandos:

```bash
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve el build para revisarlo
```

## 🧱 Stack

- **React + Vite** (JavaScript)
- **CSS puro** con variables (tema oscuro)
- **react-router-dom** para la navegación
- Sin backend · sin login · sin pagos · sin base de datos

## 📂 Estructura de carpetas

```
codequest/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                  # punto de entrada (Router + Provider)
    ├── App.jsx                   # definición de rutas
    ├── index.css                 # tokens de diseño + estilos base (tema oscuro)
    ├── context/
    │   └── ProgressContext.jsx   # estado global: XP, racha, completados
    ├── utils/
    │   └── storage.js            # persistencia en localStorage + lógica de racha
    ├── components/
    │   ├── common/               # Button, ProgressBar (reutilizables)
    │   └── layout/               # Navbar
    ├── pages/
    │   ├── Home.jsx              # lista de cursos
    │   ├── UnitMap.jsx           # mapa de unidad tipo ruta
    │   ├── BlockScreen.jsx       # bloque de aprendizaje
    │   ├── PracticeScreen.jsx    # práctica guiada (editor + consola)
    │   ├── Profile.jsx           # XP, racha y progreso
    │   └── Settings.jsx          # reset de progreso
    └── data/
        └── courses/
            ├── index.js          # registro central de cursos
            └── sql-basico.json   # contenido del curso SQL
```

## 🧩 Modelo de datos (JSON)

Cada **curso** tiene **unidades**, y cada unidad tiene **items** que pueden ser de tipo
`block` (bloque de aprendizaje) o `practice` (práctica guiada). El orden del array `items`
es el orden en la ruta.

```jsonc
{
  "id": "sql-basico",
  "title": "SQL Básico",
  "icon": "🗄️",
  "accent": "teal",          // teal | violet | lime | amber | gold | rose
  "language": "sql",          // se usa en la pestaña del editor (script.sql)
  "units": [
    {
      "id": "u1",
      "title": "Fundamentos de consultas",
      "items": [
        {
          "type": "block",
          "id": "b1",
          "title": "¿Qué es SQL?",
          "explanation": "Texto corto…",
          "example": { "code": "SELECT * FROM usuarios;", "caption": "…" },
          "question": {
            "prompt": "¿Para qué sirve SQL?",
            "options": ["…", "…"],
            "correctIndex": 1,
            "feedback": { "correct": "…", "incorrect": "…" }
          },
          "xp": 10
        },
        {
          "type": "practice",
          "id": "p1",
          "title": "Tu primera consulta",
          "scenario": "Contexto del ejercicio…",
          "instructions": ["Paso 1", "Paso 2"],
          "initialCode": "SELECT \nFROM usuarios;",
          "validators": ["select", "from\\s+usuarios", "where"],
          "mockOutput": {
            "columns": ["nombre", "email"],
            "rows": [["Ana", "ana@mail.com"]]
          },
          "hints": ["Pista 1", "Pista 2"],
          "successMessage": "¡Bien! 🎉",
          "failMessage": "Revisa…",
          "xp": 40
        }
      ]
    }
  ]
}
```

### Cómo funciona la validación de prácticas

No hay motor real de SQL/Java (Fase 1). El código del usuario se **normaliza** (minúsculas,
espacios colapsados) y se comprueba contra el array `validators`: cada string es una expresión
regular y **todas** deben cumplirse para dar la práctica por correcta. Esto es flexible y sirve
igual para SQL, Java, Python, etc.

- **Ejecutar** → muestra `mockOutput` en la consola si los validadores pasan.
- **Validar** → marca la práctica como completa y otorga XP; si falla, revela una pista.

## ➕ Cómo agregar un curso nuevo (Java, Python, APIs, Testing, Oracle)

1. Crea `src/data/courses/mi-curso.json` copiando el modelo de `sql-basico.json`.
2. Regístralo en `src/data/courses/index.js`:

   ```js
   import miCurso from './mi-curso.json'
   export const courses = [sqlBasico, miCurso]
   ```

No hace falta tocar ninguna pantalla: Home, el mapa, los bloques y las prácticas leen todo
desde el registro de cursos.

## 🗺️ Roadmap

- [x] **Fase 1** — Curso SQL Básico (1 unidad: 12 bloques + 2 prácticas)
- [ ] **Fase 2** — Curso Java Básico con la misma arquitectura
- [ ] Más unidades por curso
- [ ] Motor real de ejecución (p. ej. `sql.js` para SQL) en lugar de consola simulada
- [ ] Migrar persistencia a IndexedDB si crece el contenido
```
