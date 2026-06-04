# CodeQuest - Architecture 🏗️

## 📂 Estructura de Carpetas

```
codequest/
├── mimo-app/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx        # Botón reutilizable (estilos: primary, ghost, success, danger)
│   │   │   │   ├── Button.css
│   │   │   │   ├── ProgressBar.jsx   # Barra de progreso
│   │   │   │   └── ProgressBar.css
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx        # Navegación principal + XP + Racha
│   │   │   │   └── Navbar.css
│   │   │   │
│   │   │   ├── learning/             # (NUEVA) Componentes para bloques
│   │   │   │   ├── BlockExplanation.jsx  # Solo texto explicativo
│   │   │   │   ├── BlockExample.jsx      # Ejemplo de código
│   │   │   │   ├── BlockQuestion.jsx     # Pregunta multiple choice
│   │   │   │   └── BlockFeedback.jsx     # Feedback automático
│   │   │   │
│   │   │   └── practice/             # (NUEVA) Componentes para prácticas guiadas
│   │   │       ├── PracticeHeader.jsx    # Instrucciones
│   │   │       ├── CodeEditor.jsx        # Editor de código
│   │   │       ├── Console.jsx           # Consola simulada
│   │   │       ├── Hints.jsx             # Pistas contextuales
│   │   │       └── ValidationFeedback.jsx # Resultado de validación
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Catálogo de cursos
│   │   │   ├── Home.css
│   │   │   ├── UnitMap.jsx           # Grid de 12 bloques + 2 prácticas
│   │   │   ├── UnitMap.css
│   │   │   ├── BlockScreen.jsx       # Pantalla de un bloque individual
│   │   │   ├── LearningScreens.css
│   │   │   ├── PracticeScreen.jsx    # Pantalla de una práctica guiada
│   │   │   ├── PracticeScreen.css
│   │   │   ├── Profile.jsx           # Perfil del usuario
│   │   │   ├── Profile.css
│   │   │   ├── Settings.jsx          # Configuración
│   │   │   └── Settings.css
│   │   │
│   │   ├── context/
│   │   │   └── ProgressContext.jsx   # Estado global: XP, racha, completados
│   │   │
│   │   ├── data/
│   │   │   └── courses/
│   │   │       ├── index.js          # Registro central de cursos (loader)
│   │   │       └── sql-basico.json   # Contenido del primer curso
│   │   │
│   │   ├── styles/                   # (NUEVA) Variables y estilos globales
│   │   │   ├── tokens.css            # Variables CSS (colores, tipografía, espaciado)
│   │   │   └── base.css              # Reset y estilos base
│   │   │
│   │   ├── utils/
│   │   │   └── storage.js            # Persistencia en localStorage + lógica de racha
│   │   │
│   │   ├── App.jsx                   # Router y definición de rutas
│   │   ├── main.jsx                  # Punto de entrada (React DOM + Providers)
│   │   ├── index.css                 # Estilos globales y temas
│   │   │
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── README.md
│   │
│   └── .gitignore, .env, etc.
│
├── docs/                             # (NUEVA) Documentación del proyecto
│   ├── PROJECT_CONTEXT.md            # Visión general y stack
│   ├── ARCHITECTURE.md               # Este archivo
│   ├── ROADMAP.md                    # Fases de desarrollo
│   ├── DECISIONS.md                  # Decisiones técnicas
│   └── CONTENT_GUIDE.md              # Cómo crear nuevos cursos
│
└── prompts/                          # (NUEVA) Prompts reutilizables
    ├── create-course.md
    ├── create-unit.md
    ├── create-guided-practice.md
    └── refactor-task.md
```

---

## 🔄 Flujo de Navegación

```
Home (/)
├─ Catálogo de cursos
└─ Click en curso → UnitMap

UnitMap (/curso/:courseId/unidad/:unitId)
├─ Grid de 12 bloques + 2 prácticas
├─ Indicadores de estado (completado, en progreso, bloqueado)
│
├─ Click en bloque → BlockScreen
│   └─ BlockScreen (/curso/:courseId/unidad/:unitId/bloque/:itemId)
│      ├─ Explicación + Ejemplo
│      ├─ Pregunta multiple choice
│      ├─ Al completar → +100 XP, marcar como completado
│      └─ Botón "Siguiente" → próximo bloque
│
└─ Click en práctica → PracticeScreen
    └─ PracticeScreen (/curso/:courseId/unidad/:unitId/practica/:itemId)
       ├─ Instrucciones
       ├─ Editor de código
       ├─ Consola de output
       ├─ Botón "Ejecutar" → simula código
       ├─ Botón "Validar" → verifica solución
       ├─ Al completar → +500 XP (más por ser práctica)
       └─ Hints disponibles

Navbar (en todas las páginas)
├─ Logo / Home
├─ XP total
├─ Racha (streak)
├─ Link a Perfil (/perfil)
└─ Link a Ajustes (/ajustes)

Perfil (/perfil)
└─ Resumen de XP, racha, progreso por curso

Ajustes (/ajustes)
└─ Reset de progreso, etc.
```

---

## 🧩 Componentes Principales

### `ProgressContext`
**Ubicación**: `src/context/ProgressContext.jsx`

**Responsabilidad**: Estado global de progreso.

**API**:
```javascript
const { progress, completeItem, resetProgress } = useProgress()

// progress = { xp, streak, completed: { courseId: { itemId: true } } }
// completeItem(courseId, itemId, xpReward) → suma XP, marca como completado
// resetProgress() → borra todo (solo en /ajustes)
```

