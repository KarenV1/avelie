# Autenticación y Supabase · CodeQuest

> Estado verificado el 2026-07-02 contra el proyecto Supabase real.

## Flujo de acceso

El acceso a CodeQuest **requiere cuenta**. `App.jsx` actúa como puerta:

| Estado de sesión | Qué se muestra |
|---|---|
| Cargando (`loading`) | Pantalla de espera con Byte pulsando (`.auth-loading`) |
| Sin sesión | Solo `Welcome` (umbral), `/login` y `/restablecer` |
| Con sesión | La app completa con navbar |

- **Welcome** (`src/pages/Welcome.jsx`): marca + Byte + "Comenzar" (abre login en modo registro) y "Ya tengo cuenta" (login).
- **Login** (`src/pages/Login.jsx`): tres modos en una pantalla — `login`, `register`, `reset` (recuperar contraseña). Errores de Supabase traducidos a español en `friendlyError()`.
- **ResetPassword** (`src/pages/ResetPassword.jsx`, ruta `/restablecer`): define la nueva contraseña; requiere la sesión temporal que crea el enlace del correo. Sin ella muestra "enlace no válido".
- Con sesión activa, visitar `/login` redirige a `/`.

## Registro con confirmación por correo

1. El usuario se registra → `supabase.auth.signUp()`.
2. Supabase envía el correo de confirmación (verificado: `mailer_autoconfirm: false` — **la confirmación está ACTIVA**, nadie entra sin validar su email).
3. La pantalla muestra "Revisa tu correo" con el email enviado.
4. Al hacer clic en el enlace, la app se abre con sesión iniciada (el cliente detecta el token en la URL automáticamente).

## Recuperación de contraseña

1. En login → "¿Olvidaste tu contraseña?" → modo `reset` (solo email).
2. `resetPasswordForEmail(email, { redirectTo: origin + '/restablecer' })`.
3. El enlace del correo abre `/restablecer` con sesión de recuperación.
4. `updateUser({ password })` guarda la nueva contraseña → pantalla de éxito con Byte celebrando.

## AuthContext (`src/context/AuthContext.jsx`)

Provee: `session`, `user`, `loading`, `signIn`, `signUp`, `signOut`, `resetPassword`, `updatePassword`.
`session === undefined` significa "aún cargando"; `null` significa "sin sesión".

## Configuración

`.env.local` (no se versiona):

```
VITE_SUPABASE_URL=<Project URL>
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Cliente singleton en `src/lib/supabase.js`. La anon key es pública por diseño; RLS protege los datos.

## Base de datos

### Tablas y funciones que usa la app (`src/utils/supabaseProgress.js`)

| Objeto | Estado verificado | Uso |
|---|---|---|
| `user_mistakes` (tabla) | ✅ Existe, RLS activo | Errores por pregunta; se leen agregados por bloque para "Modo Debug" |
| `increment_mistake` (RPC) | ✅ Existe, rechaza anónimos | Insert/incremento atómico de `error_count`; usa `auth.uid()` interno |
| `user_progress` (tabla) | ❌ **NO existía** — migración pendiente | Items completados + XP; upsert con `onConflict: user_id,course_id,item_id` |

### Migración pendiente

**Ejecutar `supabase/migrations/001_user_progress.sql` en el SQL Editor del dashboard.**
Sin ella, el progreso (lecciones/XP) solo se guarda en localStorage; la sincronización
a la nube falla silenciosamente (warning en consola).

### Seguridad verificada

- Lectura anónima de `user_mistakes` → devuelve `[]` (RLS correcto, nunca datos ajenos).
- RPC sin sesión → error "usuario no autenticado".
- El esquema REST no es visible para el rol anónimo (401 en el spec).
- `disable_signup: false` (el registro está abierto) y proveedor email activo.

## Sincronización de progreso (dual)

`ProgressContext` guarda siempre en localStorage y, con sesión, sincroniza con Supabase:

- Al completar item → upsert en `user_progress` (cuando exista la tabla).
- Al fallar pregunta → RPC `increment_mistake`.
- Al iniciar sesión → merge local+remoto (`mergeProgress`/`mergeErrors`: unión de completados, XP máximo, error count máximo, fecha más reciente).
