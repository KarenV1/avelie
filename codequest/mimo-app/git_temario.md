Este enfoque coincide con los flujos documentados por Git, GitHub y GitLab: Git utiliza ramas para separar líneas de trabajo; las solicitudes de integración centralizan la revisión y discusión de cambios; y las ramas protegidas permiten exigir revisiones y verificaciones antes de integrar código.

1. Objetivo general

Al finalizar el curso, el estudiante será capaz de utilizar Git de manera segura en proyectos individuales y colaborativos, comprendiendo:

Cómo registra Git los cambios.
Cómo crear un historial de trabajo claro.
Cómo utilizar ramas.
Cómo resolver conflictos.
Cómo colaborar mediante repositorios remotos.
Cómo participar en procesos de Pull Request o Merge Request.
Cómo deshacer errores sin destruir el trabajo del equipo.
Cómo seguir convenciones profesionales de commits, ramas y revisión.
Cómo relacionar Git con procesos empresariales como incidencias, revisión de código, integración continua y liberaciones.
2. Resultados de aprendizaje

Al terminar el curso, el estudiante podrá:

Crear y configurar un repositorio Git.
Diferenciar directorio de trabajo, área de preparación y repositorio.
Registrar cambios mediante commits pequeños y descriptivos.
Consultar el historial y comparar versiones.
Crear, cambiar, fusionar y eliminar ramas.
Resolver conflictos de fusión.
Conectar un repositorio local con GitHub o GitLab.
Utilizar correctamente fetch, pull y push.
Crear y revisar una Pull Request o Merge Request.
Recuperarse de errores mediante restore, revert, reset y reflog.
Utilizar etiquetas para identificar versiones.
Aplicar un flujo de trabajo colaborativo semejante al de un equipo de desarrollo.
Identificar prácticas inseguras, como reescribir una rama pública sin coordinación.
Estructura recomendada

Propongo dividir el curso en 5 unidades, con 30 bloques teóricos, 5 prácticas guiadas, 1 evaluación intermedia y 1 proyecto integrador.

La estructura mantiene bloques relativamente pequeños para que cada concepto tenga explicación, ejemplo, simulación de terminal y preguntas suficientes, sin concentrar demasiados comandos en una sola lección.

UNIDAD 1. Fundamentos de control de versiones
Propósito

Comprender qué problema resuelve Git, cómo representa los cambios y cuál es el ciclo básico de trabajo local.

Git no almacena únicamente una secuencia de archivos completos; conceptualmente registra estados del proyecto y utiliza referencias para identificar commits y ramas. Comprender este modelo reduce errores posteriores con ramas, HEAD, restauraciones y fusiones.

Bloque 1. ¿Qué problema resuelve el control de versiones?
Contenidos
Qué es el control de versiones.
Problemas de trabajar con copias como:
proyecto-final.
proyecto-final-ahora-si.
proyecto-final-v2.
Historial de cambios.
Trazabilidad.
Colaboración.
Recuperación de versiones.
Git frente a servicios como GitHub y GitLab.
Git como herramienta distribuida.
Caso empresarial

Una persona modifica una función y provoca un error. El equipo necesita identificar:

Quién hizo el cambio.
Cuándo se hizo.
Por qué se hizo.
Qué archivos fueron afectados.
Cómo recuperar la versión anterior.
Práctica simulada

Identificar qué problemas pueden resolverse con Git en un proyecto compartido.

Bloque 2. Instalación, configuración e identidad
Contenidos
Instalación de Git.
Verificación:
git --version
Configuración de nombre y correo:
git config --global user.name "Karen Vargas"
git config --global user.email "correo@ejemplo.com"
Configuración global y local.
Consulta de configuración:
git config --list
Importancia de la identidad del autor.
Editor predeterminado.
Configuración de rama inicial:
git config --global init.defaultBranch main
Buena práctica

Usar una dirección de correo asociada con la cuenta del servicio remoto cuando se quiera vincular correctamente la actividad.

Bloque 3. Crear un repositorio
Contenidos
Directorio normal frente a repositorio Git.
Carpeta oculta .git.
Inicialización:
git init
Estado inicial:
git status
Qué información conserva .git.
Por qué no debe editarse manualmente.
Práctica simulada

Crear un repositorio e interpretar la salida de git status.

