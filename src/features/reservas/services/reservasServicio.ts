import { httpClient } from '@/features/common/http/httpClient';
import { Reserva } from '../domain/tipos';

export async function crearReserva(bloqueId: string, fecha: string): Promise<Reserva> {
  const respuesta = await httpClient.post<{ data: Reserva }>('/reservas', { bloqueId, fecha });
  return respuesta.data;
}
