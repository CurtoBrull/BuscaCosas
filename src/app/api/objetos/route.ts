import { NextRequest, NextResponse } from 'next/server';
import { sql, isDbConfigured } from '@/lib/db';
import { buscarObjetos } from '@/lib/utils';
import { Objeto, ObjetoInput } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

// Variable para almacenar objetos en memoria durante el desarrollo si no hay BBDD
let objetosEnMemoria = [...mockObjetos];

// GET /api/objetos - Buscar objetos por texto
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    
    let objetos: Objeto[] = [];
    
    // Usar datos de ejemplo en desarrollo si no hay conexión configurada a Neon
    if (!isDbConfigured || !sql) {
      objetos = query ? buscarObjetos(objetosEnMemoria, query) : objetosEnMemoria;
      return NextResponse.json({ objetos }, { status: 200 });
    }
    
    // Obtener todos los objetos de la base de datos Neon
    const rows = await sql`
      SELECT id, nombre, descripcion, ubicacion, created_at, updated_at
      FROM objetos
      ORDER BY created_at DESC
    `;
    
    const data = rows as unknown as Objeto[];
    
    // Si hay un query, filtrar los resultados
    objetos = query ? buscarObjetos(data, query) : data;
    
    return NextResponse.json({ objetos }, { status: 200 });
  } catch (error) {
    console.error('Error al buscar objetos:', error);
    return NextResponse.json(
      { error: 'Error al buscar objetos' },
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
    
    // Usar datos de ejemplo en desarrollo si no hay conexión a Neon
    if (!isDbConfigured || !sql) {
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
      { error: 'Error al agregar el objeto' },
      { status: 500 }
    );
  }
}
