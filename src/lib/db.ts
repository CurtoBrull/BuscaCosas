import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

/**
 * Indica si la variable de conexión a Neon está configurada correctamente
 */
export const isDbConfigured = Boolean(
  databaseUrl &&
  databaseUrl.trim() !== '' &&
  !databaseUrl.includes('tu-conexion-neon') &&
  !databaseUrl.includes('example') &&
  (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))
);

/**
 * Cliente SQL de Neon para consultas serverless
 */
export const sql = isDbConfigured ? neon(databaseUrl!) : null;
