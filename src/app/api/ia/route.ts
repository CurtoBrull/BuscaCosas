import { NextRequest, NextResponse } from 'next/server';
import { sql, isDbConfigured } from '@/lib/db';
import { simularRespuestaIA } from '@/lib/utils';
import { Objeto } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

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
    
    // Usar datos de ejemplo en desarrollo si no hay conexión a Neon
    if (!isDbConfigured || !sql) {
      objetos = mockObjetos;
    } else {
      // Obtener todos los objetos de la base de datos Neon
      const rows = await sql`
        SELECT id, nombre, descripcion, ubicacion, created_at, updated_at
        FROM objetos
        ORDER BY created_at DESC
      `;
      
      objetos = rows as unknown as Objeto[];
    }
    
    // Simular respuesta de IA
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
