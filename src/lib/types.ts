export interface Objeto {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  created_at: string;
  updated_at: string | null;
}

export interface ObjetoInput {
  nombre: string;
  descripcion: string;
  ubicacion: string;
}

export interface BusquedaResponse {
  objetos: Objeto[];
  mensaje?: string;
}

export interface IAResponse {
  respuesta: string;
  objetos?: Objeto[];
}