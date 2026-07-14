# Git desde Cero — temario fusionado

> Fusión del temario bibliográfico de Karen (5 unidades · 38 bloques · 5 prácticas ·
> evaluación intermedia · proyecto · evaluación final) con la arquitectura de CodeQuest
> (módulos → lecciones → bloques de contenido, examen de región por módulo, práctica de
> editor, diagramas data-driven).
>
> **Bibliografía base:** Pro Git (Chacon & Straub) · documentación oficial de Git ·
> documentación de GitHub y GitLab.
> **Nivel:** inicial → intermedio. **Enfoque:** Git individual **y** procesos de empresa.
> **Prácticas:** terminal simulada (regex + mockOutput) — el curso es `language: bash`,
> sin motor de ejecución nuevo.

---

## Hilo conductor

El equipo que mantiene **el sistema de la clínica** (el mismo universo de SQL, Redes y
Python). El alumno entra como integrante nuevo: recibe incidencias, abre ramas, pide
revisión, integra, publica versiones y se recupera de un error en producción.
Los tickets tienen forma real: `CLI-142: agregar recuperación de contraseña`.

---

## Precisiones vinculantes (atraviesan todo el curso)

El equivalente a las precisiones de Oracle. Cada una se enseña, se ejemplifica y se
evalúa:

1. **`git add` NO significa "subir"** — prepara, no publica. (Objetivo conceptual
   explícito del bloque de las tres áreas.)
2. **Un commit no es "guardar"**: es una unidad lógica de cambio, con autor, fecha,
   mensaje, árbol y commit anterior.
3. **Una rama es una referencia ligera a un commit**, no una copia del proyecto.
4. **Un conflicto no es un error**: es Git pidiendo una decisión humana que no puede
   tomar solo.
5. **`git pull` = `fetch` + `merge`** — una operación compuesta, no una primitiva.
6. **`.gitignore` no des-rastrea lo ya rastreado**: ignorar ≠ eliminar del índice.
7. **Un commit borrado del historial NO garantiza que el secreto deje de existir** →
   se **revoca/rota** la credencial expuesta. (Regla de seguridad central del curso.)
8. **No se reescribe historia pública** — `amend`, `rebase` y `push --force` sobre lo ya
   compartido. `--force-with-lease` solo con criterio.
9. **`revert` para lo público, `reset` para lo local** — con la tabla imprescindible
   (`--soft` / `--mixed` / `--hard`).
10. **`reflog` es local, no es respaldo y sus entradas expiran.**
11. **Conventional Commits es una convención de EQUIPO, no una regla de Git.**
12. **Ningún flujo de ramas es universalmente superior**: se elige por tamaño de equipo,
    frecuencia de despliegue, regulación y complejidad de liberación.
13. **`switch` es el comando moderno para cambiar de rama**; `checkout` conserva
    responsabilidades más amplias.
14. **Rama ≠ tag ≠ release ≠ despliegue** — cuatro conceptos que se confunden.

---

## Estructura: 7 módulos

Cada módulo cierra con su **examen de región** (patrón de la plataforma). Las cinco
prácticas guiadas del temario de Karen conservan su ubicación exacta.

### M1 · Fundamentos y el primer commit
*(Unidad 1 · bloques 1–6 · Práctica 1)*

| Lección | Contenido |
|---|---|
| l01 | ¿Qué problema resuelve el control de versiones? Las copias (`proyecto-final-v2-ahora-si`), trazabilidad, recuperación. Git (distribuido) frente a GitHub/GitLab. **Caso de empresa:** un cambio rompió una función — ¿quién, cuándo, por qué, qué archivos, cómo se vuelve atrás? |
| l02 | Instalación, configuración e identidad. `git --version`, `git config` global vs local, `user.name` / `user.email`, `init.defaultBranch main`, `git config --list`. Por qué la identidad importa. |
| l03 | Crear un repositorio. Directorio normal vs repositorio, la carpeta `.git` (y por qué no se edita a mano), `git init`, `git status`. |
| l04 | **Las tres áreas + HEAD** — *Diagrama 1.1*. Directorio de trabajo → staging → repositorio local. Estados: modificado, preparado, confirmado. **Precisión 1: `add` no es "subir".** |
| l05 | El primer commit. `git add` (uno / varios), `git commit -m`. Qué contiene un commit. **Precisión 2:** el commit como unidad lógica; mensajes que dicen algo (`cambios` / `arreglos` ✗). |
| l06 | Consultar el historial. `git log`, `--oneline`, `--graph --decorate --all`. Hash, autor, fecha, mensaje, relación entre commits. |
| l07 | **Práctica 1 — Mi primer historial.** README + archivo principal + hoja de estilos, tres commits separados, estado final limpio. |
| x01 | Examen de región (11). |

