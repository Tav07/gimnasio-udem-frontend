# Aplicación web del gimnasio UdeM

Sistema de reservas del gimnasio de la Universidad de Medellín. La persona registra la sesión, reserva una franja de dos horas en la única zona de máquinas, puede cambiar de bloque o cancelar, y el administrador lleva el catálogo, los bloques y el control de acceso del día. Este repositorio es la interfaz, escrita con Next.js; la API está en `gimnasio-udem-backend`.

## Despliegues

- Aplicación web en producción: pendiente de enlazar (se completa al desplegar en Vercel).
- API en producción: pendiente de enlazar (repositorio `gimnasio-udem-backend`, desplegado en Render o Railway).

## Cómo correr en local

Requisitos: Node.js 20 o superior. La web se conecta a la API del otro repositorio, así que corre primero el backend (por defecto escucha en http://localhost:3001).

```bash
npm install
npm run dev   # arranca en http://localhost:3000
```

Los demás comandos: `npm run build` (compilación de producción), `npm run lint`, `npm run format` y `npm run format:check`.

## Variables de entorno

El proyecto necesita una sola variable, guardada en `.env`. El repositorio trae `.env.example` como plantilla.

| Variable               | Para qué sirve                                        |
| ---------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_API_HOST` | Base de la API; `http://localhost:3001` en desarrollo |

En producción la variable debe apuntar a la URL pública de la API, por ejemplo `https://gimnasio-udem-api.onrender.com`. Vercel la lee al construir.

## Estructura

Las rutas viven en `src/app` y cada pantalla solo compone piezas; la lógica vive en `src/features`, organizada por dominio (`auth`, `maquinas`, `bloques`, `reservas`, `common`). Dentro de cada feature hay cuatro capas: `domain` (tipos y reglas de calendario), `services` (llamadas a la API), `hooks` (estado y lógica) y `components` (visual, recibe props). Dos reglas sostienen el orden: ningún componente llama a `fetch` directamente, porque `common/http/httpClient` es el único punto de contacto con la API y ahí se agregan el token y el manejo de errores; y ninguna ruta maneja la sesión sola, porque los guards de `(auth)`, `(privado)` y `admin` redirigen según el `SesionProvider`.

El token se guarda en `localStorage` y la sesión se recupera al montar con `GET /api/auth/me`, así que refrescar la página no la pierde. El logout borra el token. Si la API responde `401`, el cliente borra la sesión y manda a `/login`.

## Reparto del trabajo

Todo el desarrollo está a cargo de Gustavo Andres Mendez Barrera.

## Credenciales de prueba

Las crea el seed del backend (`prisma/seed.ts`):

| Rol                                | Correo                   | Contraseña  |
| ---------------------------------- | ------------------------ | ----------- |
| ADMIN (administrador del gimnasio) | admin@gimnasioudem.com   | admin1234   |
| USUARIO (estudiante)               | usuario@gimnasioudem.com | usuario1234 |