Bloque 4. Las tres áreas de Git
Contenidos
Directorio de trabajo.
Área de preparación o staging area.
Repositorio local.
Archivo modificado.
Archivo preparado.
Archivo confirmado.
Flujo:
Working directory → Staging area → Repository
HEAD como referencia al commit actual.
Comandos
git status
git add archivo.js
git commit
Objetivo conceptual

Evitar que el estudiante piense que git add significa “subir” archivos.

Bloque 5. Primer commit
Contenidos
Crear archivos.
Preparar un archivo:
git add index.html
Preparar varios archivos:
git add .
Crear un commit:
git commit -m "Crea estructura inicial del proyecto"
Qué contiene un commit.
Autor, fecha, mensaje, árbol y commit anterior.
Commit como unidad lógica de cambio.
Convención inicial

Los mensajes deben explicar qué cambio incorpora el commit, no describir una acción vaga.

Evitar:

cambios
arreglos
cosas nuevas
commit final

Preferir:

Agrega validación al formulario de registro
Corrige cálculo del total del carrito
Crea estructura inicial de navegación
Bloque 6. Consultar el historial
Contenidos
Historial básico:
git log
Historial resumido:
git log --oneline
Historial gráfico:
git log --oneline --graph --decorate --all
Hash de commit.
Autor.
Fecha.
Mensaje.
Relación entre commits.
Práctica 1. Mi primer historial
Escenario

Crear un pequeño proyecto con:

Archivo README.md.
Archivo principal.
Hoja de estilos.
Tres commits separados.
Validación con regex y mockOutput

Validar:

git init.
Uso correcto de git add.
Tres commits.
Mensajes no vacíos.
Estado final limpio.
Salida esperada de git log --oneline.
UNIDAD 2. Seguimiento de cambios y construcción de un historial profesional
Propósito

Aprender a seleccionar cambios, inspeccionarlos y construir commits claros, pequeños y recuperables.

Bloque 7. Archivos rastreados y no rastreados
Contenidos
Untracked.
Tracked.
Modified.
Staged.
Unmodified.
Interpretación de git status.
Ciclo de vida de un archivo.
Práctica

Clasificar archivos según diferentes salidas simuladas de git status.

Bloque 8. Preparación selectiva de cambios
Contenidos
Preparar un archivo específico.
Preparar varios archivos.
Retirar un archivo del staging:
git restore --staged archivo.js
Diferencia entre modificación y preparación.
Por qué no siempre debe utilizarse git add ..
Commits atómicos.
Proceso empresarial relacionado

Separar en commits diferentes:

Corrección de un error.
Cambio visual.
Refactorización.
Actualización de documentación.
Bloque 9. Comparar cambios con git diff
Contenidos
Cambios no preparados:
git diff
Cambios preparados:
git diff --staged
Comparación entre commits.
Líneas agregadas y eliminadas.
Lectura básica de un diff.
Detección de cambios accidentales.

La revisión de diferencias antes de confirmar cambios es una habilidad central, ya que git diff permite comparar el directorio de trabajo, el índice y diferentes referencias del historial.

Bloque 10. Mensajes de commit profesionales
Contenidos
Propósito de un mensaje de commit.
Línea de asunto.
Contexto del cambio.
Mensajes en modo imperativo.
Relación con una tarea o incidencia.
Commits pequeños.
Commits atómicos.
Introducción opcional a Conventional Commits:
feat.
fix.
docs.
refactor.
test.
chore.
Ejemplos
feat: agrega filtro de productos por categoría
fix: evita duplicar usuarios durante el registro
docs: documenta variables de entorno
Nota pedagógica

Conventional Commits debe enseñarse como una convención utilizada por algunos equipos, no como una regla interna de Git.

Bloque 11. Ignorar archivos con .gitignore
Contenidos
Archivos que no deben versionarse.
Dependencias.
Archivos generados.
Configuración local.
Logs.
Variables de entorno.
Credenciales.
Creación de .gitignore.

Ejemplo:

node_modules/
dist/
.env
*.log
Archivos ya rastreados.
Diferencia entre ignorar y eliminar.
Riesgo de subir secretos.
Caso empresarial

Evitar versionar:

