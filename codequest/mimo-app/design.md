# DESIGN.md — Reglas de diseño visual · CodeQuest

> Compañero de CLAUDE.md, enfocado en diseño visual.
> REVÍSALO antes de crear o modificar cualquier pantalla, componente o estilo.
> Aplica a TODA la app (Home, Cursos, curso, mapa, lección, práctica, perfil,
> ajustes, repaso, login) — no solo al mapa de bloques.
> Para que Claude Code lo cargue cada sesión, añade en CLAUDE.md la línea:
>     See @DESIGN.md
> Si una decisión visual no está aquí, mantén coherencia con lo ya construido; no improvises.

---

## 0. Principio rector

CodeQuest es un **videojuego de aprendizaje**, no una plataforma de cursos.
Toda pantalla —del dashboard al editor de código— debe sentirse como explorar un
mundo digital: oscura, minimalista, premium, tecnológica. Nunca infantil, nunca tipo
Duolingo, nunca una app educativa tradicional.

---

## 1. Tokens — fuente única de verdad

Definidos en `src/styles/tokens.css` como variables en `:root`. **Todo** color, espacio,
radio, tipografía y duración sale de aquí. Prohibido hex o valores sueltos en el CSS de
los componentes.

```css
:root{
  /* --- Color base (el negro domina) --- */
  --cq-bg:        #______;   /* [COMPLETAR] fondo principal */
  --cq-surface:   #______;   /* [COMPLETAR] tarjetas/paneles, apenas sobre el fondo */
  --cq-surface-2: #______;   /* [COMPLETAR] elevación secundaria */
  --cq-line:      rgba(255,255,255,.06);  /* bordes / divisores sutiles */
  --cq-grid:      rgba(255,255,255,.035); /* cuadrícula de fondo */

  /* --- Texto --- */
  --cq-text:      #______;   /* [COMPLETAR] principal */
  --cq-text-dim:  #______;   /* [COMPLETAR] secundario */
  --cq-text-mute: #______;   /* [COMPLETAR] terciario / deshabilitado */

  /* --- Acento: ÚNICO color de marca --- */
  --cq-yellow:     #______;  /* [COMPLETAR] amarillo CodeQuest */
  --cq-yellow-dim: #______;  /* [COMPLETAR] amarillo apagado (hover / track) */

  /* --- Semánticos: SOLO validación/consola, desaturados (ver §3) --- */
  --cq-ok:   #______;        /* [COMPLETAR] éxito (verde apagado) */
  --cq-err:  #______;        /* [COMPLETAR] error  (rojo apagado) */
  --cq-info: #______;        /* [COMPLETAR] info   (azul apagado) */

  /* --- Tipografía --- */
  --font-ui:   "______", system-ui, sans-serif;     /* [COMPLETAR] interfaz */
  --font-mono: "______", ui-monospace, monospace;   /* [COMPLETAR] código / datos */

  /* --- Espacio (escala de 4px) --- */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-8:48px;

  /* --- Radios --- */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-pill:999px;

  /* --- Movimiento --- */
  --ease:   cubic-bezier(.22,1,.36,1);
  --t-fast:160ms; --t-base:240ms; --t-slow:620ms;

  /* --- Capas (z-index) --- */
  --z-base:0; --z-byte:5; --z-nav:30; --z-overlay:60; --z-modal:80;
}
```

Breakpoints (mobile-first, usa `min-width`): **sm 480 · md 768 · lg 1024**.

---

## 2. La regla del amarillo (escasez = impacto)

El amarillo SOLO comunica: **progreso, interacción (foco/hover/activo), logros,
recompensas, elementos activos y Byte.** Todo lo demás es negro/gris.

- Permitido: barra/anillo de progreso, nodo actual, botón primario, estado seleccionado,
  XP/racha, foco de teclado, Byte.
- Prohibido: fondos amplios, texto de párrafo, íconos decorativos, bordes por defecto,
  tipografía de cuerpo.
- Regla práctica: si una pantalla se ve "muy amarilla", sobra amarillo.

---

## 3. Color funcional — única excepción al amarillo · CONFIRMAR

El editor, la consola y la validación necesitan distinguir éxito y error. Usa
`--cq-ok / --cq-err / --cq-info`, siempre **desaturados** y SOLO dentro de
`ValidationFeedback`, `ConsolePanel` y las mini-preguntas. Nunca en navegación,
decoración ni fuera de esos contextos.

> Decisión tuya: ¿apruebas esta excepción, o prefieres señalar éxito/error solo con
> amarillo + iconografía (✓ / ✕)? Marca aquí lo elegido antes de construir feedback.

---

## 4. Componentes base — reutilízalos siempre

Antes de estilizar algo, usa el componente de `components/common/`:

- **Button** → todos los botones. Variantes: `primary` (amarillo), `ghost`, `danger`.
- **ProgressBar** → toda barra / porcentaje de progreso.
- **ByteMascot** → cualquier aparición de Byte (ver §6).
- **icons** → set único; mismo grosor de trazo, tamaño por token.

Nunca recrees estos estilos inline ni dupliques un botón/barra. Si falta una variante,
**extiende** el componente base; no crees uno paralelo.

---

## 5. Layout y responsive (mobile-first)

- Diseña primero a ~360–390px y escala hacia tablet/escritorio.
- Banda de contenido centrada, máx ~720px en escritorio. El camino del mapa vive en una
  banda central angosta para dejar libres los márgenes laterales.
