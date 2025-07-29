# BuscaCosas

Aplicación web fullstack para uso doméstico que ayuda a recordar y encontrar la ubicación de objetos en casa.

## Características

- Registro de objetos con nombre, descripción y ubicación
- Búsqueda de objetos mediante preguntas en lenguaje natural
- Búsqueda flexible y tolerante a palabras clave
- Base de datos PostgreSQL con Supabase
- Frontend y backend con Next.js y TypeScript

## Tecnologías utilizadas

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- React Hooks personalizados

## Estructura del proyecto

```
/src
  /app             # Páginas y rutas de la aplicación
    /api           # API Routes para el backend
      /objetos     # Endpoints para gestionar objetos
      /ia          # Endpoint para consultas en lenguaje natural
  /components      # Componentes React reutilizables
  /lib             # Lógica de negocio y utilidades
```

## Configuración del proyecto

### Requisitos previos

- Node.js 18.x o superior
- Cuenta en Supabase

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/buscacosas.git
cd buscacosas
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
```

### Configuración de Supabase

1. Crea una nueva base de datos en Supabase
2. Crea una tabla `objetos` con los siguientes campos:
   - `id`: int8 (primary key, auto-increment)
   - `nombre`: text (not null)
   - `descripcion`: text
   - `ubicacion`: text (not null)
   - `created_at`: timestamptz (default: now())
   - `updated_at`: timestamptz (nullable)

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Despliegue en Vercel

La forma más sencilla de desplegar esta aplicación es utilizando [Vercel](https://vercel.com):

1. Crea una cuenta en Vercel si aún no tienes una
2. Conecta tu repositorio de GitHub/GitLab/Bitbucket
3. Importa el proyecto
4. Configura las variables de entorno en la configuración del proyecto en Vercel
5. Despliega

## Futuras mejoras

- Integración con Gemini para mejorar la interpretación de consultas en lenguaje natural
- Categorización de objetos
- Búsqueda por ubicación
- Historial de búsquedas
- Imágenes de objetos

## Licencia

MIT
