'use client';

import React, { useEffect, useState } from 'react';
import { Objeto } from '@/lib/types';
import ObjetoCard from './ObjetoCard';

export default function ListaObjetos() {
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarObjetos = async () => {
      try {
        const response = await fetch('/api/objetos');
        
        if (!response.ok) {
          throw new Error('Error al cargar los objetos');
        }
        
        const data = await response.json();
        setObjetos(data.objetos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    cargarObjetos();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (objetos.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="text-center py-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400 mb-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No hay objetos registrados</h3>
          <p className="text-gray-600">Utiliza el formulario para registrar tus primeros objetos.</p>
        </div>
      </div>
    );
  }

  const handleObjetoUpdate = (objetoActualizado: Objeto) => {
    setObjetos(prevObjetos => 
      prevObjetos.map(obj => 
        obj.id === objetoActualizado.id ? objetoActualizado : obj
      )
    );
  };

  // Ordenar objetos por fecha de creación (más recientes primero)
  const objetosOrdenados = [...objetos].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Todos los objetos ordenados por fecha de creación (más recientes primero)

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Objetos registrados</h2>
      
      {/* Mostrar todos los objetos en un área con scroll */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', overflowY: 'scroll', border: '1px solid #f0f0f0', borderRadius: '0.375rem', padding: '0.5rem' }}>
        {objetosOrdenados.map((objeto) => (
          <ObjetoCard 
            key={objeto.id} 
            objeto={objeto} 
            onUpdate={handleObjetoUpdate} 
          />
        ))}
      </div>
    </div>
  );
}