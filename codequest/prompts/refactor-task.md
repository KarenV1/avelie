# Prompt: Refactorizar Código Sin Romper la App

**Uso**: Pídeme este prompt cuando quieras mejorar/refactorizar una parte específica del código manteniendo funcionalidad.

---

## Instrucciones

Necesito que refactorices un componente o módulo específico de CodeQuest **sin romper la app**.

### Información a Proporcionar

**1. ¿Qué archivo/componente?**
```
Ruta: [Ej: src/pages/BlockScreen.jsx]
Componente: [Ej: BlockScreen]
Responsabilidad actual: [Breve descripción]
```

**2. ¿Qué mejorar?**
```
- [ ] Limpieza de código (legibilidad)
- [ ] Performance (optimizaciones)
- [ ] Estructura (separar en sub-componentes)
- [ ] Lógica (simplificar, reutilizar)
- [ ] Estilos (organizar CSS)
- [ ] Errores (bugs encontrados)
- [ ] Tipo de cambio: [Otro específico]
```

**3. Restricciones (NO ROMPER)**
```
- ✅ Mantener la UI igual
- ✅ Mantener las props que recibe
- ✅ Mantener la navegación
- ✅ Mantener integración con Context/Router
- ❌ No cambiar rutas
- ❌ No eliminar componentes (solo refactorizar)
- ❌ No agregar librerías nuevas
- ❌ No tocar archivos no mencionados
```

**4. Detalle del Cambio Deseado**

**Problema actual** (por qué necesita refactor):
```
[Descripción del problema: código repetido, difícil de leer, etc.]
```

**Solución propuesta** (qué quieres lograr):
```
[Descripción de la mejora esperada]

Ejemplos:
- "Extraer lógica de validación a un hook reutilizable"
- "Separar BlockScreen en BlockExplanation, BlockQuestion, BlockFeedback"
- "Organizar CSS de Navbar en variables y utilizar más eficientemente"
- "Optimizar re-renders eliminando dependencias innecesarias"
```

**Resultado esperado**:
```
[Qué debería funcionar igual después del refactor]

Ejemplo:
- El usuario ve el bloque igual que ahora
- Al responder, recibe feedback igual que ahora
- El XP se suma igual
- La navegación "Siguiente" funciona igual
```

### Contexto Técnico (para yo entender mejor)

**Dependencias del componente**:
```
- Props: [Ej: courseId, unitId, itemId]
- Hooks: [Ej: useParams, useContext(ProgressContext)]
- Otros componentes: [Ej: Button, ProgressBar]
- Datos: [Ej: getItem() de data/courses]
```

**Acoplamiento**:
```
- ¿Se importa desde otros lados? [Dónde]
- ¿Exporta datos para otros? [Qué]
```

### Validaciones Post-Refactor

Después del refactor, verificaremos:
- [ ] `npm run dev` compila sin errores
- [ ] No hay warnings en consola
- [ ] La UI se ve igual
- [ ] Flujo de usuario funciona igual
- [ ] Imports actualizados (si se mueven archivos)
- [ ] No hay console.logs de debug
- [ ] Tests siguen pasando (si existen)

---

## Ejemplo Relleno 1: Extraer Hook

```
Archivo: src/pages/BlockScreen.jsx
Componente: BlockScreen

Mejorar: Lógica

Problema:
"La lógica de obtener el bloque, validar respuesta y calcular XP está toda mezclada en BlockScreen. 
Es difícil reutilizar para PracticeScreen. Hay duplicación."

Solución:
"Extraer en un hook personalizado useBlockLogic(courseId, unitId, blockId) que devuelva:
- block (contenido)
- isCompleted (bool)
- completeBlock() (función)
- canProceed() (bool)"

Resultado esperado:
"BlockScreen se vuelve más limpio, solo renderiza. La lógica está en el hook. 
Si queremos reutilizar validación en otra pantalla, es fácil."

Dependencias:
- Recibe: courseId, unitId, itemId (via useParams)
- Usa: getItem(), completeItem() de Context
- Devuelve: <Block /> con UI

Acoplamiento:
- Se importa solo en pages/
- Exporta solo la funcionalidad de bloque
```

