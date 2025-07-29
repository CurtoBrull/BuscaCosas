import { Objeto } from './types';

/**
 * Función para buscar objetos por texto en nombre, descripción o ubicación
 * Implementa una búsqueda flexible que no requiere coincidencia exacta
 */
export function buscarObjetos(objetos: Objeto[], texto: string): Objeto[] {
  if (!texto.trim()) return objetos;
  
  const terminosBusqueda = texto.toLowerCase().split(/\s+/);
  
  return objetos.filter(objeto => {
    const textoObjeto = `${objeto.nombre} ${objeto.descripcion} ${objeto.ubicacion}`.toLowerCase();
    
    // Un objeto coincide si contiene todos los términos de búsqueda
    return terminosBusqueda.every(termino => textoObjeto.includes(termino));
  });
}

/**
 * Función para simular una respuesta de IA a una pregunta en lenguaje natural
 * En el futuro, esto se reemplazará con una integración real con Gemini
 */
export function simularRespuestaIA(pregunta: string, objetos: Objeto[]): { respuesta: string, objetosEncontrados: Objeto[] } {
  const preguntaLower = pregunta.toLowerCase();
  let respuesta = '';
  let objetosEncontrados: Objeto[] = [];
  
  // Extraer palabras clave de la pregunta
  const palabrasClave = preguntaLower
    .replace(/[¿?¡!.,;:]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3); // Filtrar palabras cortas
  
  // Buscar objetos relacionados con las palabras clave
  objetosEncontrados = buscarObjetos(objetos, palabrasClave.join(' '));
  
  // Generar respuesta según el tipo de pregunta y resultados
  if (preguntaLower.includes('dónde está') || preguntaLower.includes('donde esta')) {
    if (objetosEncontrados.length > 0) {
      const objeto = objetosEncontrados[0];
      respuesta = `${objeto.nombre} está en ${objeto.ubicacion}.`;
    } else {
      respuesta = 'No encontré ese objeto en mi base de datos.';
    }
  } else if (preguntaLower.includes('tengo') || preguntaLower.startsWith('hay')) {
    if (objetosEncontrados.length > 0) {
      respuesta = `Sí, encontré ${objetosEncontrados.length} objeto(s) relacionado(s) con tu búsqueda.`;
    } else {
      respuesta = 'No encontré ningún objeto que coincida con tu búsqueda.';
    }
  } else {
    if (objetosEncontrados.length > 0) {
      respuesta = `Encontré ${objetosEncontrados.length} objeto(s) que podrían ser relevantes para tu búsqueda.`;
    } else {
      respuesta = 'No encontré objetos relacionados con tu búsqueda. ¿Puedes ser más específico?';
    }
  }
  
  return { respuesta, objetosEncontrados };
}