import { Objeto } from './types';

// Datos de ejemplo para usar en desarrollo
export const mockObjetos: Objeto[] = [
  {
    id: 1,
    nombre: 'Bombilla de nevera',
    descripcion: 'Bombilla pequeña de 15W para la nevera',
    ubicacion: 'Cajón de herramientas de la cocina',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: 2,
    nombre: 'Destornillador Phillips',
    descripcion: 'Destornillador de estrella mediano',
    ubicacion: 'Caja de herramientas del garaje',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: 3,
    nombre: 'Pilas AAA',
    descripcion: 'Paquete de 4 pilas alcalinas',
    ubicacion: 'Primer cajón del escritorio',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: 4,
    nombre: 'Cargador de iPhone',
    descripcion: 'Cable Lightning blanco original',
    ubicacion: 'Segundo cajón de la mesita de noche',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  {
    id: 5,
    nombre: 'Llave de repuesto',
    descripcion: 'Llave de la puerta principal',
    ubicacion: 'Colgador de llaves en la entrada',
    created_at: new Date().toISOString(),
    updated_at: null,
  },
];