'use client';

import { Suspense, lazy } from 'react';

// Importar componentes del lado del cliente de forma dinámica
const RegistroForm = lazy(() => import('@/components/RegistroForm'));
const BusquedaForm = lazy(() => import('@/components/BusquedaForm'));
const ListaObjetos = lazy(() => import('@/components/ListaObjetos'));

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">BuscaCosas</h1>
          <p className="text-gray-600 text-sm mt-1">Encuentra fácilmente tus objetos en casa</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Suspense fallback={<div className="p-4 bg-white shadow rounded-lg">Cargando formulario de búsqueda...</div>}>
                <BusquedaForm />
              </Suspense>
              
              <Suspense fallback={<div className="p-4 bg-white shadow rounded-lg">Cargando lista de objetos...</div>}>
                <ListaObjetos />
              </Suspense>
            </div>
            
            <div>
              <Suspense fallback={<div className="p-4 bg-white shadow rounded-lg">Cargando formulario de registro...</div>}>
                <RegistroForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            BuscaCosas - Aplicación para gestionar y encontrar objetos en casa
          </p>
        </div>
      </footer>
    </div>
  );
}
