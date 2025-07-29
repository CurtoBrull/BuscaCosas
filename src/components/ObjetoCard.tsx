import React, { useState } from 'react';
import { Objeto, ObjetoInput } from '@/lib/types';
import { useBusqueda } from '@/lib/hooks';

interface ObjetoCardProps {
  objeto: Objeto;
  onUpdate?: (objetoActualizado: Objeto) => void;
}

export default function ObjetoCard({ objeto, onUpdate }: ObjetoCardProps) {
  const { actualizarObjeto, isLoading, error } = useBusqueda();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ObjetoInput>({
    nombre: objeto.nombre,
    descripcion: objeto.descripcion,
    ubicacion: objeto.ubicacion
  });
  const [mensaje, setMensaje] = useState<{ tipo: 'error' | 'exito'; texto: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.ubicacion) {
      setMensaje({ tipo: 'error', texto: 'El nombre y la ubicación son obligatorios' });
      return;
    }

    try {
      const objetoActualizado = await actualizarObjeto(objeto.id, formData);
      if (objetoActualizado && onUpdate) {
        onUpdate(objetoActualizado);
        setMensaje({ tipo: 'exito', texto: 'Objeto actualizado correctamente' });
        setTimeout(() => {
          setIsEditing(false);
          setMensaje(null);
        }, 2000);
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar el objeto' });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow">
      {!isEditing ? (
        // Vista normal
        <>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{objeto.nombre}</h3>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
              </svg>
              Editar
            </button>
          </div>
          
          {objeto.descripcion && (
            <p className="text-gray-600 mt-1">{objeto.descripcion}</p>
          )}
          
          <div className="mt-3 flex items-start">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-blue-500 mr-2 mt-0.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <p className="text-gray-700">
              <span className="font-medium">Ubicación:</span> {objeto.ubicacion}
            </p>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Registrado: {new Date(objeto.created_at).toLocaleDateString()}
          </div>
        </>
      ) : (
        // Formulario de edición
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          {mensaje && (
            <div className={`p-2 rounded ${mensaje.tipo === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {mensaje.texto}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  nombre: objeto.nombre,
                  descripcion: objeto.descripcion,
                  ubicacion: objeto.ubicacion
                });
                setMensaje(null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}