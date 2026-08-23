import { NextRequest, NextResponse } from 'next/server';
import { sql, isDbConfigured } from '@/lib/db';
import { Objeto, ObjetoInput } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

// Referencia a los objetos en memoria para desarrollo cuando no hay conexión a Neon
const objetosEnMemoria = mockObjetos;

// PUT /api/objetos/[id] - Actualizar un objeto existente
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

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
      const index = objetosEnMemoria.findIndex(obj => obj.id === id);

      if (index === -1) {
        return NextResponse.json(
          { error: 'Objeto no encontrado' },
          { status: 404 }
        );
      }

      const objetoActualizado: Objeto = {
        ...objetosEnMemoria[index],
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        ubicacion: body.ubicacion,
        updated_at: new Date().toISOString()
      };

      objetosEnMemoria[index] = objetoActualizado;
      return NextResponse.json({ objeto: objetoActualizado }, { status: 200 });
    }

    // Actualizar el objeto en la base de datos Neon
    const rows = await sql`
      UPDATE objetos
      SET nombre = ${body.nombre},
          descripcion = ${body.descripcion || ''},
          ubicacion = ${body.ubicacion},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, nombre, descripcion, ubicacion, created_at, updated_at
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Objeto no encontrado' },
        { status: 404 }
      );
    }

    const objeto = rows[0] as unknown as Objeto;
    return NextResponse.json({ objeto }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar objeto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el objeto' },
      { status: 500 }
    );
  }
}

// GET /api/objetos/[id] - Obtener un objeto por su ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Usar datos de ejemplo en desarrollo si no hay conexión a Neon
    if (!isDbConfigured || !sql) {
      const objeto = objetosEnMemoria.find(obj => obj.id === id);

      if (!objeto) {
        return NextResponse.json(
          { error: 'Objeto no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ objeto }, { status: 200 });
    }

    // Obtener el objeto de Neon
    const rows = await sql`
      SELECT id, nombre, descripcion, ubicacion, created_at, updated_at
      FROM objetos
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Objeto no encontrado' },
        { status: 404 }
      );
    }

    const objeto = rows[0] as unknown as Objeto;
    return NextResponse.json({ objeto }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener objeto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el objeto' },
      { status: 500 }
    );
  }
}
