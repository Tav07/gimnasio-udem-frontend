import { httpClient } from '@/features/common/http/httpClient';
import { Paginado } from '@/features/common/domain/tipos';
import { FiltrosDeMaquinas, Maquina } from '../domain/tipos';

// Los services son la única capa de la feature que arma las rutas de la API.

export async function listarMaquinas(filtros: FiltrosDeMaquinas): Promise<Paginado<Maquina>> {
  const consulta = new URLSearchParams({ page: String(filtros.pagina) });
  if (filtros.categoria) {
    consulta.set('categoria', filtros.categoria);
  }
  if (filtros.buscar) {
    consulta.set('buscar', filtros.buscar);
  }
  return httpClient.get<Paginado<Maquina>>(`/maquinas?${consulta.toString()}`);
}

export async function obtenerMaquina(id: string): Promise<Maquina> {
  return httpClient.get<Maquina>(`/maquinas/${id}`);
}
