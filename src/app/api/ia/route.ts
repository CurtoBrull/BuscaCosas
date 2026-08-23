import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { simularRespuestaIA } from '@/lib/utils';
import { Objeto } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

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
    const sql = getDb();
    
    // Usar datos de ejemplo en desarrollo si no hay conexión a Neon
    if (!sql) {
      if (process.env.NODE_ENV === 'development') {
        objetos = mockObjetos;
      } else {
        return NextResponse.json(
          { error: 'DATABASE_URL no está configurada en las variables de entorno' },
          { status: 500 }
        );
      }
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
      { error: error instanceof Error ? error.message : 'Error al procesar la pregunta' },
      { status: 500 }
    );
  }
}
