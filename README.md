# BuscaCosas

Aplicación web fullstack para uso doméstico que ayuda a recordar y encontrar la ubicación de objetos en casa.

## Características

- Registro de objetos con nombre, descripción y ubicación
- Búsqueda de objetos mediante preguntas en lenguaje natural
- Búsqueda flexible y tolerante a palabras clave
- Base de datos PostgreSQL serverless con [Neon](https://neon.tech)
- Frontend y backend con Next.js y TypeScript

## Tecnologías utilizadas

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- React Hooks personalizados

## Estructura del proyecto

```
/src
  /app             # Páginas y rutas de la aplicación
    /api           # API Routes para el backend
      /objetos     # Endpoints para gestionar objetos
      /ia          # Endpoint para consultas en lenguaje natural
  /components      # Componentes React reutilizables
  /lib             # Lógica de conexión a BBDD y utilidades
```

## Configuración del proyecto

### Requisitos previos

- Node.js 18.x o superior
- Cuenta en [Neon](https://console.neon.tech/)

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/CurtoBrull/BuscaCosas.git
cd BuscaCosas
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto con tu cadena de conexión de Neon:

```env
DATABASE_URL="postgresql://usuario:password@ep-...neon.tech/neondb?sslmode=require"
```

### Configuración de la base de datos en Neon

1. Crea un proyecto en [Neon Console](https://console.neon.tech/).
2. Ve a la pestaña **SQL Editor** en Neon y ejecuta el contenido de `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS objetos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  ubicacion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_objetos_created_at ON objetos(created_at DESC);
```

3. Copia la cadena de conexión (`DATABASE_URL`) desde el Dashboard de Neon y pégala en tu `.env.local`.

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Despliegue en Vercel

1. Sube tu proyecto a un repositorio GitHub/GitLab.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Añade la variable de entorno `DATABASE_URL` con tu cadena de conexión de Neon.
4. Despliega.

## Licencia

MIT