## Ejemplo Relleno 2: Separar Componentes

```
Archivo: src/pages/BlockScreen.jsx
Componente: BlockScreen

Mejorar: Estructura

Problema:
"BlockScreen hace demasiadas cosas: explicación, ejemplo, pregunta, feedback. Difícil de mantener."

Solución:
"Separar en componentes más pequeños:
- components/learning/BlockExplanation.jsx
- components/learning/BlockExample.jsx
- components/learning/BlockQuestion.jsx
- components/learning/BlockFeedback.jsx

BlockScreen seguirá siendo el contenedor que los arma."

Resultado esperado:
"Cada componente es pequeño, testeable. BlockScreen orquesta pero es legible. 
Si queremos reutilizar BlockQuestion en otra pantalla, es fácil."

Dependencias:
- BlockScreen (contenedor) sigue usando Context
- Sub-componentes reciben props: data, onAnswer, isCorrect, etc.

Acoplamiento:
- BlockScreen importa los 4 sub-componentes
- Sub-componentes no se importan desde otros lados (por ahora)
```

## Ejemplo Relleno 3: Optimizar Performance

```
Archivo: src/components/layout/Navbar.jsx
Componente: Navbar

Mejorar: Performance

Problema:
"Navbar re-renderiza cada vez que el usuario completa un bloque, aunque solo cambie el XP. 
Esto causa parpadeo visual."

Solución:
"Envolver Navbar en useMemo, memoizar componentes sub-componentes. 
Separar XP display en componente dedicado para granularidad."

Resultado esperado:
"Navbar solo re-renderiza cuando XP o streak cambian, no por cada cambio global."

Dependencias:
- Navbar usa: ProgressContext
- Renderiza: Logo, XP, Streak, Links

Acoplamiento:
- Se usa en App.jsx como componente global
- No afecta a otros componentes
```

---

## Checklist Antes de Pedir Refactor

- [ ] Identifiqué claramente qué archivo
- [ ] Expliqué el problema específico
- [ ] Propuse una solución concreta
- [ ] Listei las restricciones (qué NO cambiar)
- [ ] Mencioné si hay archivos relacionados
- [ ] Verifiqué que sea seguro refactorizar

---

## Proceso

Cuando pidas un refactor con estos detalles:

1. **Yo revisaré** el código actual
2. **Propondré** cambios específicos sin romper
3. **Aplicaré** los cambios (o te mostraré los diff)
4. **Verificaré** que compila y funciona
5. **Confirmaré** que la UI sigue igual

**Resultado**: Código más limpio, mantenible, y la app sigue funcionando.

---

## Ejemplos de Refactores Seguros

✅ **Separar componentes grandes**
```
BlockScreen (500 líneas) 
→ BlockScreen (100) + BlockExplanation + BlockQuestion (100 c/u)
```

✅ **Extraer lógica a hooks**
```
const [code, setCode] = useState() en PracticeScreen
→ const { code, setCode } = useCodeEditor()
```

✅ **Organizar imports**
```
import '../styles/block.css'
→ import styles from '../styles/block.css'
```

✅ **Memoizar componentes**
```
export default Button
→ export default React.memo(Button)
```

✅ **Renombrar para claridad**
```
const x = getItem()
→ const currentBlock = getItem()
```

---

## Ejemplos de Refactores RIESGOSOS (evitar)

❌ **Cambiar rutas**
```
/curso/:id → /course/:id  [NO - rompe deep links]
```

❌ **Cambiar estructura de datos**
```
{ xp, streak } → { stats: { xp, streak } }  [NO - rompe Context]
```

❌ **Agregar librerías**
```
npm install lodash  [NO - innecesario, usa JS puro]
```

❌ **Eliminar componentes**
```
rm components/Button.jsx  [NO - probablemente otros lo usen]
```

---

**Pídeme un refactor con estos detalles y procederé con cuidado.**
