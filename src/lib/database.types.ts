export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      objetos: {
        Row: {
          id: number;
          nombre: string;
          descripcion: string;
          ubicacion: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          nombre: string;
          descripcion: string;
          ubicacion: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          nombre?: string;
          descripcion?: string;
          ubicacion?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};