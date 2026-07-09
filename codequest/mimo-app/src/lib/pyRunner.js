// src/lib/pyRunner.js
// Motor de ejecución de Python real para las prácticas: Pyodide (CPython
// compilado a WebAssembly) corriendo en un Web Worker.
//   · Versión FIJADA: el contenido del curso se valida contra un Python
//     conocido — nunca cargar "latest".
//   · Carga perezosa: nada se descarga hasta la primera práctica Python
//     (o la precarga explícita al montar PracticeScreen).
//   · Singleton por sesión: la instancia vive mientras viva la pestaña;
//     el arranque (~5-8 s la primera vez) se paga una sola vez.
//   · Watchdog: si el código del alumno no termina (bucle infinito), el
//     worker se termina y se recrea; la app nunca se congela.
//   · input() se alimenta desde una cola de entradas definida por el
//     ejercicio (estilo check50) — sin diálogos.
//   · archivos: los datasets del curso (public/datasets/) se descargan
//     al sistema de archivos del intérprete ANTES de ejecutar, para que
//     el alumno haga open("pacientes.csv") como Python estándar puro.
const VERSION_PYODIDE = 'v314.0.2'
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${VERSION_PYODIDE}/full/`
const TIMEOUT_EJECUCION_MS = 10000
const TIMEOUT_CARGA_MS = 120000 // primera descarga en móvil lento

// URL base de los datasets del curso: relativa al dominio de la app
// (mismo origen), con respaldo absoluto para contextos sin location.
const BASE_ARCHIVOS = (() => {
  try {
    return new URL('/datasets/', globalThis.location.origin).href
  } catch {
    return 'https://codequest-coral.vercel.app/datasets/'
  }
})()

// El worker se crea desde un Blob para no tocar la config del bundler.
// OJO: es un template literal — no usar ${} dentro salvo INDEX_URL.
const codigoWorker = `
const INDEX_URL = '${INDEX_URL}'
let listo = null
let pyodideCargado = false
const archivosCargados = new Set()

async function asegurar() {
  listo ??= (async () => {
    const { loadPyodide } = await import(INDEX_URL + 'pyodide.mjs')
    const py = await loadPyodide({ indexURL: INDEX_URL })
    pyodideCargado = true
    return py
  })()
  return listo
}

// Descarga los archivos del curso al sistema de archivos del intérprete
// (una vez por sesión): el código del alumno los abre con open() normal.
async function cargarArchivos(py, archivos, base) {
  for (const nombre of archivos ?? []) {
    if (archivosCargados.has(nombre)) continue
    const respuesta = await fetch(base + nombre)
    if (!respuesta.ok) throw new Error('No se pudo cargar el archivo del curso: ' + nombre)
    py.FS.writeFile(nombre, new Uint8Array(await respuesta.arrayBuffer()))
    archivosCargados.add(nombre)
  }
}

self.onmessage = async (e) => {
  const { id, tipo, codigo, entradas, archivos, baseArchivos } = e.data
  const salida = []
  try {
    const py = await asegurar()
    if (tipo === 'precarga') {
      self.postMessage({ id, ok: true, salida })
      return
    }
    await cargarArchivos(py, archivos, baseArchivos)
    py.setStdout({ batched: (linea) => salida.push(linea) })
    py.setStderr({ batched: (linea) => salida.push(linea) })
    const cola = [...(entradas ?? [])]
    py.setStdin({ stdin: () => (cola.length ? cola.shift() : '') })

    // globals frescos por ejecución: una práctica no contamina a otra
    const globals = py.globals.get('dict')()
    try {
      await py.runPythonAsync(codigo, { globals })
      self.postMessage({ id, ok: true, salida })
    } finally {
      globals.destroy()
    }
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      salida,
      error: String(err?.message ?? err),
      cargaFallida: !pyodideCargado,
    })
  }
}
`

let worker = null
let precarga = null
let secuencia = 0
const pendientes = new Map()

function crearWorker() {
  const blob = new Blob([codigoWorker], { type: 'text/javascript' })
  worker = new Worker(URL.createObjectURL(blob), { type: 'module' })
  worker.onmessage = (e) => {
    const p = pendientes.get(e.data.id)
    if (!p) return
    pendientes.delete(e.data.id)
    clearTimeout(p.temporizador)
    p.resolver(e.data)
  }
}

// Mata el worker (bucle infinito) y resuelve todo lo pendiente como timeout.
function abortarWorker() {
  worker?.terminate()
  worker = null
  precarga = null
  for (const [, p] of pendientes) {
    clearTimeout(p.temporizador)
    p.resolver({ ok: false, salida: [], timeout: true })
  }
  pendientes.clear()
}

function enviar(mensaje, timeoutMs) {
  if (!worker) crearWorker()
  const id = ++secuencia
  return new Promise((resolver) => {
    const temporizador = setTimeout(() => {
      pendientes.delete(id)
      abortarWorker()
      resolver({ ok: false, salida: [], timeout: true })
    }, timeoutMs)
    pendientes.set(id, { resolver, temporizador })
    worker.postMessage({ id, ...mensaje })
  })
}

// El traceback de Pyodide trae frames internos; el alumno solo necesita
// desde su propio código ("<exec>") hacia abajo.
function limpiarTraceback(error) {
  const lineas = String(error ?? '').split('\n').filter((l) => l !== '')
  const desde = lineas.findIndex((l) => l.includes('<exec>'))
  if (desde === -1) return lineas.slice(-3)
  return ['Traceback (most recent call last):', ...lineas.slice(desde)]
}

// Descarga y arranca Pyodide en segundo plano (llamar al entrar a una
// práctica Python, mientras el alumno lee las instrucciones).
export function precargarPython() {
  precarga ??= enviar({ tipo: 'precarga' }, TIMEOUT_CARGA_MS)
  return precarga
}

// Ejecuta código del alumno. `archivos` = datasets del curso que deben
// existir en el sistema de archivos antes de correr. Devuelve:
//   { ok, salida: [líneas], traceback?: [líneas], timeout?, cargaFallida? }
export async function ejecutarPython(codigo, entradas, archivos) {
  const carga = await precargarPython()
  if (carga.timeout || carga.cargaFallida) {
    precarga = null // permitir reintento en la próxima ejecución
    return { ok: false, salida: [], cargaFallida: true }
  }
  const r = await enviar(
    { tipo: 'run', codigo, entradas, archivos, baseArchivos: BASE_ARCHIVOS },
    TIMEOUT_EJECUCION_MS,
  )
  if (r.timeout) return { ok: false, salida: [], timeout: true }
  if (r.cargaFallida) return { ok: false, salida: [], cargaFallida: true }
  if (!r.ok) return { ok: false, salida: r.salida, traceback: limpiarTraceback(r.error) }
  return { ok: true, salida: r.salida }
}
