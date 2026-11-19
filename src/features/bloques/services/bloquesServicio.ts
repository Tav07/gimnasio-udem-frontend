import { httpClient } from '@/features/common/http/httpClient';
import { Paginado } from '@/features/common/domain/tipos';
import { BloqueConCupos, EstadoRegistro } from '../domain/tipos';

export async function listarBloquesConCupos(fecha: string): Promise<BloqueConCupos[]> {
  const respuesta = await httpClient.get<Paginado<BloqueConCupos>>(
    `/bloques?fecha=${fecha}&limit=50`,
  );
  return respuesta.data;
}

export interface FiltrosDeBloques {
  pagina: number;
  estado?: EstadoRegistro;
}

export async function listarBloques(filtros: FiltrosDeBloques): Promise<Paginado<BloqueConCupos>> {
  const consulta = new URLSearchParams({ page: String(filtros.pagina), limit: '20' });
  if (filtros.estado) {
    consulta.set('estado', filtros.estado);
  }
  return httpClient.get<Paginado<BloqueConCupos>>(`/bloques?${consulta.toString()}`);
}

export interface DatosDeBloque {
  horaInicio: string;
  horaFin: string;
  aforo?: number;
}

export async function crearBloque(datos: DatosDeBloque): Promise<BloqueConCupos> {
  const respuesta = await httpClient.post<{ data: BloqueConCupos }>('/bloques', datos);
  return respuesta.data;
}

export async function editarBloque(
  id: string,
  datos: DatosDeBloque & { estado?: EstadoRegistro },
): Promise<BloqueConCupos> {
  const respuesta = await httpClient.patch<{ data: BloqueConCupos }>(`/bloques/${id}`, datos);
  return respuesta.data;
}

export async function eliminarBloque(id: string): Promise<void> {
  await httpClient.delete(`/bloques/${id}`);
}
