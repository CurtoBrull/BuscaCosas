import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Objeto, ObjetoInput } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

// Referencia a los objetos en memoria desde el archivo principal.
// Esto es solo para desarrollo cuando no hay conexión a Supabase.
const objetosEnMemoria = mockObjetos;

// Función para determinar si estamos usando datos de ejemplo.
const usarDatosEjemplo = () => {
  return process.env.NODE_ENV === 'development' &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example'));
};

// PUT /api/objetos/[id] - Actualizar un objeto existente.
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body: ObjetoInput = await request.json();

    // Validar los datos de entrada.
    if (!body.nombre || !body.ubicacion) {
      return NextResponse.json(
        { error: 'El nombre y la ubicación son obligatorios' },
        { status: 400 }
      );
    }

    // Usar datos de ejemplo en desarrollo si no hay conexión a Supabase.
    if (usarDatosEjemplo()) {
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

    // Actualizar el objeto en la base de datos.
    const { data, error } = await supabase
      .from('objetos')
      .update({
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        ubicacion: body.ubicacion,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Objeto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ objeto: data }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar objeto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el objeto' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    // Usar datos de ejemplo en desarrollo si no hay conexión a Supabase.
    if (usarDatosEjemplo()) {
      const objeto = objetosEnMemoria.find(obj => obj.id === id);

      if (!objeto) {
        return NextResponse.json(
          { error: 'Objeto no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({ objeto }, { status: 200 });
    }

    // Obtener el objeto de la base de datos.
    const { data, error } = await supabase
      .from('objetos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Objeto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ objeto: data }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener objeto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el objeto' },
      { status: 500 }
    );
  }
}
