import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Crear un cliente de Supabase solo si las variables de entorno están disponibles
let supabase: ReturnType<typeof createClient<Database>> | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Solo crear el cliente si tenemos las credenciales
if (supabaseUrl && supabaseKey && supabaseUrl !== '' && !supabaseUrl.includes('example')) {
  supabase = createClient<Database>(supabaseUrl, supabaseKey);
} else {
  // En desarrollo, crear un objeto simulado para evitar errores
  if (process.env.NODE_ENV === 'development') {
    console.warn('Supabase client not initialized. Using mock client.');
    // Crear un cliente simulado que no hace nada pero no causa errores
    supabase = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          eq: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    } as ReturnType<typeof createClient<Database>>;
  }
}

export { supabase };