**Persistencia**: Automática en `localStorage['codequest-progress']`

---

### `courses/index.js`
**Ubicación**: `src/data/courses/index.js`

**Responsabilidad**: Registro central de cursos (data loader).

**API**:
```javascript
import { courses, getCourse, getUnit, getItem, getUnitItemIds } from './data/courses'

// courses = [{ id, title, units: [...] }, ...]
// getCourse(courseId) → devuelve objeto curso
// getUnit(courseId, unitId) → devuelve objeto unidad
// getItem(courseId, unitId, itemId) → devuelve bloque o práctica
// getUnitItemIds(courseId, unitId) → devuelve array de IDs para calcular progreso
```

**Agregar cursos nuevos**:
1. Crear `java-basico.json` en `src/data/courses/`
2. Importarlo en `index.js`
3. Agregarlo al array `courses`
4. Listo: todas las pantallas lo leen automáticamente

---

### `Pages`

#### **Home**
- Muestra todos los cursos disponibles (desde `courses`)
- Mostrará progreso: "3/12 bloques completados"
- Click en curso → navega a `/curso/:courseId/unidad/u1`

#### **UnitMap**
- URL: `/curso/:courseId/unidad/:unitId`
- Grid de 12 bloques + 2 prácticas
- Lee de `getUnit(courseId, unitId)`
- Cada item muestra: icono, título, estado (completado ✓ o vacío)

#### **BlockScreen**
- URL: `/curso/:courseId/unidad/:unitId/bloque/:itemId`
- Lee del JSON: explicación, ejemplo, pregunta
- Al responder correctamente: `completeItem()` → +100 XP
- Botón "Siguiente": calcula próximo bloque y navega

#### **PracticeScreen**
- URL: `/curso/:courseId/unidad/:unitId/practica/:itemId`
- Lee del JSON: instrucciones, código inicial, tests
- Editor editable (código JavaScript)
- Botón "Ejecutar": simula el código
- Botón "Validar": verifica contra tests
- Al pasar: `completeItem()` → +500 XP

#### **Profile**
- Muestra: XP total, racha, lista de cursos con progreso
- Solo lectura

#### **Settings**
- Botón para resetear progreso (confirmar antes)
- (Futura: tema, idioma, etc.)

---

## 🔄 Data Flow

```
User abre /curso/sql-basico/unidad/u1
  ↓
UnitMap renderiza
  ↓
Llama: getUnit('sql-basico', 'u1')
  ↓
Lee de src/data/courses/sql-basico.json
  ↓
Renderiza grid de items (12 bloques + 2 prácticas)
  ↓
User clickea bloque b3
  ↓
Navega a /curso/sql-basico/unidad/u1/bloque/b3
  ↓
BlockScreen renderiza
  ↓
Llama: getItem('sql-basico', 'u1', 'b3')
  ↓
Lee del JSON el contenido del bloque
  ↓
Renderiza: Explicación | Ejemplo | Pregunta
  ↓
User responde correctamente
  ↓
completeItem('sql-basico', 'b3', 100)
  ↓
Suma 100 XP, marca como completado, persistencia en localStorage
  ↓
Navbar actualiza: XP +100
```

---

## 🎨 CSS Architecture

### `index.css` (Global)
- Variables CSS (colores, tipografía, espaciado)
- Reset y estilos base
- Clase `.app-shell` para layout principal

### Componentes con CSS
- `components/common/Button.css` → variantes de botón
- `components/common/ProgressBar.css`
- `components/layout/Navbar.css`
- `pages/*.css` → estilos específicos de cada página

### Tema Oscuro
```css
:root {
  --color-bg: #0f172e;
  --color-surface: #1a2749;
  --color-text: #e4e6eb;
  --color-primary: #00d9ff;
  --color-success: #00ff88;
  /* ... más tokens ... */
}
```

---

## 🚀 Deployment Ready

La app está lista para desplegarse en:
- **Vercel**: `npm run build` → push a GitHub → autodesploy
- **Netlify**: Similar
- **GitHub Pages**: Requiere configurar `vite.config.js` con `base: '/repo-name/'`

Archivos necesarios:
- ✅ `package.json` con scripts
- ✅ `vite.config.js` configurado
- ✅ `.gitignore` (dist/, node_modules/)
- ✅ Contenido JSON en `src/data/courses/`

---

## 📋 Próximas Adiciones

### Componentes `learning/` (preparados para cuando se necesiten)
- `BlockExplanation.jsx` - Contenedor de teoría
- `BlockExample.jsx` - Visor de código
- `BlockQuestion.jsx` - Quiz
- `BlockFeedback.jsx` - Validación inmediata

### Componentes `practice/` (preparados)
- `PracticeHeader.jsx` - Instrucciones
- `CodeEditor.jsx` - Editor mejorado
- `Console.jsx` - Output del código
- `Hints.jsx` - Sistema de ayuda
- `ValidationFeedback.jsx` - Feedback de tests

Estos son placeholders para cuando se refactorice `BlockScreen.jsx` y `PracticeScreen.jsx` en componentes más pequeños.

---

## 📚 Más Documentación

- [**PROJECT_CONTEXT.md**](./PROJECT_CONTEXT.md) - Visión general
- [**ROADMAP.md**](./ROADMAP.md) - Fases futuras
- [**DECISIONS.md**](./DECISIONS.md) - Por qué estas decisiones técnicas
- [**CONTENT_GUIDE.md**](./CONTENT_GUIDE.md) - Cómo agregar contenido
