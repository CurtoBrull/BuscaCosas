import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { buscarObjetos } from '@/lib/utils';
import { Objeto, ObjetoInput } from '@/lib/types';
import { mockObjetos } from '@/lib/mockData';

// Variable para almacenar objetos en memoria durante el desarrollo
let objetosEnMemoria = [...mockObjetos];

// Función para determinar si estamos usando datos de ejemplo
const usarDatosEjemplo = () => {
  return process.env.NODE_ENV === 'development' && 
         (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('example'));
};

// GET /api/objetos - Buscar objetos por texto
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    
    let objetos: Objeto[] = [];
    
    // Usar datos de ejemplo en desarrollo si no hay conexión a Supabase
    if (usarDatosEjemplo()) {
      objetos = query ? buscarObjetos(objetosEnMemoria, query) : objetosEnMemoria;
      return NextResponse.json({ objetos }, { status: 200 });
    }
    
    // Obtener todos los objetos de la base de datos
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase
      .from('objetos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Si hay un query, filtrar los resultados
    objetos = query ? buscarObjetos(data as Objeto[], query) : data as Objeto[];
    
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
    
    // Usar datos de ejemplo en desarrollo si no hay conexión a Supabase
    if (usarDatosEjemplo()) {
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
    // Insertar el objeto en la base de datos
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }
    const { data, error } = await supabase
      .from('objetos')
      .insert({
        nombre: body.nombre,
        descripcion: body.descripcion || '',
        ubicacion: body.ubicacion,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ objeto: data }, { status: 201 });
  } catch (error) {
    console.error('Error al agregar objeto:', error);
    return NextResponse.json(
      { error: 'Error al agregar el objeto' },
      { status: 500 }
    );
  }
}
