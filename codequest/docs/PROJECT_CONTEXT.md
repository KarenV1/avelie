# CodeQuest - Project Context 🎮

## ¿Qué es CodeQuest?

**CodeQuest** es una app personal de aprendizaje gamificado de **programación y bases de datos**, inspirada en plataformas como **Mimo** y **Duolingo**. 

El objetivo es hacer que aprender a programar sea:
- ✅ **Divertido** (gamificación: XP, racha, progreso visual)
- ✅ **Accesible** (sin backend, sin login, sin pagos)
- ✅ **Local-first** (funciona sin conexión a internet)
- ✅ **Extensible** (fácil agregar nuevos cursos)

---

## 📊 Estado Actual (MVP)

### Fase 1: SQL Básico ✅ En desarrollo
- **1 unidad completa** con:
  - 12 bloques de aprendizaje
  - 2 prácticas guiadas (después de bloque 6 y bloque 12)
- **Arquitectura lista** para más cursos

### Roadmap futuro
- Fase 2: Java Básico
- Fase 3: Python
- Fase 4: APIs REST
- Fase 5: Testing, Oracle, etc.

---

## 🧱 Stack Tecnológico

| Aspecto | Tecnología |
|--------|------------|
| Framework | **React 18** |
| Build Tool | **Vite 5** |
| Routing | **React Router DOM 6** |
| Lenguaje | **JavaScript** (sin TypeScript por ahora) |
| Estilos | **CSS puro** con variables (tema oscuro) |
| State | **Context API** (localStorage para persistencia) |
| Backend | ❌ **Ninguno** (local-first) |
| Base de datos | ❌ **Ninguna** (MVP sin servidor) |
| Autenticación | ❌ **Ninguna** |

---

## 🏗️ Arquitectura de Datos

### Contenido: JSON Local
```
src/data/courses/
├── index.js           # Registro central de cursos
└── sql-basico.json    # Contenido: unidades > bloques > prácticas
```

**Cada curso JSON** contiene:
- Metadatos (id, título, descripción, icono, color)
- Unidades (con teoría y prácticas)
- Bloques (con explicación, ejemplo, pregunta)
- Prácticas guiadas (con instrucciones, editor, validación)

### Progreso: localStorage
```javascript
localStorage['codequest-progress'] = {
  xp: 1250,
  streak: 5,
  completed: {
    'sql-basico': { 'b1': true, 'b2': true, ... },
    'java-basico': { 'b1': true, ... }
  }
}
```

---

## 🎯 Características Principales

### 1. Home
- Catálogo de cursos disponibles
- Resumen de XP y racha actual

### 2. Unidad (Unit Map)
- Grid de 12 bloques + 2 prácticas guiadas
- Indicadores de completado
- Mapa visual del progreso

### 3. Bloque de Aprendizaje (Block)
- Explicación breve
- Ejemplo de código
- Mini pregunta de opción múltiple
- Feedback automático

### 4. Práctica Guiada (Practice)
- Instrucciones claras
- Editor de código
- Consola simulada (output)
- Validación de soluciones
- Pistas contextuales

### 5. Perfil
- Total XP acumulado
- Racha actual
- Progreso por curso

### 6. Ajustes
- Reset de progreso
- (Expandible: tema, idioma, etc.)

---

## 🔐 Privacidad & Distribución

- ✅ **Datos locales**: Todo progreso vive en tu navegador
- ✅ **Sin tracking**: No hay analítica remota
- ✅ **Personal**: Hecho para aprendizaje individual
- 📦 **GitHub-ready**: Código público, fácil de desplegar

---

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias
npm install

# Desarrollar (hot reload)
npm run dev

# Compilar a producción
npm run build

# Previsualizar build
npm run preview
```

El app abre en `http://localhost:5173` (o el puerto que asigne Vite).

---

## 📚 Próximos Pasos

1. Completar SQL Básico (12 bloques + 2 prácticas)
2. Agregar Java Básico (reutilizando arquitectura)
3. Mejorar UI/UX de editor de prácticas
4. Agregar sistema de "pistas" más inteligente
5. (Opcional) Deploy gratuito en Vercel / Netlify

---

## 📄 Más Documentación

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Estructura técnica y componentes
- [**ROADMAP.md**](./ROADMAP.md) - Fases de desarrollo detalladas
- [**DECISIONS.md**](./DECISIONS.md) - Decisiones técnicas registradas
- [**CONTENT_GUIDE.md**](./CONTENT_GUIDE.md) - Cómo crear nuevos cursos
