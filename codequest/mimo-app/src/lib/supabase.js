// src/lib/supabase.js
// Cliente Supabase singleton. Importar desde aquí en toda la app.
// La anon key es pública por diseño — RLS protege los datos en Supabase.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn(
    'Supabase no configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local',
  )
}

export const supabase = createClient(url ?? '', key ?? '')
