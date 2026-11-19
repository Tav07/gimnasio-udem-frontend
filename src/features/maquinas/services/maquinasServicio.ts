import { httpClient } from '@/features/common/http/httpClient';
import { Paginado } from '@/features/common/domain/tipos';
import { DatosDeMaquina, FiltrosDeMaquinas, Maquina } from '../domain/tipos';

// Los services son la única capa de la feature que arma las rutas de la API.

export async function listarMaquinas(filtros: FiltrosDeMaquinas): Promise<Paginado<Maquina>> {
  const consulta = new URLSearchParams({ page: String(filtros.pagina) });
  if (filtros.categoria) {
    consulta.set('categoria', filtros.categoria);
  }
  if (filtros.buscar) {
    consulta.set('buscar', filtros.buscar);
  }
  if (filtros.estado) {
    consulta.set('estado', filtros.estado);
  }
  return httpClient.get<Paginado<Maquina>>(`/maquinas?${consulta.toString()}`);
}

export async function obtenerMaquina(id: string): Promise<Maquina> {
  return httpClient.get<Maquina>(`/maquinas/${id}`);
}

// La imagen siempre viaja como archivo en multipart/form-data.
export async function crearMaquina(datos: DatosDeMaquina, imagen: File | null): Promise<Maquina> {
  const formulario = new FormData();
  formulario.set('nombre', datos.nombre);
  formulario.set('descripcion', datos.descripcion);
  formulario.set('categoria', datos.categoria);
  if (imagen) {
    formulario.set('imagen', imagen);
  }
  const respuesta = await httpClient.postForm<{ data: Maquina }>('/maquinas', formulario);
  return respuesta.data;
}

// La imagen es opcional en edición: si llega, el backend reemplaza la actual.
export async function editarMaquina(
  id: string,
  datos: DatosDeMaquina & { estado: Maquina['estado'] },
  imagen: File | null,
): Promise<Maquina> {
  const formulario = new FormData();
  formulario.set('nombre', datos.nombre);
  formulario.set('descripcion', datos.descripcion);
  formulario.set('categoria', datos.categoria);
  formulario.set('estado', datos.estado);
  if (imagen) {
    formulario.set('imagen', imagen);
  }
  const respuesta = await httpClient.patchForm<{ data: Maquina }>(`/maquinas/${id}`, formulario);
  return respuesta.data;
}

export async function eliminarMaquina(id: string): Promise<void> {
  await httpClient.delete(`/maquinas/${id}`);
}