Contraseñas.
Tokens.
Llaves privadas.
Archivos de configuración local.
Dependencias regenerables.
Bloque 12. Corregir el último commit
Contenidos
Agregar un archivo olvidado.
Modificar el mensaje más reciente:
git commit --amend
Riesgo de modificar commits que ya fueron compartidos.
Diferencia entre corregir historial local y reescribir historial público.
Bloque 13. Etiquetas y versiones
Contenidos
Qué es un tag.
Tags ligeros.
Tags anotados.
Crear una versión:
git tag -a v1.0.0 -m "Primera versión estable"
Consultar tags:
git tag
Subir tags:
git push origin v1.0.0
Relación con versiones y releases.
Introducción a versionado semántico:
Mayor.
Menor.
Parche.
Práctica 2. Historial limpio de una funcionalidad
Escenario

Implementar una pequeña funcionalidad simulada:

Crear estructura.
Añadir comportamiento.
Corregir un error.
Actualizar documentación.
Crear un tag de versión.
Validación
Uso de .gitignore.
Commits separados.
Mensajes descriptivos.
Uso correcto de git diff.
Tag final.
Estado limpio.
Evaluación intermedia 1
Cobertura
Fundamentos.
Estados de archivos.
Staging.
Commits.
Historial.
Diff.
.gitignore.
Amend.
Tags.
Formatos recomendados
Interpretación de terminal.
Selección del comando correcto.
Ordenamiento de pasos.
Identificación de errores.
Simulación regex + mockOutput.
UNIDAD 3. Ramas, fusiones y resolución de conflictos
Propósito

Aprender a desarrollar funcionalidades de forma aislada y a integrarlas de manera segura.

Las ramas permiten separar una línea de trabajo de la rama principal sin alterar inmediatamente el resto del proyecto. Git utiliza referencias ligeras para representar estas líneas de desarrollo.

Bloque 14. Qué es una rama
Contenidos
Línea principal de desarrollo.
Rama main.
Rama como referencia a un commit.
HEAD.
Divergencia del historial.
Ventajas de trabajar por rama.
Una rama por tarea.
Caso empresarial

Una incidencia llamada:

PROJ-142: agregar recuperación de contraseña

Puede originar una rama:

feature/PROJ-142-recuperar-contrasena
Bloque 15. Crear y cambiar de rama
Contenidos
Listar ramas:
git branch
Crear una rama:
git branch feature/login
Cambiar de rama:
git switch feature/login
Crear y cambiar:
git switch -c feature/login
Diferencia entre switch y el uso histórico de checkout.
Estado del directorio al cambiar de rama.

La documentación moderna de Git incluye git switch específicamente para cambiar de rama, mientras que checkout conserva responsabilidades más amplias.

Bloque 16. Flujo de trabajo por funcionalidad
Contenidos

Proceso completo:

Actualizar main.
Crear rama desde main.
Implementar cambios.
Revisar diferencias.
Crear commits.
Actualizar la rama.
Integrar.
Eliminar la rama finalizada.
Nombres recomendados
feature/login
fix/error-total
docs/instalacion
refactor/servicio-usuarios
hotfix/pago-duplicado
Nota

Las convenciones deben ajustarse al equipo; Git no impone una nomenclatura.

Bloque 17. Fusionar ramas
Contenidos
Integrar una rama:
git switch main
git merge feature/login
Fast-forward.
Merge de tres vías.
Commit de merge.
Historial lineal frente a historial con ramas.
Verificación posterior.

Git utiliza fusiones de tres vías cuando las ramas han divergido y el flujo básico de ramas y merges forma parte de los escenarios reales documentados por el proyecto Git.

Bloque 18. Conflictos de fusión
Contenidos
Por qué aparece un conflicto.
Cambios incompatibles.
Marcadores:
<<<<<<< HEAD
=======
>>>>>>> feature/login
Resolución manual.
Preparar archivos resueltos.
Completar merge:
git add archivo.js
git commit
Cancelar una fusión:
git merge --abort
Verificar que el código siga funcionando.
Bloque 19. Prevenir conflictos
Contenidos
Ramas pequeñas y de corta duración.
Actualizarse con frecuencia.
Evitar editar archivos enormes sin coordinación.
Dividir responsabilidades.
Comunicar cambios estructurales.
No posponer la integración durante demasiado tiempo.
Revisar el diff antes de fusionar.
Bloque 20. Introducción a rebase
Contenidos
Qué problema resuelve.
Diferencia conceptual entre merge y rebase.
Reaplicar commits sobre una nueva base:
git rebase main
Resolver conflictos durante rebase.
Continuar:
git rebase --continue
Cancelar:
git rebase --abort
Regla de seguridad: no reescribir una rama pública compartida sin coordinación.

