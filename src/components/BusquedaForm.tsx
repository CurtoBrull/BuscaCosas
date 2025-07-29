'use client';

import React, { useState, useEffect } from 'react';
import { useBusqueda } from '@/lib/hooks';
import ObjetoCard from './ObjetoCard';

export default function BusquedaForm() {
  const [pregunta, setPregunta] = useState('');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  
  const {
    isLoading,
    error,
    resultados,
    respuestaIA,
    buscarConIA,
  } = useBusqueda();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pregunta.trim()) return;
    
    await buscarConIA(pregunta);
    setBusquedaRealizada(true);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Buscar objetos</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="¿Dónde está la bombilla de la nevera?"
          />
          <button
            type="submit"
            disabled={isLoading || !pregunta.trim()}
            className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Buscando
              </span>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-3 rounded-md bg-red-100 text-red-800 mb-4">
          {error}
        </div>
      )}
      
      {busquedaRealizada && (
        <div className="space-y-4">
          {respuestaIA && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-800">{respuestaIA}</p>
            </div>
          )}
          
          {resultados.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                {resultados.length === 1 
                  ? '1 objeto encontrado' 
                  : `${resultados.length} objetos encontrados`}
              </h3>
              <div className="space-y-3">
                {resultados.map((objeto) => (
                  <ObjetoCard key={objeto.id} objeto={objeto} />
                ))}
              </div>
            </div>
          ) : respuestaIA ? null : (
            <p className="text-gray-600">No se encontraron objetos que coincidan con tu búsqueda.</p>
          )}
        </div>
      )}
      
      {!busquedaRealizada && !isLoading && (
        <div className="text-center py-6 text-gray-500">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <p>Realiza una búsqueda para encontrar tus objetos</p>
        </div>
      )}
    </div>
  );
}