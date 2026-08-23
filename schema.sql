-- Tabla para almacenar los objetos y su ubicación
CREATE TABLE IF NOT EXISTS objetos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  ubicacion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Índice para optimizar búsquedas por fecha de creación
CREATE INDEX IF NOT EXISTS idx_objetos_created_at ON objetos(created_at DESC);
