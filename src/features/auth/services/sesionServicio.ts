import {
  httpClient,
  guardarToken,
  obtenerToken,
  limpiarToken,
} from '@/features/common/http/httpClient';
import { DatosDeSesion, RegistroNuevo, UsuarioActivo } from '../domain/tipos';

// Los services son la única capa que habla con la API de autenticación.
export async function registrar(datos: RegistroNuevo): Promise<UsuarioActivo> {
  const sesion = await httpClient.post<DatosDeSesion>('/auth/register', datos);
  guardarToken(sesion.token);
  return sesion.usuario;
}

export async function iniciarSesion(email: string, password: string): Promise<UsuarioActivo> {
  const sesion = await httpClient.post<DatosDeSesion>('/auth/login', { email, password });
  guardarToken(sesion.token);
  return sesion.usuario;
}

// /auth/me recupera al usuario con el token guardado, así la sesión
// sobrevive al refrescar la página.
export async function obtenerActual(): Promise<UsuarioActivo | null> {
  if (!obtenerToken()) {
    return null;
  }
  return httpClient.get<UsuarioActivo>('/auth/me');
}

export function cerrarSesion(): void {
  limpiarToken();
}
