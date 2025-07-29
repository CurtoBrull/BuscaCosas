import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { simularRespuestaIA } from '@/lib/utils';
import { Objeto } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

// Función para determinar si estamos usando datos de ejemplo
const usarDatosEjemplo = () => {
  return process.env.NODE_ENV === 'development' && 
         (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example'));
};

// POST /api/ia - Procesar consulta en lenguaje natural
export async function POST(request: NextRequest) {
  try {
    const { pregunta } = await request.json();
    
    if (!pregunta || typeof pregunta !== 'string') {
      return NextResponse.json(
        { error: 'La pregunta es obligatoria' },
        { status: 400 }
      );
    }
    
    let objetos: Objeto[] = [];
    
    // Usar datos de ejemplo en desarrollo si no hay conexión a Supabase
    if (usarDatosEjemplo()) {
      objetos = mockObjetos;
    } else {
      // Obtener todos los objetos de la base de datos
      if (!supabase) {
        throw new Error('Supabase no está inicializado');
      }
      const { data, error } = await supabase
        .from('objetos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      objetos = data as Objeto[];
    }
    
    // Simular respuesta de IA (esto será reemplazado por Gemini más adelante)
    const { respuesta, objetosEncontrados } = simularRespuestaIA(pregunta, objetos);
    
    return NextResponse.json({
      respuesta,
      objetos: objetosEncontrados,
    }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar la pregunta:', error);
    return NextResponse.json(
      { error: 'Error al procesar la pregunta' },
      { status: 500 }
    );
  }
}
