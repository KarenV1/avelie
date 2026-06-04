# CodeQuest - Roadmap 🗺️

## Visión General

CodeQuest es un proyecto educativo para aprender programación y bases de datos de forma gamificada. La arquitectura está diseñada para crecer de **SQL Básico** a múltiples cursos sin cambiar el core de la app.

---

## 📅 Fases de Desarrollo

### ✅ **Fase 1: SQL Básico (MVP)**
**Estado**: En desarrollo  
**Duración**: ~2-4 semanas

#### Objetivos
- [x] Estructura de carpetas profesional
- [x] Router y navegación básica
- [x] Sistema de progreso (XP, racha, localStorage)
- [ ] 1 unidad completa: 12 bloques + 2 prácticas guiadas
- [ ] UI funcional (no necesariamente pulida)
- [ ] Documentación del proyecto

#### Tareas
- **Contenido SQL Básico**:
  - 12 bloques: ¿Qué es SQL?, SELECT, WHERE, ORDER BY, LIMIT, JOIN, GROUP BY, agregaciones, subconsultas, UPDATE, DELETE, Índices
  - Práctica 1 (después bloque 6): Escribir SELECT con WHERE
  - Práctica 2 (después bloque 12): Escribir JOIN + GROUP BY

- **Componentes**:
  - ✅ BlockScreen funcional (explicación + ejemplo + pregunta)
  - ✅ PracticeScreen funcional (editor + validación básica)
  - ✅ UnitMap (grid de bloques)
  - ✅ Home (catálogo)
  - ✅ Profile (estadísticas)
  - ✅ Settings (reset)

- **Testing**:
  - Verificar flujo completo de aprendizaje
  - Validar persistencia en localStorage
  - Probar en navegadores (Chrome, Firefox, Edge)

#### Entregables
- App funcionando localmente
- Documentación completa
- Repositorio GitHub (privado o público)

---

### 🔜 **Fase 2: Java Básico (Reutilizar Arquitectura)**
**Estimado**: ~3-4 semanas después de Fase 1

#### Objetivos
- Aplicar mismo patrón de contenido que SQL
- Validar que la arquitectura es reutilizable
- Agregar soporte para múltiples lenguajes en editor

#### Tareas
- **Contenido Java Básico**:
  - 1 unidad: 12 bloques sobre POO, tipos de datos, control de flujo, etc.
  - 2 prácticas guiadas

- **Cambios mínimos**:
  - Crear `src/data/courses/java-basico.json`
  - Actualizar `src/data/courses/index.js` (1 línea de import)
  - Verificar que editor soporte Java (highlight, validación)

- **Mejoras al editor**:
  - Syntax highlighting para Java
  - Detección de lenguaje automática según curso

#### Validación
- Home debe mostrar 2 cursos
- Usuarios pueden completar SQL → cambiar a Java
- Progreso de cada curso se mantiene separado

---

### 💡 **Fase 3: Mejora de Editor & Prácticas**
**Estimado**: 2-3 semanas en paralelo o después de Fase 2

#### Objetivos
- Mejorar experiencia de práctica guiada
- Agregar sistema de pistas más inteligente
- Feedback más detallado

#### Tareas
- **Editor de código**:
  - Integrar librería como `monaco-editor` o `prismjs` (opcional)
  - Autocompletado básico
  - Numeración de líneas
  - Tema oscuro/claro

- **Consola mejorada**:
  - Output más legible
  - Mostrar errores con color rojo
  - Mostrar output exitoso con color verde

- **Sistema de pistas**:
  - Pista 1: Concepto relacionado
  - Pista 2: Pseudocódigo
  - Pista 3: Solución parcial
  - Usuario puede pedir pistas, reduce XP al completar

- **Feedback**:
  - Mostrar qué está mal en la solución
  - Sugerencias de corrección
  - Link a bloque teórico relacionado

#### Entregables
- Editor mejorado
- Pistas funcionales
- UX más pulida

---

### 🎯 **Fase 4: Sistema de Progreso Avanzado**
**Estimado**: 2 semanas

#### Objetivos
- Gamificación más profunda
- Análisis de progreso del usuario

#### Tareas
- **Badges & Achievements**:
  - "Primera sangre": Completar primer bloque
  - "Racha de fuego": 7 días de racha
  - "Maestro SQL": Completar SQL Básico
  - "Poliglota": Completar 3 cursos

