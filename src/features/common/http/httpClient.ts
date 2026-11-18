import { API_HOST } from '../config/api';
import { ErrorApi, ErrorDeApi } from '../domain/tipos';

// Este módulo es el ÚNICO lugar del proyecto que llama a fetch. Los componentes
// usan hooks, los hooks usan services y los services usan httpClient.

const LLAVE_DEL_TOKEN = 'gimnasio-udem.token';

export function guardarToken(token: string): void {
  localStorage.setItem(LLAVE_DEL_TOKEN, token);
}

export function obtenerToken(): string | null {
  return localStorage.getItem(LLAVE_DEL_TOKEN);
}

export function limpiarToken(): void {
  localStorage.removeItem(LLAVE_DEL_TOKEN);
}

function urlDe(ruta: string): string {
  return `${API_HOST}/api${ruta}`;
}

function cabeceras(conJson: boolean): Record<string, string> {
  const cabeceras: Record<string, string> = {};
  if (conJson) {
    cabeceras['Content-Type'] = 'application/json';
  }
  const token = obtenerToken();
  if (token) {
    cabeceras.Authorization = `Bearer ${token}`;
  }
  return cabeceras;
}

async function errorDe(respuesta: Response): Promise<ErrorDeApi> {
  let errorApi: ErrorApi = { mensaje: 'Error del servidor' };
  try {
    const cuerpo = (await respuesta.json()) as { error?: ErrorApi };
    if (cuerpo?.error) {
      errorApi = cuerpo.error;
    }
  } catch {
    // El cuerpo no era JSON; queda el mensaje por defecto.
  }
  return new ErrorDeApi(errorApi, respuesta.status);
}

// Un 401 vencido saca al usuario del sitio salvo que ya esté logueándose
// (el login también responde 401 con credenciales malas).
function manejarSesionVencida(): void {
  limpiarToken();
  if (!window.location.pathname.startsWith('/login')) {
    // Recarga completa a propósito: al vencer la sesión hay que soltar también
    // el estado de la app (contexto, caché en memoria); httpClient vive fuera de React.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = '/login';
  }
}

async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(urlDe(ruta), opciones);
  if (respuesta.status === 401 && !ruta.startsWith('/auth/login')) {
    manejarSesionVencida();
  }
  if (!respuesta.ok) {
    throw await errorDe(respuesta);
  }
  if (respuesta.status === 204) {
    return undefined as T;
  }
  return (await respuesta.json()) as T;
}

export const httpClient = {
  async get<T>(ruta: string): Promise<T> {
    return pedir(ruta, { method: 'GET', headers: cabeceras(false) });
  },

  async post<T>(ruta: string, cuerpo?: unknown): Promise<T> {
    return pedir(ruta, {
      method: 'POST',
      headers: cabeceras(true),
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  },

  async patch<T>(ruta: string, cuerpo?: unknown): Promise<T> {
    return pedir(ruta, {
      method: 'PATCH',
      headers: cabeceras(true),
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  },

  async delete<T>(ruta: string): Promise<T> {
    return pedir(ruta, { method: 'DELETE', headers: cabeceras(false) });
  },

  // multipart/form-data para subida de imágenes; el navegador pone el Content-Type.
  async postForm<T>(ruta: string, formulario: FormData): Promise<T> {
    return pedir(ruta, { method: 'POST', headers: cabeceras(false), body: formulario });
  },

  async patchForm<T>(ruta: string, formulario: FormData): Promise<T> {
    return pedir(ruta, { method: 'PATCH', headers: cabeceras(false), body: formulario });
  },
};
