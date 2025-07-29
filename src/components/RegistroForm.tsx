'use client';

import React, { useState } from 'react';
import { useBusqueda } from '@/lib/hooks';

interface RegistroFormProps {
  onSuccess?: () => void;
}

export default function RegistroForm({ onSuccess }: RegistroFormProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  
  const { agregarObjeto, isLoading, error } = useBusqueda();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !ubicacion.trim()) {
      setMensaje({
        texto: 'El nombre y la ubicación son obligatorios',
        tipo: 'error',
      });
      return;
    }
    
    try {
      const resultado = await agregarObjeto(nombre, descripcion, ubicacion);
      
      if (resultado) {
        setMensaje({
          texto: '¡Objeto registrado correctamente!',
          tipo: 'success',
        });
        
        // Limpiar el formulario
        setNombre('');
        setDescripcion('');
        setUbicacion('');
        
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess();
        }
        
        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      } else {
        setMensaje({
          texto: 'Error al registrar el objeto',
          tipo: 'error',
        });
      }
    } catch (err) {
      setMensaje({
        texto: 'Error al registrar el objeto',
        tipo: 'error',
      });
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registrar nuevo objeto</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Bombilla de nevera"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Bombilla pequeña de 15W para la nevera"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación *
          </label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Cajón de herramientas de la cocina"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Guardando...' : 'Guardar objeto'}
        </button>
      </form>
      
      {mensaje && (
        <div className={`mt-4 p-3 rounded-md ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {mensaje.texto}
        </div>
      )}
      
      {error && !mensaje && (
        <div className="mt-4 p-3 rounded-md bg-red-100 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}