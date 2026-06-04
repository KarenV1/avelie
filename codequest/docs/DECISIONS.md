# CodeQuest - Decisiones Técnicas 🔍

Registro de decisiones clave y sus justificaciones. Útil para entender el porqué detrás de cada elección.

---

## 1. Stack: React + Vite (vs. Vue, Svelte, Next.js, etc.)

### Decisión
**Framework**: React 18  
**Build Tool**: Vite 5  
**Lenguaje**: JavaScript (sin TypeScript por ahora)

### Justificación
- ✅ **React**: Popularidad, ecosistema, curva de aprendizaje accesible
- ✅ **Vite**: Build rápido, configuración minimal, perfecto para proyectos medianos
- ✅ **JavaScript**: Desarrollo más rápido sin boilerplate de tipos; TypeScript se puede agregar después
- ❌ **Next.js**: Overkill para app local-first sin backend
- ❌ **Vue/Svelte**: Menos comunidad, no necesitamos SFC avanzadas

### Trade-offs
- **Pro**: Comunidad grande, fácil de mantener
- **Con**: Más código boilerplate que Vue; bundle un poco más grande

### Decisiones futuras
- Migrar a TypeScript si proyecto crece (Fase 4+)
- Considerar Remix si necesitamos backend (Fase 5+)

---

## 2. Estilos: CSS Puro vs. Tailwind, Styled-Components, etc.

### Decisión
**CSS Puro** con variables CSS (CSS Custom Properties)

### Justificación
- ✅ **Sin dependencias**: Reduce tamaño de bundle
- ✅ **Variables CSS**: Tema oscuro, consistencia de diseño
- ✅ **Performance**: CSS nativo es más rápido que CSS-in-JS
- ✅ **Aprendizaje**: CSS puro es fundamental; Tailwind esconde detalles
- ❌ **Tailwind**: Agrega ~50KB, menos control sobre espaciado
- ❌ **Styled-Components**: Runtime overhead, más complicado

### Trade-offs
- **Pro**: Bundle pequeño, rápido, control total
- **Con**: Más CSS manual; no hay auto-completado como en Tailwind

### Estructura
```
src/index.css           # Tokens + reset + estilos base
src/components/*/*.css  # CSS específico de cada componente
src/styles/tokens.css   # (NUEVA) Variables centralizadas
```

### Decisiones futuras
- Si UI necesita componentes muy complejos, considerar Tailwind en Fase 3
- Mantener CSS puro mientras sea manejable

---

## 3. State Management: Context API vs. Redux, Zustand, etc.

### Decisión
**Context API** con `useContext` hook

### Justificación
- ✅ **Built-in**: No hay dependencias externas
- ✅ **Simple para MVP**: Progreso es simple (XP, racha, completados)
- ✅ **Persiste en localStorage**: Manejo de estado local
- ❌ **Redux**: Overkill para progreso simple; boilerplate excesivo
- ❌ **Zustand**: Bueno, pero innecesario para estructura actual

### Data en Context
```javascript
{
  xp: 1250,                          // XP total
  streak: 5,                         // Días consecutivos
  completed: {
    'sql-basico': { 'b1': true, 'b2': true },
    'java-basico': { 'b1': true }
  }
}
```

### Trade-offs
- **Pro**: Sin dependencias, fácil de entender
- **Con**: Puede causar re-renders innecesarios (solucionable con `useMemo`)

### Decisiones futuras
- Si estado crece (badges, settings), migrar a Zustand (Fase 4)
- Nunca usar Redux (complejidad innecesaria)

---

## 4. Persistencia: localStorage vs. Base de Datos

### Decisión
**localStorage** (cliente)  
**Sin backend ni BD**

### Justificación
- ✅ **Local-first**: Funciona sin conexión
- ✅ **Privacidad**: Sin enviar datos a servidor
- ✅ **Simplicidad**: No hay backend que mantener
- ✅ **MVP rápido**: Cero fricción de deployment
- ❌ **Backend**: Complejidad, costos de hosting, GDPR
- ❌ **Cloud BD**: Overkill para educativo personal

### Limitaciones
- localStorage ~5-10MB por dominio (suficiente para cursos)
- Datos solo en 1 dispositivo (próxima mejora: export/import)
- Sin sincronización entre dispositivos

