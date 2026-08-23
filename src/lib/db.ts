import { neon } from '@neondatabase/serverless';

/**
 * Obtiene el cliente SQL de Neon evaluando y sanitizando la variable de entorno actual
 */
export function getDb() {
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return null;
  }

  // Limpiar espacios y posibles comillas dobles o simples que se hayan pegado en Vercel
  databaseUrl = databaseUrl.trim().replace(/^["']|["']$/g, '');

  if (
    databaseUrl === '' ||
    databaseUrl.includes('tu-conexion-neon') ||
    databaseUrl.includes('example') ||
    (!databaseUrl.startsWith('postgres://') && !databaseUrl.startsWith('postgresql://'))
  ) {
    return null;
  }

  try {
    return neon(databaseUrl);
  } catch (err) {
    console.error('Error al inicializar cliente Neon:', err);
    return null;
  }
}