- Respeta safe-areas (`env(safe-area-inset-*)`) en barras superior e inferior.
- **Navbar** (`layout/Navbar`): persistente, oscura, mínima; el ítem activo es lo único en amarillo.
- Toca-target mínimo **44×44px**.

---

## 6. Byte (mascota) — usa el asset oficial

- Renderiza SIEMPRE vía **ByteMascot**. NUNCA redibujes, simplifiques ni reinterpretes a Byte.
- Assets oficiales en `public/`: **`byte.png`** (Byte completo, asset por defecto del componente)
  y **`pixel-asomada.png`** (pose asomada, se pasa como `src` explícito). No existen otros assets de Byte.
- Si falta una pose y no existe asset, **DETENTE y pregunta**; no improvises una ilustración.
- Marca la posición actual en el mapa y puede asomarse desde un borde lateral (BytePeek)
  sin tapar el camino (`pointer-events:none`).
- Animaciones discretas: respiración, flotación, parpadeo, antenas, estela, partículas
  suaves. Nada exagerado. Respeta `prefers-reduced-motion`.

---

## 7. Movimiento

- Microinteracciones con `--ease` y `--t-fast/--t-base`. Asomos y transiciones grandes con `--t-slow`.
- Anima solo donde aporte valor: progreso, nodo activo, recompensas, desbloqueos, Byte.
- `prefers-reduced-motion: reduce` → desactiva transform/opacity no esenciales.

---

## 8. Reglas por superficie

Mantén la sensación de **mundo / exploración** en TODAS, no solo en el mapa.

- **Home (`/`)** — dashboard como "base del jugador": progreso del curso activo
  (ProgressBar amarilla), racha/XP, botón **Continuar** primario, acceso al mapa.
  No una lista plana de tarjetas.
- **Cursos (`/cursos`)** — catálogo como **regiones/mundos** seleccionables, no un grid
  genérico. Curso bloqueado = atenuado; disponible = acento sutil.
- **CourseScreen (`/curso/:id`)** — unidades como tramos del mundo; progreso por unidad visible.
- **UnitMap (`/curso/:id/unidad/:id`)** — el mapa serpenteante (regla principal):
  nodo = descubrimiento, práctica = desafío, examen = jefe; tramo completado iluminado en
  amarillo; Byte marca la posición. Nada de listas/tarjetas apiladas.
- **BlockScreen (lección)** — lectura cómoda: pasos (`StepRenderer`),
  `ExplanationCard`/`ExampleCard` sobrias, `MiniQuestion` con feedback inmediato.
  Amarillo solo en avance/correcto/CTA.
- **PracticeScreen (editor)** — `CodeWorkspace` tipo "consola del mundo": editor mono
  oscuro, `ConsolePanel`, `InstructionsPanel`; **Ejecutar/Validar** primario amarillo;
  `ValidationFeedback` usa color funcional desaturado (§3); `HintPanel` discreto.
- **Profile (`/perfil`)** — identidad y logros del jugador; medallas/recompensas en
  amarillo, el resto neutro.
- **Settings (`/ajustes`)** — sobrio y funcional; controles con foco amarillo, sin decoración.
- **MistakesReview (`/repasar-errores`)** — repaso enfocado: dominado vs pendiente; tono de
  "reintentar", nunca de regaño (ver §9).
- **Login (`/login`)** — umbral del mundo: marca + Byte, un único CTA primario, mínimo ruido.

---

## 9. Texto en la interfaz

- Voz activa, español neutro, frase normal (sentence case). Nombra por lo que el usuario
  controla, no por cómo está hecho el sistema.
- El botón y su resultado comparten verbo: **Validar → Validado**.
- Errores: explican qué pasó y cómo seguir, sin disculparse ni dramatizar. Estados vacíos
  invitan a actuar ("Empieza tu primer bloque"), nunca parecen rotos.

---

## 10. Accesibilidad (piso mínimo, no negociable)

- Foco visible en todo control (anillo amarillo). Todo navegable por teclado.
- Contraste de texto AA. No comuniques estado solo con color: añade icono o forma.
- `prefers-reduced-motion` respetado. Imágenes decorativas con `alt=""`.

---

## 11. CSS / código

- Un `.css` por componente, junto a su `.jsx`. Sin framework de estilos.
- Clases con prefijo del componente (p. ej. `.byte-peek__img`) para evitar colisiones.
- Cero hex/valores mágicos: todo vía `var(--…)`. Ningún estilo global nuevo salvo tokens.
- Cuida la especificidad: evita que selectores de sección y de elemento se cancelen
  (típico en paddings/márgenes entre secciones).

---

## 12. Checklist antes de entregar UI

- [ ] Solo usé tokens (sin hex sueltos).
- [ ] El amarillo aparece solo donde §2 lo permite.
- [ ] Reutilicé Button / ProgressBar / ByteMascot / icons.
- [ ] Funciona a 360px y escala a escritorio.
- [ ] Foco de teclado visible y contraste AA.
- [ ] Respeté `prefers-reduced-motion`.
- [ ] Byte se usó vía asset oficial, sin redibujar.
- [ ] La pantalla mantiene la sensación de mundo / exploración.

---

## Ante la duda

No improvises. Revisa estas reglas y CLAUDE.md; si algo no está definido, mantén
coherencia con lo ya construido. La consistencia del producto pesa más que una idea nueva.