### M2 · Historial profesional
*(Unidad 2 · bloques 7–13 · Práctica 2 · **evaluación intermedia**)*

| Lección | Contenido |
|---|---|
| l01 | Ciclo de vida de un archivo: untracked, tracked, modified, staged, unmodified. Leer `git status` como un mapa. |
| l02 | Preparación selectiva y **commits atómicos**. `git restore --staged`, por qué `git add .` no siempre. **Proceso de empresa:** separar corrección, cambio visual, refactor y documentación. |
| l03 | Comparar con `git diff` y `git diff --staged`. Leer un diff, detectar el cambio accidental **antes** de confirmarlo. |
| l04 | Mensajes de commit profesionales: asunto, imperativo, contexto, relación con la incidencia. **Conventional Commits** (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`) — **Precisión 11: convención de equipo, no regla de Git.** |
| l05 | `.gitignore`: dependencias, artefactos, config local, logs, `.env`. **Precisión 6** (ignorar ≠ des-rastrear) y **⚠ Nota de seguridad:** credenciales, tokens, llaves. |
| l06 | Corregir el último commit: `git commit --amend`. **Precisión 8:** corregir historial local vs reescribir historial público. |
| l07 | Etiquetas y versiones: tags ligeros vs anotados, `git tag -a`, `git push origin v1.0.0`, versionado semántico (mayor/menor/parche). |
| l08 | **Práctica 2 — Historial limpio de una funcionalidad.** Estructura → comportamiento → corrección → documentación → tag. |
| x01 | **Evaluación intermedia** (examen ampliado — ver decisión 1). |

### M3 · Ramas, fusiones y conflictos
*(Unidad 3 · bloques 14–21 · Práctica 3)*

| Lección | Contenido |
|---|---|
| l01 | Qué es una rama — *Diagrama 3.1* (grafo de commits). **Precisión 3:** referencia ligera, no copia. HEAD, divergencia. **Caso:** `CLI-142` → `feature/CLI-142-recuperar-contrasena`. |
| l02 | Crear y cambiar: `git branch`, `git switch`, `git switch -c`. **Precisión 13:** `switch` vs el `checkout` histórico. Qué pasa con el directorio al cambiar de rama. |
| l03 | Flujo de trabajo por funcionalidad: actualizar `main` → ramificar → implementar → revisar diff → commits → integrar → borrar la rama. Convenciones de nombre (`feature/`, `fix/`, `hotfix/`…) — del equipo, no de Git. |
| l04 | Fusionar: `git merge`. **Fast-forward vs merge de tres vías** — *Diagrama 3.2*. El commit de fusión. Historial lineal vs ramificado. |
| l05 | **Conflictos de fusión** (la lección clave del curso). Por qué aparecen, los marcadores `<<<<<<< / ======= / >>>>>>>`, resolución, `git add` + `git commit`, `git merge --abort`. **Precisión 4.** |
| l06 | Prevenir conflictos: ramas pequeñas y de corta vida, integrar seguido, coordinar cambios estructurales, revisar el diff antes de fusionar. |
| l07 | Introducción a `rebase`: qué problema resuelve, merge vs rebase conceptualmente, `--continue` / `--abort`. **Precisión 8** (regla de oro). *Rebase interactivo: fuera de alcance.* |
| l08 | `git stash`: interrumpir sin dejar un commit incompleto. `list`, `pop`, `apply`, `drop`. Cuándo conviene un commit temporal. Caso de hotfix urgente. Riesgo de acumular stashes. |
| l09 | **Práctica 3 — Desarrollo paralelo y conflicto.** Dos ramas tocan lo mismo; provocar, resolver, verificar historial, limpiar ramas. |
| x01 | Examen de región (11). |

### M4 · Remotos y colaboración de empresa
*(Unidad 4 · bloques 22–29 · Práctica 4)*

| Lección | Contenido |
|---|---|
| l01 | Local y remoto — *Diagrama 4.1*. `origin`, `git remote -v`, `git remote add`, `git clone`. `init` vs `clone`. El remoto como punto de encuentro, no como respaldo. |
| l02 | Publicar: `git push -u origin main`, upstream, rama local vs rama de seguimiento remoto, rechazo de push, borrar rama remota. **Nada de `--force` en ramas compartidas.** |
| l03 | Recibir: `git fetch` vs `git pull`. **Precisión 5** (`pull` = `fetch` + `merge`). Inspeccionar antes de integrar; conflictos al actualizar. |
| l04 | **Flujo basado en incidencias:** ticket → criterio de aceptación → rama → commits → push → solicitud → pruebas → revisión → integración → cierre. Trazabilidad tarea ↔ rama ↔ commit ↔ PR. |
| l05 | **Pull Requests / Merge Requests:** rama origen y destino, título, descripción, evidencia, revisores, solicitud de cambios, aprobación, cierre automático de la incidencia. (Mismo proceso, dos nombres: GitHub / GitLab.) |
| l06 | **Revisión de código:** qué se revisa (corrección, claridad, mantenibilidad, seguridad, pruebas, alcance). Revisar el cambio, no a la persona. Distinguir sugerencia / duda / bloqueo. *Ejercicio: clasificar comentarios de revisión.* |
| l07 | **Ramas protegidas y validaciones obligatorias:** prohibir push directo a `main`, exigir PR, revisiones obligatorias, status checks, code owners, restricción de force push. |
| l08 | **Git e integración continua:** qué ocurre al publicar una rama (build, lint, pruebas, análisis), no integrar con validaciones fallidas, actualizar la solicitud tras corregir. *No es un curso de CI/CD: solo el papel de Git en el proceso.* |
| l09 | **Práctica 4 — Flujo completo de equipo** (`DEV-204: validar correo en el registro`). |
| x01 | Examen de región (11). |

### M5 · Recuperación y diagnóstico
*(Unidad 5 · bloques 30–34 · Práctica 5)*

| Lección | Contenido |
|---|---|
| l01 | Restaurar lo no confirmado: `git restore` (desde HEAD / índice / otra referencia), `git restore --staged`. Riesgo real de perder cambios: comprobar el estado antes. |
| l02 | Deshacer en público: `git revert HASH` — el commit inverso que **conserva** el historial. El comando de las ramas compartidas y de producción. |
| l03 | Mover el historial: `git reset --soft / --mixed / --hard`, su relación con HEAD, staging y directorio. **La tabla imprescindible** (bloque de comparación). Riesgos de `--hard`. |
| l04 | `git reflog`: recuperar lo aparentemente perdido, crear una rama de rescate. **Precisión 10:** es local, no es respaldo, expira. |
| l05 | `git bisect`: búsqueda binaria del commit que introdujo el error. `start` / `bad` / `good` / `reset`. |
| l06 | **Práctica 5 — Recuperación de una incidencia en producción.** Elegir la operación segura (`restore` / `reset` / `revert` / rama / hotfix / tag / `bisect`) **y justificarla**. |
| x01 | Examen de región (11). |

### M6 · Git en la empresa: releases, flujos y seguridad
*(Unidad 5 · bloques 35–38)*

| Lección | Contenido |
|---|---|
| l01 | Releases, hotfixes y mantenimiento. **Precisión 14:** rama ≠ tag ≠ release ≠ despliegue. Flujo: incidencia crítica → hotfix → prueba → PR → aprobación → merge → tag → despliegue. |
| l02 | Flujos de ramas de los equipos — *Diagrama 6.1*: trunk-based, GitHub Flow, GitFlow. **Precisión 12:** ninguno es superior; se elige por criterio (tamaño, despliegues, regulación, versiones vivas). |
| l03 | **⚠ Seguridad y errores críticos** (lección central de seguridad). Credenciales y `.env`; **Precisión 7:** borrar el commit no borra el secreto → **revocar**. `--force` vs `--force-with-lease`. Verificar el remoto antes de publicar. |
| l04 | Git en proyectos existentes: clonar, leer README y CONTRIBUTING, identificar la rama principal y las convenciones, ejecutar pruebas antes y después, preparar una contribución **revisable**. |
| x01 | Examen de región (11). |

### M7 · Proyecto integrador
*(Proyecto + **evaluación final**)*

| Lección | Contenido |
|---|---|
| l01 | **El encargo.** Incidencia real en el sistema de la clínica: implementar una funcionalidad y, tras la revisión, corregir un error detectado. |
| l02 | **Práctica — Preparar el trabajo:** rama de funcionalidad, `.gitignore`, tres commits atómicos con mensajes descriptivos. |
| l03 | **Práctica — Colaborar:** publicar la rama, abrir el PR (título, descripción, evidencia), responder a la revisión con nuevos commits. |
| l04 | **Práctica — El conflicto:** integrar `main`, resolver el conflicto sin dejar marcadores, verificar. |
| l05 | **Práctica — Publicar y recuperarse:** integrar, `tag` de versión, y revertir con seguridad un cambio posterior que rompió producción. |
| l06 | Cierre: el flujo completo del ticket al despliegue, y retrospectiva del curso. |
| x01 | **Evaluación final** (examen ampliado — ver decisión 1). |

---

## Cobertura del temario original

| Unidad de Karen | Bloques | Dónde queda |
|---|---|---|
| U1 · Fundamentos | 1–6 + P1 | **M1** completo |
| U2 · Historial profesional | 7–13 + P2 + eval. intermedia | **M2** completo |
| U3 · Ramas, fusiones, conflictos | 14–21 + P3 | **M3** completo |
| U4 · Remotos y colaboración | 22–29 + P4 | **M4** completo |
| U5 · Recuperación y flujo profesional | 30–34 + P5 | **M5** |
| U5 (cont.) | 35–38 | **M6** |
| Proyecto + evaluación final | — | **M7** |

**Los 38 bloques, las 5 prácticas, el proyecto y las dos evaluaciones quedan cubiertos.**

## Diagramas (componente existente, data-driven)

- **1.1** Las tres áreas + HEAD (working → staging → repositorio)
- **3.1** El grafo de commits: la rama como puntero móvil
- **3.2** Fast-forward vs merge de tres vías
- **4.1** Local ↔ remoto: qué mueve `fetch`, `pull` y `push`
- **6.1** Los tres flujos de ramas (trunk-based / GitHub Flow / GitFlow)

## Fuera de alcance (según el temario original)

Rebase interactivo avanzado · submodules · subtrees · worktrees · hooks avanzados ·
firma criptográfica · `filter-repo` · comandos *plumbing* · Git LFS · monorepos ·
cherry-pick complejo · recuperación de repositorios dañados.
(`bisect`, `reflog` y un `rebase` básico **sí** se conservan: tienen aplicación directa
en diagnóstico y recuperación.)

---

## Decisiones pendientes de Karen

1. **Número de preguntas.** Tu tabla sugiere 8–15 por bloque, 20–25 en la evaluación
   intermedia y 30–35 en la final. La plataforma hoy usa **3 quizzes por lección + 11 en
   el examen de módulo**. Propongo: mantener el ritmo de 3–4 quizzes por lección (más
   preguntas por lección producen fatiga y repetición en conceptos simples — tú misma lo
   señalas), y **honrar tus números en los exámenes**: 11 en los exámenes de región,
   **~20 en la evaluación intermedia (M2)** y **~30 en la evaluación final (M7)**, con XP
   proporcional (40 / 60 / 80).
2. **GitHub y GitLab.** Enseñar el concepto una vez con ambos nombres ("Pull Request en
   GitHub, Merge Request en GitLab — el mismo proceso") y usar **GitHub como el ejemplo
   concreto**, sin convertir el curso en un tutorial de su interfaz web.
3. **Nivel del curso.** Tu temario llega a intermedio (`bisect`, `reflog`, `rebase`, CI,
   GitFlow) y el catálogo lo tiene como `nivel: basico` con el subtítulo "Tu historial
   bajo control". Propongo **un solo curso, inicial → intermedio**, y actualizar
   descripción y nivel en el catálogo para que el alumno sepa a qué entra.
