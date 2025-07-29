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
    // Mock implementations to avoid deep nesting
    const mockOrder = () => Promise.resolve({ data: [], error: null });
    const mockEq = () => Promise.resolve({ data: [], error: null });
    const mockSingle = () => Promise.resolve({ data: null, error: null });

    const mockSelect = () => ({
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
    });

    const mockUpdate = () => ({
      eq: () => ({
        select: () => ({
          single: mockSingle,
        }),
      }),
    });

    const mockInsert = () => ({
      select: () => ({
        single: mockSingle,
      }),
    });

    const mockFrom = () => ({
      select: mockSelect,
      update: mockUpdate,
      insert: mockInsert,
    });

    supabase = {
      from: mockFrom,
    } as unknown as ReturnType<typeof createClient<Database>>;
  }
}

export { supabase };
