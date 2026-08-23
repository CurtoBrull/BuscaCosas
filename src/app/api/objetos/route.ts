import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { buscarObjetos } from '@/lib/utils';
import { Objeto, ObjetoInput } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// Variable para almacenar objetos en memoria durante el desarrollo si no hay BBDD
let objetosEnMemoria = [...mockObjetos];

// GET /api/objetos - Buscar objetos por texto
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const sql = getDb();
    
    // Si no hay conexión configurada a Neon
    if (!sql) {
      if (process.env.NODE_ENV === 'development') {
        const objetos = query ? buscarObjetos(objetosEnMemoria, query) : objetosEnMemoria;
        return NextResponse.json({ objetos }, { status: 200 });
      }
      return NextResponse.json(
        { error: 'DATABASE_URL no está configurada en las variables de entorno' },
        { status: 500 }
      );
    }
    
    // Obtener todos los objetos de la base de datos Neon
    const rows = await sql`
      SELECT id, nombre, descripcion, ubicacion, created_at, updated_at
      FROM objetos
      ORDER BY created_at DESC
    `;
    
    const data = rows as unknown as Objeto[];
    
    // Si hay un query, filtrar los resultados
    const objetos = query ? buscarObjetos(data, query) : data;
    
    return NextResponse.json({ objetos }, { status: 200 });
  } catch (error) {
    console.error('Error al buscar objetos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al buscar objetos en la base de datos' },
      { status: 500 }
    );
  }
}

// POST /api/objetos - Agregar un nuevo objeto
export async function POST(request: NextRequest) {
  try {
    const body: ObjetoInput = await request.json();
    
    // Validar los datos de entrada
    if (!body.nombre || !body.ubicacion) {
      return NextResponse.json(
        { error: 'El nombre y la ubicación son obligatorios' },
        { status: 400 }
      );
    }
    
    const sql = getDb();
    
    // Si no hay conexión configurada a Neon
    if (!sql) {
      if (process.env.NODE_ENV === 'development') {
        const nuevoObjeto: Objeto = {
          id: objetosEnMemoria.length > 0 ? Math.max(...objetosEnMemoria.map(o => o.id)) + 1 : 1,
          nombre: body.nombre,
          descripcion: body.descripcion || '',
          ubicacion: body.ubicacion,
          created_at: new Date().toISOString(),
          updated_at: null
        };
        
        objetosEnMemoria = [nuevoObjeto, ...objetosEnMemoria];
        return NextResponse.json({ objeto: nuevoObjeto }, { status: 201 });
      }
      return NextResponse.json(
        { error: 'DATABASE_URL no está configurada en las variables de entorno' },
        { status: 500 }
      );
    }

    // Insertar el objeto en la base de datos Neon
    const rows = await sql`
      INSERT INTO objetos (nombre, descripcion, ubicacion)
      VALUES (${body.nombre}, ${body.descripcion || ''}, ${body.ubicacion})
      RETURNING id, nombre, descripcion, ubicacion, created_at, updated_at
    `;
    
    const objeto = rows[0] as unknown as Objeto;
    
    return NextResponse.json({ objeto }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar objeto:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al agregar objeto en la base de datos' },
      { status: 500 }
    );
  }
}
