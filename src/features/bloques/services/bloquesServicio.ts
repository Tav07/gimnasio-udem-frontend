import { httpClient } from '@/features/common/http/httpClient';
import { Paginado } from '@/features/common/domain/tipos';
import { BloqueConCupos } from '../domain/tipos';

export async function listarBloquesConCupos(fecha: string): Promise<BloqueConCupos[]> {
  const respuesta = await httpClient.get<Paginado<BloqueConCupos>>(
    `/bloques?fecha=${fecha}&limit=50`,
  );
  return respuesta.data;
}