Mientras merge integra los extremos de dos líneas de trabajo, rebase reaplica una serie de cambios sobre una base diferente.

Alcance

Este bloque debe ser introductorio. El rebase interactivo puede dejarse como contenido complementario.

Bloque 21. stash: interrumpir una tarea sin crear un commit incompleto
Contenidos
git stash
git stash list
git stash pop
git stash apply
git stash drop
Cuándo utilizarlo.
Cuándo es mejor crear un commit temporal.
Riesgos de acumular muchos stashes.
Caso de hotfix urgente.
Práctica 3. Desarrollo paralelo y conflicto
Escenario

Dos ramas modifican una misma parte de un archivo.

El estudiante debe:

Crear ramas.
Crear commits diferentes.
Fusionar la primera rama.
Provocar un conflicto con la segunda.
Resolverlo.
Verificar el historial.
Eliminar ramas integradas.
Validación
Secuencia de comandos.
Rama activa.
Mensajes de terminal simulados.
Archivo final sin marcadores.
Historial gráfico correcto.
UNIDAD 4. Repositorios remotos y colaboración empresarial
Propósito

Pasar del uso individual al trabajo colaborativo con GitHub o GitLab.

Bloque 22. Repositorios locales y remotos
Contenidos
Repositorio local.
Repositorio remoto.
origin.
URL del remoto.
Consultar remotos:
git remote -v
Agregar remoto:
git remote add origin URL
Clonar:
git clone URL
Diferencia entre init y clone.
Bloque 23. Publicar cambios con push
Contenidos
git push -u origin main
Upstream.
Publicar una rama.
Rama local frente a rama remota.
Rechazo de push.
Evitar force push en ramas compartidas.
Eliminación de rama remota.

Las ramas de seguimiento remoto son referencias locales que representan el estado observado de las ramas remotas después de comunicarse con el servidor.

Bloque 24. Recibir cambios: fetch y pull
Contenidos
Descargar referencias sin integrar:
git fetch origin
Descargar e integrar:
git pull
Inspeccionar antes de integrar.
pull como operación compuesta.
Diferencia entre:
fetch.
pull.
push.
Conflictos durante la actualización.
Mantener una rama actualizada.
Bloque 25. Flujo basado en incidencias
Proceso empresarial
Se crea una incidencia o ticket.
Se asigna a una persona.
Se analiza el criterio de aceptación.
Se crea una rama.
Se desarrolla la solución.
Se crean commits relacionados.
Se publica la rama.
Se abre una solicitud de integración.
Se ejecutan pruebas.
Se revisa el código.
Se corrigen observaciones.
Se integra el cambio.
Se cierra la incidencia.
Contenidos
Trazabilidad entre tarea, rama, commit y solicitud.
Criterios de aceptación.
Descripción del cambio.
Evidencia de pruebas.
Enlace con la incidencia.
Bloque 26. Pull Requests y Merge Requests
Contenidos
Propósito.
Rama origen y rama destino.
Título.
Descripción.
Cambios incluidos.
Evidencia.
Revisores.
Comentarios.
Solicitud de cambios.
Aprobación.
Integración.
Cierre automático de incidencias.

Las Merge Requests de GitLab sirven como punto central para revisar código, discutirlo y rastrear cambios; el mismo proceso se conoce habitualmente como Pull Request en GitHub.

Bloque 27. Revisión de código
Contenidos
Qué revisar:
Corrección.
Claridad.
Mantenibilidad.
Seguridad.
Pruebas.
Alcance.
Revisar el cambio, no a la persona.
Comentarios claros y respetuosos.
Diferencia entre sugerencia, duda y bloqueo.
Responder observaciones.
Nuevos commits dentro de la misma solicitud.
Aprobación final.
Ejercicio

Clasificar comentarios de revisión como:

Adecuado.
Ambiguo.
Poco profesional.
Bloqueante.
Sugerencia.
Bloque 28. Ramas protegidas y validaciones obligatorias
Contenidos
Prohibir push directo a main.
Exigir Pull Request o Merge Request.
Revisiones obligatorias.
Status checks.
Pruebas automáticas.
Code owners.
Permisos.
Aprobaciones.
Restricción de force push.