### Seguridad
- ✅ Tokens no sensibles en localStorage (solo progreso)
- ✅ Validación en cliente (para práctica educativa)
- ⚠️ Si hay validación importante, debe ser en servidor (Fase 5+)

### Decisiones futuras
- Fase 4: Agregar export/import de progreso
- Fase 5: Sincronización en la nube (opcional)
- Fase 5: Backend solo si hay autenticación real

---

## 5. Contenido: JSON vs. CMS, Base de Datos

### Decisión
**JSON local** (`sql-basico.json`, `java-basico.json`, etc.)

### Justificación
- ✅ **Control total**: Sin dependencias de CMS
- ✅ **Versionado**: Git incluye contenido, historial limpio
- ✅ **Portátil**: JSON se puede exportar, migrar, compartir
- ✅ **Performance**: Parsing rápido, sin request HTTP
- ❌ **CMS externo**: Complejidad, costo, latencia
- ❌ **GraphQL/API**: Overkill para MVP

### Estructura JSON
```json
{
  "id": "sql-basico",
  "title": "SQL Básico",
  "units": [
    {
      "id": "u1",
      "items": [
        { "type": "block", "id": "b1", "explanation": "...", "example": {...}, "question": {...} },
        { "type": "practice", "id": "p1", "instructions": "...", "tests": [...] }
      ]
    }
  ]
}
```

### Ventajas para escalabilidad
- Agregar curso: copiar un JSON + 1 línea en `index.js`
- Editar contenido: editor de texto
- Versionado: GitHub diffs claros
- Sin "migrations" complicadas

### Decisiones futuras
- Fase 5: Si muchos cursos, refactorizar en carpetas (`courses/sql/`, `courses/java/`)
- Fase 5: CMS externo solo si usuarios editan contenido

---

## 6. Arquitectura: 12 Bloques + 2 Prácticas

### Decisión
Cada unidad = 12 bloques de teoría + 2 prácticas guiadas (después de bloque 6 y 12)

### Justificación
- ✅ **Cognitivo**: 12 es número óptimo (Chunking: 7±2)
- ✅ **Prácticas distribuidas**: Refuerzo en tiempo real, no acumulación
- ✅ **Gamificación**: Práctica 1 es "checkpoint", Práctica 2 es "final boss"
- ✅ **Escalable**: Estructura reutilizable para todos los cursos

### Alternativas consideradas
- ❌ 5 bloques + 1 práctica: Muy poco contenido
- ❌ 20 bloques + 1 práctica: Demasiado antes de reforzar
- ❌ Cada bloque con práctica: Muy granular, requiere más contenido

### Flexibilidad
- Si un curso necesita estructura diferente (ej. 8 bloques), puede modificarse
- Pero 12+2 es default para mantener consistencia

### Decisiones futuras
- Fase 4: Permitir estructuras customizadas por curso
- Fase 5: Analytics sobre qué estructura funciona mejor

---

## 7. Routing: React Router v6

### Decisión
**React Router DOM v6**

### Justificación
- ✅ **Estándar de facto**: Mayoría de apps React usan Router
- ✅ **SPA rápido**: Navegación sin refresco de página
- ✅ **URLs limpias**: `/curso/:id/unidad/:id/bloque/:id`
- ✅ **Deep linking**: Compartir/bookmarkear pantalla específica

### Rutas
```javascript
/                                          # Home (catálogo)
/curso/:courseId/unidad/:unitId            # UnitMap
/curso/:courseId/unidad/:unitId/bloque/:id # BlockScreen
/curso/:courseId/unidad/:unitId/practica/:id # PracticeScreen
/perfil                                    # Profile
/ajustes                                   # Settings
/*                                         # 404 → Home
```

### Trade-offs
- **Pro**: URLs semánticas, deep linking, historial del navegador
- **Con**: Configuración router + setup mínimo

### Decisiones futuras
- Mantener igual (v6 es estable)
- v7 si hay cambios significativos

---

## 8. Validación de Prácticas: JavaScript eval vs. Sandbox

### Decisión
**Validación simple** (comparación de outputs, sin eval peligroso)

### Justificación (MVP)
- ✅ **Seguro**: No ejecutar código usuario arbitrario
- ✅ **Simple**: Comparar "expected" vs "actual"
- ✅ **Suficiente**: Para práctica educativa inicial