- **Leaderboard local**:
  - Guardar "record personal"
  - Comparar XP en periodos (día, semana, mes)

- **Estadísticas avanzadas**:
  - Tiempo promedio por bloque
  - Bloques más difíciles
  - Historial de intentos en prácticas

- **Exportar datos**:
  - Descargar JSON del progreso
  - Importar progreso (sincronización entre dispositivos)

#### Entregables
- Sistema de badges
- Dashboard de estadísticas
- Exportar/importar progreso

---

### 🚀 **Fase 5: Más Cursos & Deploy**
**Estimado**: 3-4 semanas (paralelo con otras fases)

#### Cursos adicionales
- [ ] Python Básico
- [ ] APIs REST
- [ ] Testing (Jest)
- [ ] Oracle SQL Avanzado
- [ ] JavaScript Intermedio

#### Deploy
- [ ] Configurar HTTPS
- [ ] Deploy en Vercel / Netlify
- [ ] Dominio personalizado (opcional)
- [ ] PWA (opcional): funcionar sin conexión

#### Optimizaciones
- [ ] Minificar JSON de cursos
- [ ] Lazy loading de cursos
- [ ] Service Worker para caché

#### Promoción
- [ ] GitHub público
- [ ] Blog post sobre cómo se hizo
- [ ] Compartir en comunidades: Dev.to, Reddit, Twitter

---

## 🎨 Cambios de UI/UX por Fase

### Fase 1
- UI básica pero funcional
- Tema oscuro por defecto
- Navegación clara

### Fase 2
- Pulir colores y espaciado
- Animaciones sutiles (transiciones)
- Responsivo para móvil (CSS media queries)

### Fase 3
- Editor profesional
- Pistas visuales mejoradas
- Feedback animado

### Fase 4
- Sección de achievements
- Gráficos de progreso (chart.js o similar)
- Perfil más detallado

### Fase 5
- Tema claro/oscuro toggle
- Idioma seleccionable
- Exportar certificado (HTML/PDF)

---

## 🔄 Dependencias entre Fases

```
Fase 1 (SQL MVP)
    ↓
Fase 2 (Java) + Fase 4 (Badges)  [paralelo]
    ↓
Fase 3 (Editor mejorado)
    ↓
Fase 5 (Más cursos + Deploy)
```

- **Fase 1** es bloqueante (todo depende de aquí)
- **Fase 2** valida arquitectura
- **Fase 3** y **Fase 4** pueden hacerse en paralelo
- **Fase 5** es más contenido + deployment

---

## 📊 Métricas de Éxito

### Por Fase

| Fase | Métrica | Meta |
|------|---------|------|
| 1 | Bloques SQL completables | 12 bloques + 2 prácticas |
| 1 | Persistencia de progreso | localStorage funcional |
| 2 | Segundos curso integrado | Java cargable sin cambios en UI |
| 3 | Tasa de completación de prácticas | >80% de usuarios completan práctica 1 |
| 4 | Engagement | Usuarios vuelven 5+ veces |
| 5 | Usuarios externos | 10+ usuarios usando la app |

---

## 🛠️ Herramientas & Stack

### Actual
- React 18 + Vite 5
- React Router DOM 6
- CSS puro
- localStorage

### Posibles adiciones (sin obligación)
- **Fase 3**: `monaco-editor` o `prismjs` (editor)
- **Fase 4**: `chart.js` o `recharts` (gráficos)
- **Fase 5**: `workbox` (PWA)

---

## 📋 Cómo Usar Este Roadmap

1. **Completar Fase 1**: Asegurar que SQL Básico es totalmente funcional
2. **Validar arquitectura**: Pasar a Fase 2 (Java) para confirmar reutilización
3. **Decidir prioridades**: ¿Más cursos? ¿Mejor UX? ¿Deploy?
4. **Iteración rápida**: Fases más pequeñas, feedback constante
5. **Escalar**: Fase 5 con comunidad (GitHub, feedback usuarios)

---

## 📚 Más Documentación

- [**PROJECT_CONTEXT.md**](./PROJECT_CONTEXT.md) - Qué es CodeQuest
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Cómo funciona internamente
- [**DECISIONS.md**](./DECISIONS.md) - Por qué estas decisiones
- [**CONTENT_GUIDE.md**](./CONTENT_GUIDE.md) - Cómo agregar contenido