GitHub permite proteger ramas y exigir revisiones o verificaciones de estado antes de integrar cambios. GitLab también permite controlar quién puede hacer push o merge y recomienda mayores protecciones para ramas asociadas con producción.

Bloque 29. Git e integración continua
Contenidos
Qué ocurre después de publicar una rama.
Pipeline.
Build.
Lint.
Pruebas.
Análisis de seguridad.
Resultado exitoso o fallido.
No integrar cambios con validaciones fallidas.
Relación entre commits y pipelines.
Actualización de una solicitud después de corregir errores.

GitLab documenta pipelines específicos para Merge Requests, incluidos pipelines sobre la rama origen y pipelines que prueban el resultado de la integración.

Alcance

No es un curso de CI/CD. El estudiante solo debe comprender cómo Git participa en el proceso.

Práctica 4. Flujo completo de equipo
Escenario

Simular una tarea empresarial:

DEV-204: validar correo en el registro
Pasos
Actualizar main.
Crear rama.
Implementar cambios simulados.
Crear dos commits.
Publicar la rama.
Crear una Pull Request simulada.
Detectar una revisión.
Aplicar corrección.
Ejecutar validación simulada.
Integrar.
Eliminar la rama.
Evaluación
Nombre de rama.
Commits.
Push.
Descripción de PR.
Respuesta a revisión.
Estado final.
Historial.
UNIDAD 5. Recuperación, diagnóstico y flujo profesional
Propósito

Aprender a recuperarse de errores y comprender prácticas reales de mantenimiento y liberación.

Bloque 30. Restaurar cambios no confirmados
Contenidos
Restaurar archivo:
git restore archivo.js
Retirar del staging:
git restore --staged archivo.js
Riesgo de perder cambios locales.
Confirmar siempre el estado antes de restaurar.

La documentación de git restore diferencia entre restaurar desde HEAD, desde el índice o desde otra referencia.

Bloque 31. Deshacer un commit con revert
Contenidos
git revert HASH
Crear un nuevo commit inverso.
Conservar el historial.
Uso recomendado en ramas compartidas.
Reversión de cambios en producción.
Diferencia frente a borrar historial.
Bloque 32. Mover el historial con reset
Contenidos
Qué modifica reset.
--soft.
--mixed.
--hard.
Relación con HEAD, staging y directorio de trabajo.
Casos locales.
Riesgos de --hard.
No utilizarlo sin revisar cambios importantes.

git reset modifica la referencia a la que apunta HEAD y puede alterar también el índice y el directorio de trabajo según el modo seleccionado.

Tabla imprescindible
Acción	Historial	Staging	Archivos
reset --soft	Mueve HEAD	Conserva	Conserva
reset --mixed	Mueve HEAD	Limpia preparación	Conserva
reset --hard	Mueve HEAD	Restablece	Restablece
revert	Conserva	Nuevo commit	Aplica inverso
Bloque 33. Recuperar trabajo con reflog
Contenidos
Registro local de movimientos de referencias.
Recuperar commits aparentemente perdidos.
Consultar:
git reflog
Crear una rama de recuperación.
Limitaciones:
Es local.
No es un respaldo permanente.
Sus entradas pueden expirar.
Bloque 34. Encontrar el commit que introdujo un error
Contenidos
Concepto de búsqueda binaria.
Commit bueno.
Commit malo.
Flujo de git bisect:
git bisect start
git bisect bad
git bisect good HASH
Marcar resultados.
Finalizar:
git bisect reset

git bisect utiliza una búsqueda binaria para localizar el cambio que introdujo un fallo entre un commit conocido como bueno y otro conocido como malo.

Bloque 35. Releases, hotfixes y mantenimiento
Contenidos
Release.
Tag.
Rama principal.
Rama de funcionalidad.
Hotfix.
Corrección urgente.
Preparación de versión.
Notas de versión.
Relación con despliegue.
Diferencia entre:
Rama.
Tag.
Release.
Despliegue.
Flujo simplificado
Incidencia crítica
→ rama hotfix
→ corrección
→ prueba
→ Pull Request
→ aprobación
→ merge
→ tag
→ despliegue
Bloque 36. Flujos de ramas utilizados por equipos
Contenidos
Trunk-based development simplificado
Rama principal estable.
Ramas pequeñas.
Integración frecuente.
Uso de feature flags cuando corresponde.
GitHub Flow
Rama desde main.
Pull Request.
Revisión.
Validaciones.
Merge.
Despliegue.
GitFlow
main.
develop.
feature.
release.
hotfix.
Criterio pedagógico

