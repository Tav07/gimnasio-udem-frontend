import { httpClient } from '@/features/common/http/httpClient';
import { Paginado } from '@/features/common/domain/tipos';
import { EstadoReserva, Reserva } from '../domain/tipos';

export async function crearReserva(bloqueId: string, fecha: string): Promise<Reserva> {
  const respuesta = await httpClient.post<{ data: Reserva }>('/reservas', { bloqueId, fecha });
  return respuesta.data;
}

export interface FiltrosDeReservas {
  pagina: number;
  estado?: EstadoReserva;
  fecha?: string;
  limite: number;
}

export async function listarReservas(filtros: FiltrosDeReservas): Promise<Paginado<Reserva>> {
  const consulta = new URLSearchParams({
    page: String(filtros.pagina),
    limit: String(filtros.limite),
  });
  if (filtros.estado) {
    consulta.set('estado', filtros.estado);
  }
  if (filtros.fecha) {
    consulta.set('fecha', filtros.fecha);
  }
  return httpClient.get<Paginado<Reserva>>(`/reservas?${consulta.toString()}`);
}

export async function cambiarBloque(reservaId: string, bloqueId: string): Promise<Reserva> {
  const respuesta = await httpClient.patch<{ data: Reserva }>(`/reservas/${reservaId}`, {
    bloqueId,
  });
  return respuesta.data;
}

export async function cancelarReserva(reservaId: string): Promise<void> {
  await httpClient.delete(`/reservas/${reservaId}`);
}