```javascript
// Validación tipo:
const userCode = /* código del editor */
const userOutput = evaluate(userCode) // simulado
const testOutput = "expected result"
const passed = userOutput === testOutput
```

### Próximas mejoras (Fase 3+)
- Sandbox real (`iframe` + Web Workers)
- Servidor dedicado para ejecutar código (Fase 5+)

### Seguridad
- ⚠️ MVP: Validación solo en cliente (educativo)
- ✅ Producción (Fase 5): Validación en servidor

---

## 9. Racha (Streak): Lógica de Reset

### Decisión
Racha se resetea a 0 si el usuario **no abre la app durante 24 horas después de última actividad**.

### Justificación
- ✅ **Motivador**: Gamificación estándar (Duolingo, Habitica)
- ✅ **Justo**: 24h es suficiente para "tener vida"
- ✅ **Local**: Calcula en cliente sin servidor

### Implementación
```javascript
// storage.js
const lastActiveTime = localStorage.getItem('last-active')
const now = Date.now()
const diff = (now - lastActiveTime) / (1000 * 60 * 60) // horas

if (diff > 24) {
  streak = 0 // reset
}
```

### Casos especiales
- Primer uso: streak = 1
- Reset progreso: streak = 0
- Cambiar dispositivo: streak se pierde (mejora en Fase 4)

---

## 10. Gamificación: XP & Badges

### Decisión (MVP)
- **Bloques**: +100 XP al completar
- **Prácticas**: +500 XP al completar
- Racha visible en navbar

### Futuro (Fase 4)
- Badges (achievements)
- Leaderboard personal
- Estadísticas avanzadas

### Justificación
- ✅ Simple de implementar
- ✅ Motivador para usuario
- ✅ Extensible sin cambios arquitecturales

---

## 11. Sin Autenticación (MVP)

### Decisión
**Sin login real**

### Justificación
- ✅ **Simplicidad**: Un usuario = una instancia
- ✅ **Privacidad**: Sin base de datos de usuarios
- ✅ **MVP**: Foco en contenido, no infraestructura
- ❌ **Múltiples dispositivos**: Próxima mejora (export/import)

### Futuro
- Fase 4: Export/import progreso (manual)
- Fase 5: Login opcional para sincronización en nube

---

## 12. Estructura de Carpetas: Plana vs. Feature-Based

### Decisión
**Híbrida** (Plana + Feature-Based):
- `components/common/`, `components/layout/` → por tipo
- `components/learning/`, `components/practice/` → por feature
- `pages/` → por ruta

### Justificación
- ✅ Equilibrio: Fácil de navegar, escalable
- ✅ Agrupación lógica: "Learning" vs "Practice"
- ✅ Reutilización: Componentes comunes en top level

### Alternativas
- ❌ Fully flat: Demasiados archivos en `components/`
- ❌ Fully feature-based: Difícil encontrar componentes compartidos

---

## 🔄 Decisiones Reversibles vs. Irreversibles

### Reversibles (Fácil cambiar)
- CSS (variables, tema)
- UI components
- Nombres de variables

### Irreversibles (Difícil cambiar después)
- ✅ Estructura JSON (agregar campos es OK)
- ✅ Rutas (pueden extenderse)
- ⚠️ Estado en localStorage (migración necesaria)

---

## 📋 Matriz de Decisión

| Aspecto | Decisión | Alternativa | Razón |
|---------|----------|-------------|-------|
| Framework | React | Vue, Svelte | Comunidad + Ecosystem |
| Build | Vite | Webpack, Parcel | Speed + Config |
| CSS | Puro | Tailwind, CSS-in-JS | Bundle pequeño |
| State | Context | Redux, Zustand | Simplicidad MVP |
| BD | localStorage | Backend | Local-first + Privacy |
| Contenido | JSON | CMS | Control + Versionado |
| Routing | React Router | Wouter, TanStack | Estándar |
| Autenticación | Ninguna | OAuth, Custom | MVP simplicity |

---

## 📚 Más Documentación

- [**PROJECT_CONTEXT.md**](./PROJECT_CONTEXT.md) - Visión general
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Técnica
- [**ROADMAP.md**](./ROADMAP.md) - Fases futuras
- [**CONTENT_GUIDE.md**](./CONTENT_GUIDE.md) - Cómo agregar contenido