No presentar un flujo como universalmente superior.

El estudiante debe elegir según:

Tamaño del equipo.
Frecuencia de despliegue.
Requisitos regulatorios.
Necesidad de mantener varias versiones.
Complejidad de liberación.
Bloque 37. Seguridad y errores críticos
Contenidos
No subir credenciales.
No versionar .env.
Revocar secretos expuestos.
Un commit eliminado del historial no garantiza que el secreto deje de existir.
Evitar push --force en ramas compartidas.
Uso prudente de --force-with-lease.
Verificar el remoto antes de publicar.
Firmas de commits como contenido complementario.
Dependabot y escaneo fuera del alcance central.
Bloque 38. Git en proyectos existentes
Contenidos
Clonar repositorio.
Leer README.
Revisar CONTRIBUTING.
Revisar convenciones.
Instalar dependencias.
Identificar rama principal.
Crear rama de trabajo.
Ejecutar pruebas antes y después.
No mezclar cambios no relacionados.
Preparar una contribución revisable.
Práctica 5. Recuperación de una incidencia en producción
Escenario

Una versión contiene un error.

El estudiante debe decidir entre:

restore.
reset.
revert.
Nueva rama.
Hotfix.
Tag.
bisect.
Validaciones
Elección segura.
Explicación de por qué.
Conservación del historial.
Flujo de rama.
Integración final.
PROYECTO INTEGRADOR
Proyecto: Flujo de desarrollo de una funcionalidad empresarial
Caso

El estudiante participa en un equipo que desarrolla una aplicación web. Recibe una incidencia para agregar una funcionalidad y posteriormente debe corregir un error detectado durante la revisión.

Entregables
Repositorio inicializado o clonado.
.gitignore.
Rama de funcionalidad.
Mínimo tres commits atómicos.
Mensajes descriptivos.
Historial verificable.
Rama publicada.
Pull Request o Merge Request simulada.
Descripción de cambios.
Evidencia de pruebas.
Corrección solicitada durante code review.
Resolución de un conflicto.
Integración a main.
Eliminación de la rama.
Tag de versión.
Reversión segura de un cambio posterior.
Flujo evaluado
Ticket
→ análisis
→ rama
→ implementación
→ commits
→ push
→ Pull Request
→ revisión
→ correcciones
→ pipeline
→ merge
→ tag
→ hotfix o revert
Evaluación final
Distribución sugerida
Componente	Peso
Preguntas conceptuales	20 %
Interpretación de terminal	20 %
Ejercicios de comandos	20 %
Ramas y conflictos	15 %
Flujo colaborativo	15 %
Recuperación segura	10 %
Criterios de aprobación

El estudiante debe demostrar que:

Comprende el estado del repositorio.
No ejecuta comandos destructivos sin evaluar consecuencias.
Construye commits coherentes.
Trabaja mediante ramas.
Resuelve conflictos.
Diferencia fetch, pull y push.
Comprende Pull Requests y revisiones.
Sabe cuándo utilizar revert en lugar de reset.
Completa un flujo de colaboración.
Número recomendado de preguntas

Para mantener coherencia con el resto de la plataforma:

Tipo de bloque	Preguntas recomendadas
Concepto introductorio	8–10
Bloque de comandos	10–12
Ramas y fusiones	12–15
Colaboración empresarial	10–14
Recuperación y comandos riesgosos	12–15
Práctica guiada	5–8 validaciones
Evaluación intermedia	20–25
Evaluación final	30–35

No recomiendo colocar 15 preguntas en todos los bloques. En conceptos simples provocaría repetición. Los temas críticos, como ramas, conflictos, remotos y recuperación, sí justifican una evaluación más amplia.

Tipos de ejercicios para regex + mockOutput
1. Seleccionar el comando correcto

Ejemplo:

Necesitas retirar app.js del área de preparación sin perder sus cambios.

Respuesta esperada:

git restore --staged app.js

Regex posible:

^git\s+restore\s+--staged\s+app\.js$
2. Validar secuencias

Ejemplo:

Crea una rama llamada feature/login y cambia a ella.

Respuesta válida:

git switch -c feature/login

También podría aceptarse:

git branch feature/login
git switch feature/login
3. Interpretar salidas

Mostrar un mockOutput de:

git status

Y preguntar:

Qué archivos están preparados.
Qué archivos no están rastreados.
Qué ocurrirá al crear el commit.
4. Resolver conflictos

Mostrar:

<<<<<<< HEAD
const limite = 10;
=======
const limite = 20;
>>>>>>> feature/configuracion

Solicitar al estudiante producir el archivo final sin marcadores.

5. Elegir una operación segura

Ejemplo:

Un commit incorrecto ya fue publicado en main.

Opciones:

git reset --hard.
git revert.
Eliminar .git.
Crear una copia manual.

Respuesta esperada:

git revert
Bibliografía principal
Bibliografía obligatoria
1. Pro Git

Scott Chacon y Ben Straub. Pro Git, segunda edición.

Debe ser la referencia principal del curso. Está disponible oficialmente y cubre:

Fundamentos.
Remotos.
Ramas.
Fusiones.
Rebase.
Flujos distribuidos.
Herramientas.
Aspectos internos de Git.

Capítulos prioritarios:

Getting Started.
Git Basics.
Git Branching.
Distributed Git.
Git Tools.
Git Internals, solo como referencia avanzada.
2. Documentación oficial de Git

Utilizar como fuente normativa para:

git init.
git add.
git commit.
git status.
git diff.
git switch.
git restore.
git reset.
git revert.
git merge.
git rebase.
git stash.
git bisect.
git tag.
git reflog.

La documentación oficial debe prevalecer cuando exista una duda sobre el comportamiento de un comando.

3. Documentación oficial de GitHub

Utilizar para:

Pull Requests.
Revisión de código.
Ramas protegidas.
Reglas de rama.
Status checks.
Flujo basado en ramas.
Colaboración mediante incidencias.

Las ramas protegidas de GitHub pueden requerir revisiones y comprobaciones antes de permitir la integración.

4. Documentación oficial de GitLab

Utilizar para:

Merge Requests.
Revisión.
Ramas protegidas.
Roles y permisos.
Pipelines de Merge Request.
Políticas de aprobación.
Relación entre incidencias y solicitudes de integración.
Bibliografía complementaria recomendada
Version Control with Git

Jon Loeliger y Matthew McCullough.

Útil para:

Modelo interno.
Referencias.
Historial.
Ramas.
Repositorios distribuidos.
Git Pocket Guide

Richard E. Silverman.

Útil como referencia rápida de comandos.

Release It!

Michael T. Nygard.

No es un libro centrado en Git, pero aporta contexto sobre:

Liberaciones.
Producción.
Riesgo.
Recuperación.
Operación de sistemas.

Debe utilizarse únicamente como bibliografía contextual para el bloque de releases y hotfixes.

Accelerate

Nicole Forsgren, Jez Humble y Gene Kim.

Útil para relacionar Git con:

Entrega continua.
Integración frecuente.
Tamaño de cambios.
Flujo de entrega.

No debe utilizarse para enseñar la sintaxis de Git.

Continuous Delivery

Jez Humble y David Farley.

Referencia complementaria para:

Pipelines.
Validación automatizada.
Liberaciones.
Integración de cambios.
Temas que dejaría fuera del nivel inicial

Para evitar que “Git desde Cero” se convierta en un curso excesivamente extenso, dejaría como contenido opcional o para un curso posterior:

Rebase interactivo avanzado.
Submodules.
Subtrees.
Worktrees.
Git hooks avanzados.
Firma criptográfica de commits.
filter-repo.
Recuperación de repositorios dañados.
Objetos internos y comandos plumbing.
Administración avanzada de monorepos.
Estrategias complejas de cherry-pick.
Administración de Git LFS.
Mantenimiento y optimización de repositorios grandes.

git bisect, reflog y un rebase básico sí deben conservarse porque tienen aplicación directa en diagnóstico y recuperación. Los submódulos pueden reservarse para un nivel posterior, ya que constituyen un mecanismo específico de gestión de repositorios anidados.

Resumen de la propuesta
Elemento	Cantidad
Unidades	5
Bloques	38
Prácticas guiadas	5
Evaluaciones intermedias	1
Proyecto integrador	1
Evaluación final	1
Nivel	Inicial a intermedio
Enfoque	Trabajo individual y procesos empresariales
Plataforma	Terminal simulada con regex + mockOutput
Servicios de referencia	GitHub y GitLab
Bibliografía base	Pro Git y documentación oficial