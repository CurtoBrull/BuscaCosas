import { useState, useCallback } from 'react';
import { Objeto, BusquedaResponse, IAResponse, ObjetoInput } from './types';

export function useBusqueda() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Objeto[]>([]);
  const [respuestaIA, setRespuestaIA] = useState<string | null>(null);

  // Función para buscar objetos por texto
  const buscarPorTexto = useCallback(async (texto: string) => {
    if (!texto.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/objetos?q=${encodeURIComponent(texto)}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar objetos');
      }
      
      const data: BusquedaResponse = await response.json();
      setResultados(data.objetos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para buscar con IA (lenguaje natural)
  const buscarConIA = useCallback(async (pregunta: string) => {
    if (!pregunta.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta }),
      });
      
      if (!response.ok) {
        throw new Error('Error al procesar la pregunta');
      }
      
      const data: IAResponse = await response.json();
      setRespuestaIA(data.respuesta);
      setResultados(data.objetos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setRespuestaIA(null);
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para agregar un nuevo objeto
  const agregarObjeto = useCallback(async (nombre: string, descripcion: string, ubicacion: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/objetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, descripcion, ubicacion }),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar el objeto');
      }
      
      const data = await response.json();
      return data.objeto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para actualizar un objeto existente
  const actualizarObjeto = useCallback(async (id: number, objeto: ObjetoInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/objetos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objeto),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el objeto');
      }
      
      const data = await response.json();
      return data.objeto;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    resultados,
    respuestaIA,
    buscarPorTexto,
    buscarConIA,
    agregarObjeto,
    actualizarObjeto,
  };
}