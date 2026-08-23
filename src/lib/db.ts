import { neon } from '@neondatabase/serverless';

/**
 * Obtiene el cliente SQL de Neon evaluando la variable de entorno actual
 */
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (
    !databaseUrl ||
    databaseUrl.trim() === '' ||
    databaseUrl.includes('tu-conexion-neon') ||
    databaseUrl.includes('example') ||
    (!databaseUrl.startsWith('postgres://') && !databaseUrl.startsWith('postgresql://'))
  ) {
    return null;
  }

  return neon(databaseUrl);
}
